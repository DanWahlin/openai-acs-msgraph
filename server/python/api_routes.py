from flask import Blueprint, jsonify

# Create a Blueprint for the API routes
api_routes = Blueprint('api_routes', __name__)

@api.route('/endpoint1')
def endpoint1():
    return jsonify({"message": "Endpoint 1"})

@api.route('/endpoint2')
def endpoint2():
    return jsonify({"message": "Endpoint 2"})
