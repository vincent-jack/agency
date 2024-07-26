const urlParams = new URLSearchParams(window.location.search);
const companyId = urlParams.get('id');

document.getElementById('companyName').value = urlParams.get('companyName');
document.getElementById('town').value = urlParams.get('town');
const editable = (urlParams.get('editable') === 'true')
const companyPeopleList = []


function addRow(personId, firstName, surname) {
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
    row.id = "personRow" + personId

    const removeCol = document.createElement("th");
    const removeButton = document.createElement("button");
    removeButton.appendChild(document.createTextNode("Remove"));
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-danger");
    removeButton.setAttribute('onclick', 'removePerson(' + personId + ', "' + firstName + '", "' + surname + '")')
    removeCol.appendChild(removeButton);

    const idCol = document.createElement("th");
    idCol.appendChild(document.createTextNode(personId));
    idCol.classList.add("idColumn")
    const firstNameCol = document.createElement("th");
    firstNameCol.appendChild(document.createTextNode(firstName));
    const surnameCol = document.createElement("th");
    surnameCol.appendChild(document.createTextNode(surname));

    row.appendChild(removeCol)
    row.appendChild(idCol);
    row.appendChild(firstNameCol);
    row.appendChild(surnameCol);
    table.appendChild(row);
}


function addListItem(personId, firstName, surname) {
    const dropdown = document.getElementById("peopleDropdown")

    const addButton = document.createElement("button")
    addButton.classList.add("dropdown-item")
    addButton.appendChild(document.createTextNode(personId + ": " + firstName + " " + surname))
    addButton.setAttribute('onclick','addPerson("' + personId + '", "' + firstName + '", "' + surname + '")')
    addButton.id = "personListItem" + personId
    dropdown.appendChild(addButton)
}


getPeople("http://127.0.0.1:5000/people");

async function getPeople(file) {
    const response = await fetch(file);
    const json = await response.json();

    const peopleResponse = await fetch("http://127.0.0.1:5000/company-people/" + companyId);
    const peopleJson = await peopleResponse.json();

    if (editable == false) {
        document.getElementById('checkDiv').style.display = "none";
        document.getElementById('submitButton').style.display = "none";
        document.getElementById('companyName').disabled = true;
        document.getElementById('town').disabled = true;
        document.getElementById('pageTitle').innerHTML = "View Company"
    }

    for (let i = 0; i < json.length; i++) {
        if (peopleJson.includes(json[i].Id) == true) {
            addRow(json[i].Id, json[i].FirstName, json[i].Surname)
        }
    }

    for (let count = 0; count < json.length; count++) {
        if (peopleJson.includes(json[count].Id) == false) {
            addListItem(json[count].Id, json[count].FirstName, json[count].Surname)
        }
    }

            
    
}


const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newCompanyName = document.getElementById('companyName').value
    const newTown = document.getElementById('town').value
    const checkSave = document.getElementById('checkSave')

    if (newCompanyName == "" || newTown == "" 
        || newCompanyName.includes("'") == true || newCompanyName.includes('"') == true || newTown.includes("'") == true || newTown.includes('"') == true) {
        const incorrectToastEl = document.getElementById('incorrectToast')
        const incorrectToast = new bootstrap.Toast(incorrectToastEl)
        incorrectToast.show();
        return
    }
    const data = JSON.stringify({
        company_name: newCompanyName,
        town: newTown,
    });

    await fetch('http://127.0.0.1:5000/companies/update/' + companyId, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("http://127.0.0.1:8080/companies.html");
    }

    const add_id_list = []
    const companyPeopleId = document.getElementsByClassName("idColumn");
    for (let i = 0; i < companyPeopleId.length; i++) {
        add_id_list.push(companyPeopleId[i].innerHTML);
    }

    const companyPeopleData = JSON.stringify({
        company_id: companyId,
        id_list: add_id_list
    });

    await fetch('http://127.0.0.1:5000/company-people/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: companyPeopleData
    });

    const successToastEl = document.getElementById('successToast')
    const successToast = new bootstrap.Toast(successToastEl)
    successToast.show();

});


async function addPerson(personId, firstName, surname) {
    document.getElementById("personListItem" + personId).remove();
    addRow(personId, firstName, surname);

}

async function removePerson(personId, firstName, surname) {
    document.getElementById("personRow" + personId).remove();
    addListItem(personId, firstName, surname);
}
