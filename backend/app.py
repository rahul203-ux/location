from flask import Flask
from flask_cors import CORS
from config import Config
from routes.location_routes import location_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

app.register_blueprint(location_bp)

if __name__ == "__main__":
    app.run()
