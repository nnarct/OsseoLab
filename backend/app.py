from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://snpuser:snppassword@localhost:5432/senior-project")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a test route
@app.route('/')
def hello():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

