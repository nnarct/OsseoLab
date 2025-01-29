# Use official Python image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy dependency files first
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose Flask port
EXPOSE 5000

# Run the Flask application
CMD ["python", "app.py"]
