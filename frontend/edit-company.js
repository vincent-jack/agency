const api_url = "http://127.0.0.1:5000";
const urlParams = new URLSearchParams(window.location.search);
const editable = (urlParams.get('editable') === 'true');

if (editable == false) {
    document.getElementById('submitButton').style.display = "none";
    document.getElementById('pageTitle').innerHTML = "View Company"
    document.getElementById('addDropdown').style.display = "none";
    document.getElementById('companyName').disabled = true;
    document.getElementById('town').disabled = true;
    document.getElementById('address').disabled = true;
    document.getElementById('telephoneNumber').disabled = true;
    document.getElementById('website').disabled = true;
};
document.getElementById("companyName").value = urlParams.get('companyName');
document.getElementById("town").value = urlParams.get('town');
document.getElementById("address").value = urlParams.get('address');
document.getElementById("telephoneNumber").value = urlParams.get('telephoneNumber');
document.getElementById("website").value = urlParams.get('website');

const companyId = urlParams.get('id');
let companyPeopleIds = [];
initialisePage();


async function initialisePage() {
    await getCompanyPeople();
    await getPeopleBySurname();
}


async function getCompanyPeople() {
    const response = await fetch(api_url + "/company-people/" + companyId);
    companyPeopleIds = await response.json();
};

async function getPeople() {
    const response = await fetch(api_url + "/people");
    const jsonData = await response.json();
    return jsonData;
};


async function getPeopleByFirstName() {
    const peopleData = await getPeople();
    peopleData.sort(function (a, b) {
        if (a.firstName < b.firstName) {
          return -1;
        };
        if (a.firstName > b.firstName) {
          return 1;
        };
        return 0;
    });
    getRows(peopleData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: First Name";
    document.getElementById("orderFirstNameButton").style.display = "none";
    document.getElementById("orderSurnameButton").style.display = "block";
};


async function getPeopleBySurname() {
    const peopleData = await getPeople();
    peopleData.sort(function (a, b) {
        if (a.surname < b.surname) {
          return -1;
        };
        if (a.surname > b.surname) {
          return 1;
        };
        return 0;
    });
    getRows(peopleData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Surname";
    document.getElementById("orderFirstNameButton").style.display = "block";
    document.getElementById("orderSurnameButton").style.display = "none";
};


async function getRows(peopleJson) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    };
    const dataListItems = document.getElementsByClassName("data-list-item");
    while(dataListItems.length > 0){
        dataListItems[0].parentNode.removeChild(dataListItems[0]);
    };

    for (let i = 0; i < peopleJson.length; i++) {
        if (companyPeopleIds.includes(peopleJson[i].id)) {
            addRow(peopleJson[i]);
        } else {
            addListItem(peopleJson[i]);
        };
    };
};


function addRow(personData) {
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
    row.classList.add("data-row");
    row.id = "personRow" + personData.id;

    const removeCol = document.createElement("th");
    
    if (editable == true) {
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("Remove"));
        removeButton.classList.add("remove-button");
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-danger");
        removeButton.onclick = function() {removePerson(personData)};
        removeCol.appendChild(removeButton);
    };

    const firstNameCol = document.createElement("th");
    firstNameCol.appendChild(document.createTextNode(personData.firstName));
    const surnameCol = document.createElement("th");
    surnameCol.appendChild(document.createTextNode(personData.surname));
    const emailCol = document.createElement("th");
    emailCol.appendChild(document.createTextNode(personData.email));
    const telephoneNumberCol = document.createElement("th");
    telephoneNumberCol.appendChild(document.createTextNode(personData.telephoneNumber));
    const dateOfBirthCol = document.createElement("th");
    dateOfBirthCol.appendChild(document.createTextNode(personData.dateOfBirth));

    row.appendChild(removeCol);
    row.appendChild(firstNameCol);
    row.appendChild(surnameCol);
    row.appendChild(emailCol);
    row.appendChild(telephoneNumberCol);
    row.appendChild(dateOfBirthCol);
    table.appendChild(row);
};


function addListItem(personData) {
    const dropdown = document.getElementById("peopleDropdown");

    const addButton = document.createElement("button");
    addButton.classList.add("dropdown-item");
    addButton.classList.add("data-list-item");
    addButton.appendChild(document.createTextNode(`${personData.id}: ${personData.firstName} ${personData.surname}`));
    addButton.onclick = function() {addPerson(personData)};
    addButton.id = "personListItem" + personData.id;
    dropdown.appendChild(addButton);
};


const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newCompanyName = document.getElementById('companyName').value;
    const newTown = document.getElementById('town').value;
    const newAddress = document.getElementById('address').value;
    const newTelephoneNumber = document.getElementById('telephoneNumber').value;
    const newWebsite = document.getElementById('website').value;

    if (validateForm(newCompanyName, newTown, newAddress, newTelephoneNumber, newWebsite) == false) {
        return;
    };

    const data = JSON.stringify({
        company_name: document.getElementById('companyName').value,
        town: document.getElementById('town').value,
        address: document.getElementById('address').value,
        telephone_number: document.getElementById('telephoneNumber').value,
        website: document.getElementById('website').value,
        employee_count: companyPeopleIds.length
    });

    await fetch(api_url + '/companies/update/' + companyId, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    
    const companyPeopleData = JSON.stringify({
        company_id: companyId,
        id_list: companyPeopleIds
    });

    await fetch(api_url + '/company-people/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: companyPeopleData
    });

    window.location.replace("companies.html");
});


async function addPerson(personData) {
    document.getElementById("personListItem" + personData.id).remove();
    addRow(personData);
    companyPeopleIds.push(personData.id)
};


async function removePerson(personData) {
    document.getElementById("personRow" + personData.id).remove();
    addListItem(personData);
    const index = companyPeopleIds.indexOf(personData.id);
    if (index > -1) {
        companyPeopleIds.splice(index, 1);          
    };
};


function validateForm(companyName, town, address, telephoneNumber, website) {
    function isValidHttpUrl(string) {
        let url;
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        };
        return true;
    };
    
    let incorrectData = false;
    const toastMessage = document.getElementById("incorrectToastMessage");
    if (companyName == "" || town == "" || address == "" || telephoneNumber == "" || website == "") {
        toastMessage.innerHTML = "Fields cannot be left blank.";
        incorrectData = true;
    } else if (/^\d+$/.test(telephoneNumber) == false) {
        toastMessage.innerHTML = "Telephone Number field can only include numbers.";
        incorrectData = true;
    } else if (isValidHttpUrl(website) == false) {
        toastMessage.innerHTML = "Website field must be a valid URL.";
        incorrectData = true;
    };

    if (incorrectData == true) {
        const incorrectToastEl = document.getElementById('incorrectToast');
        const incorrectToast = new bootstrap.Toast(incorrectToastEl);
        incorrectToast.show();
        return false;
    } else {
        return true;
    };
};