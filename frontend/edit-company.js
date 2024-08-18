const urlParams = new URLSearchParams(window.location.search);
const companyId = urlParams.get('id');

document.getElementById('companyName').value = urlParams.get('companyName');
document.getElementById('town').value = urlParams.get('town');
const editable = (urlParams.get('editable') === 'true')
const companyPeopleIds = []

if (editable == false) {
    document.getElementById('checkDiv').style.display = "none";
    document.getElementById('submitButton').style.display = "none";
    document.getElementById('companyName').disabled = true;
    document.getElementById('town').disabled = true;
    document.getElementById('pageTitle').innerHTML = "View Company"
    document.getElementById('addDropdown').style.display = "none";
}


getPeopleBySurname();


async function getPeople() {
    const response = await fetch("http://127.0.0.1:5000/people");
    const jsonData = await response.json();
    return jsonData;
}

async function getCompanyPeople() {
    const response = await fetch("http://127.0.0.1:5000/company-people/" + companyId);
    const jsonData = await response.json();
    return jsonData;
    
}


async function getPeopleByFirstName() {
    const peopleData = await getPeople();
    peopleData.sort(function (a, b) {
        if (a.FirstName < b.FirstName) {
          return -1;
        }
        if (a.FirstName > b.FirstName) {
          return 1;
        }
        return 0;
    });

    const companyPeopleData = await getCompanyPeople();
    getRows(peopleData, companyPeopleData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: First Name";
    document.getElementById("orderFirstNameButton").style.display = "none";
    document.getElementById("orderSurnameButton").style.display = "block";
}


async function getPeopleBySurname() {
    const peopleData = await getPeople();
    peopleData.sort(function (a, b) {
        if (a.Surname < b.Surname) {
          return -1;
        }
        if (a.Surname > b.Surname) {
          return 1;
        }
        return 0;
    });

    const companyPeopleData = await getCompanyPeople();
    getRows(peopleData, companyPeopleData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Surname";
    document.getElementById("orderFirstNameButton").style.display = "block";
    document.getElementById("orderSurnameButton").style.display = "none";
}


async function getRows(peopleJson, companyPeopleJson) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    }
    const dataListItems = document.getElementsByClassName("data-list-item");
    while(dataListItems.length > 0){
        dataListItems[0].parentNode.removeChild(dataListItems[0]);
    }
    for (let i = 0; i < peopleJson.length; i++) {
        if (companyPeopleJson.includes(peopleJson[i].Id) == true) {
            addRow(peopleJson[i].Id, peopleJson[i].FirstName, peopleJson[i].Surname)
        } else {
            addListItem(peopleJson[i].Id, peopleJson[i].FirstName, peopleJson[i].Surname)
        }
    }
}


function addRow(personId, firstName, surname) {
    companyPeopleIds.push(personId)
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
    row.classList.add("data-row");
    row.id = "personRow" + personId

    const removeCol = document.createElement("th");
    
    if (editable == true) {
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("Remove"));
        removeButton.classList.add("remove-button");
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-danger");
        removeButton.setAttribute('onclick', 'removePerson(' + personId + ', "' + firstName + '", "' + surname + '")')
        removeCol.appendChild(removeButton);
    }

    const firstNameCol = document.createElement("th");
    firstNameCol.appendChild(document.createTextNode(firstName));
    const surnameCol = document.createElement("th");
    surnameCol.appendChild(document.createTextNode(surname));

    row.appendChild(removeCol)
    row.appendChild(firstNameCol);
    row.appendChild(surnameCol);
    table.appendChild(row);
}


function addListItem(personId, firstName, surname) {
    const dropdown = document.getElementById("peopleDropdown")

    const addButton = document.createElement("button")
    addButton.classList.add("dropdown-item")
    addButton.classList.add("data-list-item")
    addButton.appendChild(document.createTextNode(personId + ": " + firstName + " " + surname))
    addButton.setAttribute('onclick','addPerson("' + personId + '", "' + firstName + '", "' + surname + '")')
    addButton.id = "personListItem" + personId
    dropdown.appendChild(addButton)
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
    
    const companyPeopleData = JSON.stringify({
        company_id: companyId,
        id_list: companyPeopleIds
    });

    await fetch('http://127.0.0.1:5000/company-people/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: companyPeopleData
    });

    if (checkSave.checked == false) {
        window.location.replace("companies.html");
    }

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
    const index = companyPeopleIds.indexOf(personId);
    if (index > -1) {
        companyPeopleIds.splice(index, 1);
    }
}
