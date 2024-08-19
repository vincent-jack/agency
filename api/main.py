from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import psycopg2
import sys
import os
from person import person_routes
from company_person import company_person_routes

try:
    conn = psycopg2.connect(os.environ.get("DB_URL"))
    conn.autocommit = True

except Exception as e:
    print(f"Error connecting to Database: {e}")
    sys.exit(1)

cur = conn.cursor()

app = Flask(__name__)
app.register_blueprint(person_routes)
app.register_blueprint(company_person_routes)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/companies")
@cross_origin()
def companies_list():
    try:
        cur.execute(
            'SELECT * FROM Company')
    except Exception as e:
        print(e)
        return f"Error: {e}"

    companies = []
    for column in cur:
        row = {"id": column[0],
               "companyName": column[1],
               "town": column[2],
               "address": column[3],
               "telephoneNumber": column[4],
               "website": column[5],
               "employeeCount": column[6]}
        companies.append(row)

    return jsonify(companies)


@app.route("/companies/create", methods=["POST"])
@cross_origin()
def create_company():
    new_company = request.json['company_name']
    new_company_town = request.json['town']
    try:
        cur.execute(
            "INSERT INTO Company (CompanyName, Town) VALUES (%s, %s)",
            (new_company, new_company_town))
    except Exception as e:
        print(e)
        return f"Error: {e}"

    return jsonify({"Company": new_company, "Town": new_company_town})


@app.route("/companies/delete/<int:company_id>", methods=["DELETE"])
@cross_origin()
def delete_company(company_id):
    try:
        cur.execute(
            f"DELETE FROM Company WHERE Id = {company_id}")
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE CompanyId = {company_id}"
        )
    except Exception as e:
        print(e)
        return f"Error: {e}"
    return "Success"


@app.route("/companies/update/<int:company_id>", methods=["PUT"])
@cross_origin()
def update_company(company_id):
    new_name = request.json['company_name']
    new_town = request.json['town']

    try:
        cur.execute(
            f"UPDATE Company SET CompanyName = '{new_name}', Town = '{new_town}' WHERE id = {company_id}")
    except Exception as e:
        print(e)
        return f"Error: {e}"

    return jsonify({"Company": new_name, "Town": new_town})


if __name__ == "__main__":
    app.run(port=5000)
