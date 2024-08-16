const urlParams = new URLSearchParams(window.location.search);
const personId = urlParams.get('id');

document.getElementById('firstName').value = urlParams.get('firstName');
document.getElementById('surname').value = urlParams.get('surname');
const editable = (urlParams.get('editable') === 'true')
const personCompaniesList = []

if (editable == false) {
    document.getElementById('checkDiv').style.display = "none";
    document.getElementById('submitButton').style.display = "none";
    document.getElementById('firstName').disabled = true;
    document.getElementById('surname').disabled = true;
    document.getElementById('pageTitle').innerHTML = "View Person";
    document.getElementById('addDropdown').style.display = "none";
}


function addRow(companyId, companyName, town) {
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
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

    // const idCol = document.createElement("th");
    // idCol.appendChild(document.createTextNode(companyId));
    // idCol.classList.add("idColumn")
    const companyNameCol = document.createElement("th");
    companyNameCol.appendChild(document.createTextNode(companyName));
    const townCol = document.createElement("th");
    townCol.appendChild(document.createTextNode(town));

    row.appendChild(removeCol)
    // row.appendChild(idCol);
    row.appendChild(companyNameCol);
    row.appendChild(townCol);
    table.appendChild(row);
}


function addListItem(companyId, companyName, town) {
    const dropdown = document.getElementById("companiesDropdown")

    const addButton = document.createElement("button")
    addButton.classList.add("dropdown-item")
    addButton.appendChild(document.createTextNode(companyId + ": " + companyName + ", " + town))
    addButton.setAttribute('onclick','addCompany("' + companyId + '", "' + companyName + '", "' + town + '")')
    addButton.id = "companyListItem" + companyId
    dropdown.appendChild(addButton)
}


getCompanies("http://127.0.0.1:5000/companies");
async function getCompanies(file) {
    const response = await fetch(file);
    const json = await response.json();

    const companyResponse = await fetch("http://127.0.0.1:5000/person-companies/" + personId);
    const companyJson = await companyResponse.json();

    for (let i = 0; i < json.length; i++) {
        if (companyJson.includes(json[i].Id) == true) {
            addRow(json[i].Id, json[i].CompanyName, json[i].Town)
        }
    }

    for (let count = 0; count < json.length; count++) {
        if (companyJson.includes(json[count].Id) == false) {
            addListItem(json[count].Id, json[count].CompanyName, json[count].Town)
        }
    }
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

    const add_id_list = []
    const personCompaniesId = document.getElementsByClassName("idColumn");
    for (let i = 0; i < personCompaniesId.length; i++) {
        add_id_list.push(personCompaniesId[i].innerHTML);
    }

    const personCompaniesData = JSON.stringify({
        person_id: personId,
        id_list: add_id_list
    });

    await fetch('http://127.0.0.1:5000/person-companies/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: personCompaniesData
    });

    if (checkSave.checked == false) {
        window.location.replace("http://127.0.0.1:8080/people.html");
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
}
