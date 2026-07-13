from flask import Blueprint, request, jsonify
import sqlite3
from datetime import datetime

location_bp = Blueprint("location_bp", __name__)
DB_PATH = "backend/database.db"

# Initialize database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@location_bp.route("/location", methods=["POST"])
def receive_location():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    lat = data.get("latitude")
    lon = data.get("longitude")
    ts = datetime.utcnow().isoformat()

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO locations (latitude, longitude, timestamp) VALUES (?, ?, ?)',
              (lat, lon, ts))
    conn.commit()
    conn.close()

    return jsonify({"message": "Location stored"}), 200

@location_bp.route("/locations", methods=["GET"])
def get_locations():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT latitude, longitude, timestamp FROM locations')
    rows = c.fetchall()
    conn.close()

    locations = [{"latitude": row[0], "longitude": row[1], "timestamp": row[2]} for row in rows]
    return jsonify(locations), 200
