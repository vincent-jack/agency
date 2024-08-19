const api_url = "http://127.0.0.1:5000"
getPeopleBySurname();


async function getPeople() {
    const response = await fetch(api_url + "/people");
    const jsonData = await response.json();
    return jsonData;
}


async function getPeopleByFirstName() {
    const data = await getPeople();
    data.sort(function (a, b) {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: First Name";
    document.getElementById("orderFirstNameButton").style.display = "none";
    document.getElementById("orderSurnameButton").style.display = "block";
}


async function getPeopleBySurname() {
    const data = await getPeople();
    data.sort(function (a, b) {
        if (a.surname < b.surname) {
          return -1;
        }
        if (a.surname > b.surname) {
          return 1;
        }
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Surname";
    document.getElementById("orderFirstNameButton").style.display = "block";
    document.getElementById("orderSurnameButton").style.display = "none";
}


async function getRows(json) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    }

    const table = document.getElementById("data-table");
    for (let i = 0; i < json.length; i++) {
        const row = document.createElement("tr");
        row.classList.add("data-row");
        const buttonCol = document.createElement("th");

        const viewButton = document.createElement("a");
        viewButton.appendChild(document.createTextNode("View"));
        const viewUrl = new URL(window.location.protocol + "//" + window.location.host + "/edit-person.html");
        viewUrl.searchParams.append("id", json[i].id);
        viewUrl.searchParams.append("firstName", json[i].firstName);
        viewUrl.searchParams.append("surname", json[i].surname);
        viewUrl.searchParams.append("editable", false);
        viewButton.href = viewUrl;
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-outline-dark");
        buttonCol.appendChild(viewButton);

        const editButton = document.createElement("a");
        editButton.appendChild(document.createTextNode("Edit"));
        const url = new URL(window.location.protocol + "//" + window.location.host + "/edit-person.html");
        url.searchParams.append("id", json[i].id);
        url.searchParams.append("firstName", json[i].firstName);
        url.searchParams.append("surname", json[i].surname);
        url.searchParams.append("editable", true);
        editButton.href = url;
        editButton.classList.add("btn");
        editButton.classList.add("btn-outline-primary");
        buttonCol.appendChild(editButton);

        const deletebutton = document.createElement("button");
        deletebutton.appendChild(document.createTextNode("Delete"));
        deletebutton.dataset.id = json[i].id;
        deletebutton.addEventListener("click", deleteRow);
        deletebutton.classList.add("btn");
        deletebutton.classList.add("btn-outline-danger");
        buttonCol.appendChild(deletebutton);

        row.appendChild(buttonCol);

        const firstNameCol = document.createElement("th");
        firstNameCol.appendChild(document.createTextNode(json[i].firstName));
        const surnameCol = document.createElement("th");
        surnameCol.appendChild(document.createTextNode(json[i].surname));
        const emailCol = document.createElement("th");
        emailCol.appendChild(document.createTextNode(json[i].email));
        const telephoneCol = document.createElement("th");
        telephoneCol.appendChild(document.createTextNode(json[i].telephoneNumber));
        const dateOfBirthCol = document.createElement("th");
        dateOfBirthCol.appendChild(document.createTextNode(json[i].dateOfBirth));
        const companyCountCol = document.createElement("th");
        companyCountCol.appendChild(document.createTextNode(json[i].companyCount));

        row.appendChild(firstNameCol);
        row.appendChild(surnameCol);
        row.appendChild(emailCol);
        row.appendChild(telephoneCol);
        row.appendChild(dateOfBirthCol);
        row.appendChild(companyCountCol);
        table.appendChild(row);
        }

    }


async function deleteRow(event) {
    const deletePerson = confirm("Are you sure you want to delete this person?");
    if (deletePerson == true) {
        const person_id = event.target.dataset.id;
        await fetch(api_url + "/people/delete/" + person_id, {
            method: "DELETE"
        });
        location.reload();
    }
}

