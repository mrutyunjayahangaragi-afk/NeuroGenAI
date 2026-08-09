"""
RAG Service for Neuro Gen AI 2.0
Implements: knowledge base chunking → sentence-transformers embeddings → FAISS index → semantic retrieval.
Uses free local models — no API key required.
"""
from __future__ import annotations
import os
import re
import textwrap
from typing import Optional
import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
#  AVAILABILITY CHECK
# ─────────────────────────────────────────────────────────────────────────────
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    TFIDF_AVAILABLE = True
except ImportError:
    TFIDF_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    ST_AVAILABLE = True
except ImportError:
    ST_AVAILABLE = False

RAG_AVAILABLE = TFIDF_AVAILABLE or ST_AVAILABLE

KNOWLEDGE_BASE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "knowledge_base",
    "eeg_schizophrenia.md"
)

EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE       = 500    # characters
CHUNK_OVERLAP    = 100    # characters


# ─────────────────────────────────────────────────────────────────────────────
#  TEXT CHUNKING
# ─────────────────────────────────────────────────────────────────────────────
def _load_and_chunk(path: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[dict]:
    """Load markdown file and split into overlapping text chunks with metadata."""
    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    # Split by section headers to preserve context
    sections = re.split(r"\n#{1,3} ", text)

    chunks = []
    for section in sections:
        section = section.strip()
        if len(section) < 50:
            continue

        # Extract section title (first line)
        lines = section.split("\n", 1)
        title = lines[0].strip("# ").strip() if lines else "General"
        body  = lines[1].strip() if len(lines) > 1 else section

        # Slide a window across the body
        start = 0
        while start < len(body):
            end   = min(start + chunk_size, len(body))
            chunk = body[start:end].strip()
            if len(chunk) > 80:
                chunks.append({
                    "text":   chunk,
                    "source": title,
                    "start":  start,
                })
            start += chunk_size - overlap

    return chunks


# ─────────────────────────────────────────────────────────────────────────────
#  INDEX BUILDING  (cached via Streamlit)
# ─────────────────────────────────────────────────────────────────────────────
class RAGIndex:
    """Holds the embedding model, vector index, and chunk metadata."""

    def __init__(self):
        self.vectorizer: Optional[Any] = None
        self.tfidf_matrix: Optional[Any] = None
        self.st_model: Optional[Any] = None
        self.faiss_index: Optional[Any] = None
        self.chunks: list[dict] = []
        self.ready: bool = False
        self.error: Optional[str] = None

    def build(self) -> None:
        if not RAG_AVAILABLE:
            self.error = "No vector engine available."
            return

        try:
            self.chunks = _load_and_chunk(KNOWLEDGE_BASE_PATH)
            if not self.chunks:
                self.error = f"Knowledge base not found or empty: {KNOWLEDGE_BASE_PATH}"
                return

            texts = [c["text"] for c in self.chunks]

            if TFIDF_AVAILABLE:
                self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
                self.tfidf_matrix = self.vectorizer.fit_transform(texts)
                self.ready = True
            elif ST_AVAILABLE:
                self.st_model = SentenceTransformer(EMBED_MODEL_NAME)
                embeddings = self.st_model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
                embeddings = np.array(embeddings, dtype="float32")
                dim = embeddings.shape[1]
                self.faiss_index = faiss.IndexFlatIP(dim)
                self.faiss_index.add(embeddings)
                self.ready = True

        except Exception as e:
            self.error = str(e)
            self.ready = False

    def retrieve(self, query: str, top_k: int = 4) -> list[dict]:
        """
        Retrieve top_k chunks most relevant to the query.
        Returns list of dicts: {text, source, score}.
        """
        if not self.ready:
            return []

        try:
            if self.vectorizer is not None and self.tfidf_matrix is not None:
                q_vec = self.vectorizer.transform([query])
                sims = cosine_similarity(q_vec, self.tfidf_matrix)[0]
                top_indices = np.argsort(sims)[::-1][:top_k]

                results = []
                for idx in top_indices:
                    score = float(sims[idx])
                    if score <= 0.0:
                        continue
                    chunk = self.chunks[idx]
                    results.append({
                        "text": chunk["text"],
                        "source": chunk["source"],
                        "score": round(score, 2),
                    })
                return results

            elif self.st_model is not None and self.faiss_index is not None:
                q_emb = self.st_model.encode([query], normalize_embeddings=True, show_progress_bar=False)
                q_emb = np.array(q_emb, dtype="float32")
                scores, indices = self.faiss_index.search(q_emb, top_k)

                results = []
                for score, idx in zip(scores[0], indices[0]):
                    if idx < 0 or idx >= len(self.chunks):
                        continue
                    chunk = self.chunks[idx]
                    results.append({
                        "text": chunk["text"],
                        "source": chunk["source"],
                        "score": float(score),
                    })
                return results

        except Exception:
            return []
        return []


# ─────────────────────────────────────────────────────────────────────────────
#  CONTEXT BUILDER FOR LLM
# ─────────────────────────────────────────────────────────────────────────────
def build_rag_context(retrieved: list[dict]) -> str:
    """Format retrieved chunks into a clean context string for the LLM prompt."""
    if not retrieved:
        return ""

    lines = ["[RETRIEVED EVIDENCE FROM KNOWLEDGE BASE]"]
    for i, r in enumerate(retrieved, 1):
        lines.append(f"\nSource [{i}] — {r['source']} (relevance: {r['score']:.2f})")
        lines.append(textwrap.fill(r["text"], width=100))
        lines.append("")

    return "\n".join(lines)


def format_sources_for_display(retrieved: list[dict]) -> str:
    """Format sources as a readable bullet list for UI display."""
    if not retrieved:
        return "No relevant sources found in knowledge base."

    lines = []
    for i, r in enumerate(retrieved, 1):
        lines.append(f"**[{i}] {r['source']}** (relevance: {r['score']:.2f})")
        preview = r["text"][:200].replace("\n", " ") + "..."
        lines.append(f"> {preview}")
        lines.append("")
    return "\n".join(lines)
