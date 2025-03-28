FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container
COPY . /app

# Set working directory
WORKDIR /app

# Create virtual environment explicitly with the system Python
RUN uv venv --python /usr/local/bin/python

# Install dependencies
RUN uv sync --frozen --no-cache

# Run the application
CMD ["/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]