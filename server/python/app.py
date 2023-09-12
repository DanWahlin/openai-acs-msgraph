from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from api_routes import api_routes
app = Flask(__name__)
CORS(app)

# Create a Blueprint for the API routes
app.register_blueprint(api_routes, url_prefix='/api')

# Middleware to block .schema files
@app.before_request
def block_schema_files():
    if request.path.endswith('.schema'):
        return "Access to this file is forbidden.", 403

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)

# flask run --port 3000
