FROM python:3.11

WORKDIR /app

# Copy dependency files first
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install watchdog  # For live reload

# Copy application files
COPY . .

# Expose Flask port
EXPOSE 5000

# Run database migrations and start Flask with live reload
CMD ["sh", "-c", "flask db upgrade && watchmedo auto-restart --directory=. --pattern=*.py --recursive -- flask run --host=0.0.0.0 --port=5000 --debug"]
