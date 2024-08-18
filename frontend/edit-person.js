const urlParams = new URLSearchParams(window.location.search);
const personId = urlParams.get('id');

document.getElementById('firstName').value = urlParams.get('firstName');
document.getElementById('surname').value = urlParams.get('surname');
const editable = (urlParams.get('editable') === 'true')
const personCompaniesId = []

if (editable == false) {
    document.getElementById('checkDiv').style.display = "none";
    document.getElementById('submitButton').style.display = "none";
    document.getElementById('firstName').disabled = true;
    document.getElementById('surname').disabled = true;
    document.getElementById('pageTitle').innerHTML = "View Person";
    document.getElementById('addDropdown').style.display = "none";
}


getCompaniesByName();


async function getCompanies() {
    const response = await fetch("http://127.0.0.1:5000/companies");
    const jsonData = await response.json();
    return jsonData;
}


async function getPersonCompanies() {
    const companyResponse = await fetch("http://127.0.0.1:5000/person-companies/" + personId);
    const jsonData = await companyResponse.json();
    return jsonData;
}


async function getCompaniesByName() {
    const peopleData = await getCompanies();
    peopleData.sort(function (a, b) {
        if (a.CompanyName < b.CompanyName) {
          return -1;
        }
        if (a.CompanyName > b.CompanyName) {
          return 1;
        }
        return 0;
    });

    const companyPeopleData = await getPersonCompanies();
    getRows(peopleData, companyPeopleData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Company Name";
    document.getElementById("orderNameButton").style.display = "none";
    document.getElementById("orderTownButton").style.display = "block";
}


async function getCompaniesByTown() {
    const companyData = await getCompanies();
    companyData.sort(function (a, b) {
        if (a.Town < b.Town) {
          return -1;
        }
        if (a.Town > b.Town) {
          return 1;
        }
        return 0;
    });

    const personCompaniesData = await getPersonCompanies();
    getRows(companyData, personCompaniesData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Town";
    document.getElementById("orderNameButton").style.display = "block";
    document.getElementById("orderTownButton").style.display = "none";
}


async function getRows(companyJson, personCompaniesJson) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    }
    const dataListItems = document.getElementsByClassName("data-list-item");
    while(dataListItems.length > 0){
        dataListItems[0].parentNode.removeChild(dataListItems[0]);
    }
    for (let i = 0; i < companyJson.length; i++) {
        if (personCompaniesJson.includes(companyJson[i].Id) == true) {
            addRow(companyJson[i].Id, companyJson[i].CompanyName, companyJson[i].Town)
        } else {
            addListItem(companyJson[i].Id, companyJson[i].CompanyName, companyJson[i].Town)
        }
    }
}


function addRow(companyId, companyName, town) {
    personCompaniesId.push(companyId)
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
    row.classList.add("data-row")
    row.id = "companyRow" + companyId

    const removeCol = document.createElement("th");
    if (editable == true) {
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("Remove"));
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-danger");
        removeButton.setAttribute('onclick', 'removeCompany(' + companyId + ', "' + companyName + '", "' + town + '")')
        removeCol.appendChild(removeButton);
    }

    const companyNameCol = document.createElement("th");
    companyNameCol.appendChild(document.createTextNode(companyName));
    const townCol = document.createElement("th");
    townCol.appendChild(document.createTextNode(town));

    row.appendChild(removeCol)
    row.appendChild(companyNameCol);
    row.appendChild(townCol);
    table.appendChild(row);
}


function addListItem(companyId, companyName, town) {
    const dropdown = document.getElementById("companiesDropdown")

    const addButton = document.createElement("button")
    addButton.classList.add("dropdown-item")
    addButton.classList.add("data-list-item")
    addButton.appendChild(document.createTextNode(companyId + ": " + companyName + ", " + town))
    addButton.setAttribute('onclick','addCompany("' + companyId + '", "' + companyName + '", "' + town + '")')
    addButton.id = "companyListItem" + companyId
    dropdown.appendChild(addButton)
}


const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newFirstName = document.getElementById('firstName').value
    const newSurname = document.getElementById('surname').value
    const checkSave = document.getElementById('checkSave')

    if (newFirstName == "" || newSurname == "" 
        || newFirstName.includes("'") == true || newFirstName.includes('"') == true || newSurname.includes("'") == true || newSurname.includes('"') == true) {
        const incorrectToastEl = document.getElementById('incorrectToast')
        const incorrectToast = new bootstrap.Toast(incorrectToastEl)
        incorrectToast.show();
        return
    }
    const data = JSON.stringify({
        first_name: newFirstName,
        surname: newSurname,
    });

    await fetch('http://127.0.0.1:5000/people/update/' + personId, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });

    const personCompaniesData = JSON.stringify({
        person_id: personId,
        id_list: personCompaniesId
    });

    await fetch('http://127.0.0.1:5000/person-companies/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: personCompaniesData
    });

    if (checkSave.checked == false) {
        window.location.replace("people.html");
    }

    const successToastEl = document.getElementById('successToast')
    const successToast = new bootstrap.Toast(successToastEl)
    successToast.show();
});


async function addCompany(companyId, companyName, town) {
    document.getElementById("companyListItem" + companyId).remove();
    addRow(companyId, companyName, town);

}


async function removeCompany(companyId, companyName, town) {
    document.getElementById("companyRow" + companyId).remove();
    addListItem(companyId, companyName, town);
    const index = personCompaniesId.indexOf(companyId);
    if (index > -1) {
        personCompaniesId.splice(index, 1);
    }
}
