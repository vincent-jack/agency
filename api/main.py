from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mariadb
import sys
import os

try:
    conn = mariadb.connect(
        user="jackvincent",
        password=os.environ.get("USER_PASSWORD"),
        host="localhost",
        port=3306,
        database="Agency"

    )
    conn.autocommit = True

except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cur = conn.cursor()


def delete_row(row_id, table_name):
    try:
        cur.execute(
            f"DELETE FROM {table_name} WHERE Id = ?",
            (row_id,))
    except mariadb.Error as e:
        return f"Error: {e}"


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/companies")
@cross_origin()
def companies_list():
    try:
        cur.execute(
            "SELECT * FROM Company")
    except mariadb.Error as e:
        return f"Error: {e}"

    companies = []
    for column in cur:
        row = {"Id": column[0],
               "CompanyName": column[1],
               "Town": column[2]}
        companies.append(row)
    return jsonify(companies)


@app.route("/companies/create", methods=["POST"])
@cross_origin()
def create_company():
    new_company = request.json['company_name']
    new_company_town = request.json['town']
    try:
        cur.execute(
            "INSERT INTO Company (CompanyName, Town) VALUES (?, ?)",
            (new_company, new_company_town))
    except mariadb.Error as e:
        return f"Error: {e}"

    return jsonify({"Company": new_company, "Town": new_company_town})


@app.route("/companies/delete/<int:company_id>", methods=["DELETE"])
@cross_origin()
def delete_company(company_id):
    delete_row(row_id=company_id, table_name="Company")
    return jsonify({"success": True})


@app.route("/companies/update/<int:company_id>", methods=["PUT"])
@cross_origin()
def update_company(company_id):
    new_name = request.json['company_name']
    new_town = request.json['town']
    company_people = request.json['companyPeople']
    print(new_name)
    try:
        cur.execute(
            f'UPDATE Company SET CompanyName = "{new_name}", Town = "{new_town}" WHERE id = ?',
            (company_id,))
    except mariadb.Error as e:
        return f"Error: {e}"

    return jsonify({"Company": new_name, "Town": new_town, "Employees": company_people})


@app.route("/people")
@cross_origin()
def people_list():
    try:
        cur.execute(
            "SELECT * FROM Person")
    except mariadb.Error as e:
        return f"Error: {e}"

    people = []
    for column in cur:
        row = {"Id": column[0],
               "FirstName": column[1],
               "Surname": column[2]}
        people.append(row)
    return jsonify(people)


@app.route("/people/create", methods=["POST"])
@cross_origin()
def create_person():
    first_name = request.json['first_name']
    surname = request.json['surname']
    try:
        cur.execute(
            "INSERT INTO Person (FirstName, Surname) VALUES (?, ?)",
            (first_name, surname))
    except mariadb.Error as e:
        return f"Error: {e}"

    return f"FirstName: {first_name}, Surname: {surname}, was successfully added."


@app.route("/people/delete/<int:person_id>", methods=["DELETE"])
@cross_origin()
def delete_person(person_id):
    delete_row(row_id=person_id, table_name="Person")
    return f"Person {person_id} was deleted."


@app.route("/people/update/<int:person_id>", methods=["PUT"])
@cross_origin()
def update_person(person_id):
    new_first_name = request.json['first_name']
    new_surname = request.json['surname']
    try:
        cur.execute(
            f"UPDATE Person SET FirstName = '{new_first_name}', Surname = '{new_surname}' WHERE id = ?",
            (person_id,))
    except mariadb.Error as e:
        return f"Error: {e}"

    return f"Person {person_id} was updated to FirstName: {new_first_name}, Surname: {new_surname}."


if __name__ == "__main__":
    app.run(debug=True)
