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

company_person_routes = Blueprint('company_person_routes', __name__)

@company_person_routes.route("/company-people/<int:company_id>", methods=["GET"])
@cross_origin()
def get_company_people(company_id):
    try:
        cur.execute(
            f"SELECT PersonId FROM CompanyPerson WHERE CompanyId = {company_id}")
    except Exception as e:
        print(e)
        return f"Error: {e}"
    people_id = [column[0] for column in cur]

    return jsonify(people_id)


@company_person_routes.route("/company-people/add", methods=["POST"])
@cross_origin()
def add_company_people():
    company_id = request.json['company_id']
    person_id_list = request.json['id_list']

    try:
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE CompanyId = %s",
            (company_id))

        for person_id in person_id_list:
            cur.execute(
                f"INSERT INTO CompanyPerson (CompanyId, PersonId) VALUES (%s, %s)",
                (company_id, person_id))
    except Exception as e:
        print(e)
        return f"Error: {e}"
    return jsonify({"CompanyId": company_id, "PeopleIdList": person_id_list})


@company_person_routes.route("/person-companies/<int:person_id>", methods=["GET"])
@cross_origin()
def get_person_companies(person_id):
    try:
        cur.execute(
            f"SELECT CompanyId FROM CompanyPerson WHERE PersonId = {person_id}")
    except Exception as e:
        print(e)
        return f"Error: {e}"
    company_id = [column[0] for column in cur]
    return jsonify(company_id)


@company_person_routes.route("/person-companies/add", methods=["POST"])
@cross_origin()
def add_person_companies():
    person_id = request.json['person_id']
    company_id_list = request.json['id_list']

    try:
        cur.execute(
            f"DELETE FROM CompanyPerson WHERE PersonId = {person_id}")

        for company_id in company_id_list:
            cur.execute(
                f"INSERT INTO CompanyPerson (CompanyId, PersonId) VALUES ({company_id}, {person_id})")
    except Exception as e:
        print(e)
        return f"Error: {e}"
    return jsonify({"PersonId": person_id, "CompanyIdList": company_id_list})