from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
import psycopg2
import sys
import os

try:
    conn = psycopg2.connect(os.environ.get("DB_URL"))
    conn.autocommit = True

except Exception as e:
    print(f"Error connecting to Database: {e}")
    sys.exit(1)

cur = conn.cursor()

person_routes = Blueprint('person_routes', __name__)


@person_routes.route("/people")
@cross_origin()
def people_list():
    try:
        cur.execute(
            "SELECT * FROM Person")
    except Exception as e:
        print(e)
        return f"Error: {e}"
    people = []
    for column in cur:
        row = {"id": column[0],
               "firstName": column[1],
               "surname": column[2],
               "email": column[3],
               "telephoneNumber": column[4],
               "dateOfBirth": str(column[5]),
               "companyCount": column[6],
               }
        people.append(row)
    return jsonify(people)


@person_routes.route("/people/create", methods=["POST"])
@cross_origin()
def create_person():
    first_name = request.json['first_name']
    surname = request.json['surname']
    try:
        cur.execute(
            "INSERT INTO Person (FirstName, Surname) VALUES (%s, %s)",
            (first_name, surname))
    except Exception as e:
        print(e)
        return f"Error: {e}"

    return jsonify({"FirstName": first_name, "Surname": surname})


@person_routes.route("/people/delete/<int:person_id>", methods=["DELETE"])
@cross_origin()
def delete_person(person_id):
    try:
        cur.execute(
            f"DELETE FROM Person WHERE Id = {person_id}")
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE PersonId = {person_id}"
        )
    except Exception as e:
        print(e)
        return f"Error: {e}"
    return "Success"


@person_routes.route("/people/update/<int:person_id>", methods=["PUT"])
@cross_origin()
def update_person(person_id):
    new_first_name = request.json['first_name']
    new_surname = request.json['surname']
    try:
        cur.execute(
            f"UPDATE Person SET FirstName = '{new_first_name}', Surname = '{new_surname}' WHERE id = {person_id}")
    except Exception as e:
        print(e)
        return f"Error: {e}"

    return jsonify({"FirstName": new_first_name, "Surname": new_surname})