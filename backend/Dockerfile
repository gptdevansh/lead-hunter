# ─────────────────────────────────────────────
# Stage 1 — Builder: install Python dependencies
# ─────────────────────────────────────────────
FROM python:3.12-slim-bookworm AS builder

WORKDIR /app

# psycopg2-binary ships pre-compiled wheels — no gcc needed.
# Only install libpq-dev so pip can link the binary correctly.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Isolated virtual-env so we can copy it cleanly to the runtime stage
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


# ─────────────────────────────────────────────
# Stage 2 — Runtime: minimal production image
# ─────────────────────────────────────────────
FROM python:3.12-slim-bookworm AS runtime

LABEL maintainer="LeadHunter Team"
LABEL description="LeadHunter FastAPI Backend — PostgreSQL"

# Runtime-only: libpq client libs + curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Non-root user for security
RUN groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy virtual env from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application source
COPY --chown=appuser:appgroup ./app ./app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
