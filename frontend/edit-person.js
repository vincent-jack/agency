const api_url = "https://api-b3hj.onrender.com"
const urlParams = new URLSearchParams(window.location.search);
const editable = (urlParams.get('editable') === 'true');

if (editable == false) {
    document.getElementById('submitButton').style.display = "none";
    document.getElementById('pageTitle').innerHTML = "View Person"
    document.getElementById('addDropdown').style.display = "none";
    document.getElementById('firstName').disabled = true;
    document.getElementById('surname').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('telephoneNumber').disabled = true;
    document.getElementById('dateOfBirth').disabled = true;
};
document.getElementById("firstName").value = urlParams.get('firstName');
document.getElementById("surname").value = urlParams.get('surname');
document.getElementById("email").value = urlParams.get('email');
document.getElementById("telephoneNumber").value = urlParams.get('telephoneNumber');
document.getElementById("dateOfBirth").value = urlParams.get('dateOfBirth');

const personId = urlParams.get('id');
let personCompaniesIds = [];
getPersonCompanies();
getCompaniesByName();


async function getPersonCompanies() {
    const response = await fetch(api_url + "/person-companies/" + personId);
    personCompaniesIds = await response.json();
};

async function getCompanies() {
    const response = await fetch(api_url + "/companies");
    const jsonData = await response.json();
    return jsonData;
};


async function getCompaniesByName() {
    const companiesData = await getCompanies();
    companiesData.sort(function (a, b) {
        if (a.companyName < b.companyName) {
          return -1;
        };
        if (a.companyName > b.companyName) {
          return 1;
        };
        return 0;
    });
    getRows(companiesData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Company Name";
    document.getElementById("orderCompanyNameButton").style.display = "none";
    document.getElementById("orderTownButton").style.display = "block";
};


async function getCompaniesByTown() {
    const companiesData = await getCompanies();
    companiesData.sort(function (a, b) {
        if (a.town < b.town) {
          return -1;
        };
        if (a.town > b.town) {
          return 1;
        };
        return 0;
    });
    getRows(companiesData);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Town";
    document.getElementById("orderCompanyNameButton").style.display = "block";
    document.getElementById("orderTownButton").style.display = "none";
};


async function getRows(companiesJson) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    };
    const dataListItems = document.getElementsByClassName("data-list-item");
    while(dataListItems.length > 0){
        dataListItems[0].parentNode.removeChild(dataListItems[0]);
    };

    for (let i = 0; i < companiesJson.length; i++) {
        if (personCompaniesIds.includes(companiesJson[i].id)) {
            addRow(companiesJson[i]);
        } else {
            addListItem(companiesJson[i]);
        };
    };
};


function addRow(companyData) {
    const table = document.getElementById("data-table");
    const row = document.createElement("tr");
    row.classList.add("data-row");
    row.id = "companyRow" + companyData.id;

    const removeCol = document.createElement("th");
    
    if (editable == true) {
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("Remove"));
        removeButton.classList.add("remove-button");
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-danger");
        removeButton.onclick = function() {removeCompany(companyData)};
        removeCol.appendChild(removeButton);
    };

    const companyNameCol = document.createElement("th");
    companyNameCol.appendChild(document.createTextNode(companyData.companyName));
    const townCol = document.createElement("th");
    townCol.appendChild(document.createTextNode(companyData.town));
    const addressCol = document.createElement("th");
    addressCol.appendChild(document.createTextNode(companyData.address));
    const telephoneNumberCol = document.createElement("th");
    telephoneNumberCol.appendChild(document.createTextNode(companyData.telephoneNumber));
    const websiteCol = document.createElement("th");
    websiteCol.appendChild(document.createTextNode(companyData.website));

    row.appendChild(removeCol);
    row.appendChild(companyNameCol);
    row.appendChild(townCol);
    row.appendChild(addressCol);
    row.appendChild(telephoneNumberCol);
    row.appendChild(websiteCol);
    table.appendChild(row);
};


function addListItem(companyData) {
    const dropdown = document.getElementById("companiesDropdown");

    const addButton = document.createElement("button");
    addButton.classList.add("dropdown-item");
    addButton.classList.add("data-list-item");
    addButton.appendChild(document.createTextNode(`${companyData.id}: ${companyData.companyName} ${companyData.address}`));
    addButton.onclick = function() {addCompany(companyData)};
    addButton.id = "companyListItem" + companyData.id;
    dropdown.appendChild(addButton);
};


const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newFirstName = document.getElementById('firstName').value;
    const newSurname = document.getElementById('surname').value;
    const newEmail = document.getElementById('email').value;
    const newTelephoneNumber = document.getElementById('telephoneNumber').value;
    const newDateOfBirth = document.getElementById('dateOfBirth').value;

    if (validateForm(newFirstName, newSurname, newEmail, newTelephoneNumber, newDateOfBirth) == false) {
        return;
    };

    const data = JSON.stringify({
        first_name: document.getElementById('firstName').value,
        surname: document.getElementById('surname').value,
        email: document.getElementById('email').value,
        telephone_number: document.getElementById('telephoneNumber').value,
        date_of_birth: document.getElementById('dateOfBirth').value,
        company_count: personCompaniesIds.length
    });

    await fetch(api_url + '/people/update/' + personId, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    
    const personCompaniesData = JSON.stringify({
        person_id: personId,
        id_list: personCompaniesIds
    });

    await fetch(api_url + '/person-companies/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: personCompaniesData
    });

    window.location.replace("people.html");
});


async function addCompany(companyData) {
    document.getElementById("companyListItem" + companyData.id).remove();
    addRow(companyData);
    personCompaniesIds.push(companyData.id)
};


async function removeCompany(companyData) {
    document.getElementById("companyRow" + companyData.id).remove();
    addListItem(companyData);
    const index = personCompaniesIds.indexOf(companyData.id);
    if (index > -1) {
        personCompaniesIds.splice(index, 1);          
    };
};


function validateForm(firstName, surname, email, telephoneNumber, dateOfBirth) {
    let incorrectData = false;
    const now = new Date;
    const toastMessage = document.getElementById("incorrectToastMessage");
    if (firstName == "" || surname == "" || email == "" || telephoneNumber == "" || dateOfBirth == "") {
        toastMessage.innerHTML = "Fields cannot be left blank.";
        incorrectData = true;
    } else if (/^\d+$/.test(telephoneNumber) == false) {
        toastMessage.innerHTML = "Telephone Number field can only include numbers.";
        incorrectData = true;
    } else if (new Date(dateOfBirth) > now) {
        toastMessage.innerHTML = "Date of Birth cannot be in the future.";
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