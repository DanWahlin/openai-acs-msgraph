from flask import Blueprint, jsonify

# Create a Blueprint for the API routes
acs_api = Blueprint('acs_api', __name__)

@acs_api.route('/createACSToken', methods=['GET'])
def create_acs_token():
    return jsonify({"message": "createACSToken"})