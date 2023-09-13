from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from api.openai import openai_api
from api.acs import acs_api

app = Flask(__name__)
CORS(app)
URL_PREFIX = '/api'

# Create a Blueprint for the API routes
app.register_blueprint(openai_api, url_prefix=URL_PREFIX)
app.register_blueprint(acs_api, url_prefix=URL_PREFIX)

# Middleware to block .schema files
@app.before_request
def block_schema_files():
    if request.path.endswith('.schema'):
        return "Access to this file is forbidden.", 403

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port)

# flask run --port 3000 --debug
