import os
import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ.get("DB_PORT", 5432),
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
    )

@app.route("/")
def index():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify(status="ok", db="connected")
    except Exception as e:
        return jsonify(status="error", detail=str(e)), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
