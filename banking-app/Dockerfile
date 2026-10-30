# Use pinned, minimal base image
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create and switch to non-root user (Ben Secure security requirement)[cite: 3]
RUN useradd -m appuser
USER appuser

EXPOSE 5090

CMD ["gunicorn", "--bind", "0.0.0.0:5090", "app:app"]