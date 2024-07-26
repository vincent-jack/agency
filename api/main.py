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
    return jsonify({"Success": True})


@app.route("/companies/update/<int:company_id>", methods=["PUT"])
@cross_origin()
def update_company(company_id):
    new_name = request.json['company_name']
    new_town = request.json['town']

    try:
        cur.execute(
            f'UPDATE Company SET CompanyName = "{new_name}", Town = "{new_town}" WHERE id = ?',
            (company_id,))

    except mariadb.Error as e:
        return f"Error: {e}"

    return jsonify({"Company": new_name, "Town": new_town})


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

    return jsonify({"FirstName": first_name, "Surname": surname})


@app.route("/people/delete/<int:person_id>", methods=["DELETE"])
@cross_origin()
def delete_person(person_id):
    delete_row(row_id=person_id, table_name="Person")
    return jsonify({"Success": True})


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

    return jsonify({"FirstName": new_first_name, "Surname": new_surname})


@app.route("/company-people/<int:company_id>", methods=["GET"])
@cross_origin()
def get_company_people(company_id):
    try:
        cur.execute(
            f"SELECT PersonId FROM CompanyPerson WHERE CompanyId={company_id}")
    except mariadb.Error as e:
        return f"Error: {e}"
    people_id = [column[0] for column in cur]

    return jsonify(people_id)


@app.route("/company-people/add", methods=["POST"])
@cross_origin()
def add_company_people():
    company_id = request.json['company_id']
    person_id_list = request.json['id_list']

    try:
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE CompanyId={company_id}")
    except mariadb.Error as e:
        return f"Error: {e}"

    try:
        for person_id in person_id_list:
            cur.execute(
                "INSERT INTO CompanyPerson (CompanyId, PersonId) VALUES (?, ?)",
                (company_id, person_id))
    except mariadb.Error as e:
        return f"Error: {e}"
    return jsonify({"CompanyId": company_id, "PeopleIdList": person_id_list})


@app.route("/person-companies/<int:person_id>", methods=["GET"])
@cross_origin()
def get_person_companies(person_id):
    try:
        cur.execute(
            f"SELECT CompanyId FROM CompanyPerson WHERE PersonId={person_id}")
    except mariadb.Error as e:
        return f"Error: {e}"
    company_id = [column[0] for column in cur]
    return jsonify(company_id)


@app.route("/person-companies/add", methods=["POST"])
@cross_origin()
def add_person_companies():
    person_id = request.json['person_id']
    company_id_list = request.json['id_list']

    try:
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE PersonId={person_id}")
    except mariadb.Error as e:
        return f"Error: {e}"

    try:
        for company_id in company_id_list:
            cur.execute(
                "INSERT INTO CompanyPerson (CompanyId, PersonId) VALUES (?, ?)",
                (company_id, person_id))
    except mariadb.Error as e:
        return f"Error: {e}"
    return jsonify({"PersonId": person_id, "CompanyIdList": company_id_list})


if __name__ == "__main__":
    app.run(debug=True)
