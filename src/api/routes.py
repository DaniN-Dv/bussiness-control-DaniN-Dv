"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Products, Client
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/serialize-clients", methods=["GET"])
def serialize_clients():

    clients = Client.query.all()

    clients = list(map(lambda item: item.serialize(), clients))

    return jsonify(clients), 200

@api.route("/serialize-products", methods=['GET'])
def serialize_products():

    products = Products.query.all()

    products = list(map(lambda item: item.serialize(), products))

    return jsonify(products), 200

@api.route("/add-client", methods=["POST"])
def add_clients():

    data_form = request.form

    name = data_form.get("name")

    if not name:
        return jsonify({"message": "Please put the name of the client that you want to add."}), 400
    
    client_exist = Client.query.filter_by(name=name).first()

    if client_exist:
        return jsonify({"message": "This client is already added."}), 409
    
    new_client = Client(
        name = name
    )

    db.session.add(new_client)

    try:
        db.session.commit()
        return jsonify({"message": "Client added successfully."}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error adding the client."}), 500


@api.route("/add-product", methods=["POST"])
def add_product():
    data_form = request.form

    name = data_form.get("name")
    price = data_form.get("price")

    if not name or not price:
        return jsonify({"message": "Please put all the information to add a product."}), 400
    
    product_exist = Products.query.filter_by(name=name).first()

    if product_exist:
        jsonify({"message": "This product already exist"}), 409

    new_product = Products(
        name = name,
        price = price
    )

    db.session.add(new_product)

    try:
        db.session.commit()
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error adding product", "Error": f"{error.args}"}), 500
