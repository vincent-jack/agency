const api_url = "http://127.0.0.1:5000";
getCompaniesByName();


async function getCompanies() {
    const response = await fetch(api_url + "/companies");
    const jsonData = await response.json();
    return jsonData;
};


async function getCompaniesByName() {
    const data = await getCompanies();
    data.sort(function (a, b) {
        if (a.companyName < b.companyName) {
          return -1;
        };
        if (a.companyName > b.companyName) {
          return 1;
        };
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Company Name";
    document.getElementById("orderNameButton").style.display = "none";
    document.getElementById("orderTownButton").style.display = "block";
};


async function getCompaniesByTown() {
    const data = await getCompanies();
    data.sort(function (a, b) {
        if (a.town < b.town) {
          return -1;
        };
        if (a.town > b.town) {
          return 1;
        };
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Town";
    document.getElementById("orderNameButton").style.display = "block";
    document.getElementById("orderTownButton").style.display = "none";
};


function getRows(json) {
    const dataRows = document.getElementsByClassName("data-row");
    while(dataRows.length > 0){
        dataRows[0].parentNode.removeChild(dataRows[0]);
    };

    const table = document.getElementById("data-table");
    for (let i = 0; i < json.length; i++) {
        const row = document.createElement("tr");
        row.classList.add("data-row");
        const buttonCol = document.createElement("th");

        const url = new URL(window.location.protocol + "//" + window.location.host + "/edit-company.html");
        url.searchParams.set("id", json[i].id);
        url.searchParams.set("companyName", json[i].companyName);
        url.searchParams.set("town", json[i].town);
        url.searchParams.set("address", json[i].address);
        url.searchParams.set("telephoneNumber", json[i].telephoneNumber);
        url.searchParams.set("website", json[i].website);

        const viewButton = document.createElement("a");
        viewButton.appendChild(document.createTextNode("View"));
        const viewUrl = url;
        viewUrl.searchParams.set("editable", false);
        viewButton.href = viewUrl;
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-outline-dark");
        buttonCol.appendChild(viewButton);

        const editButton = document.createElement("a");
        editButton.appendChild(document.createTextNode("Edit"));
        editButton.dataset.id = json[i].id;
        const editUrl = url;
        editUrl.searchParams.set("editable", true);
        editButton.href = editUrl;
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

        const nameCol = document.createElement("th");
        nameCol.appendChild(document.createTextNode(json[i].companyName));
        const townCol = document.createElement("th");
        townCol.appendChild(document.createTextNode(json[i].town));
        const addressCol = document.createElement("th");
        addressCol.appendChild(document.createTextNode(json[i].address));
        const telephoneCol = document.createElement("th");
        telephoneCol.appendChild(document.createTextNode(json[i].telephoneNumber));
        const websiteCol = document.createElement("th");
        websiteCol.appendChild(document.createTextNode(json[i].website));
        const employeeCol = document.createElement("th");
        employeeCol.appendChild(document.createTextNode(json[i].employeeCount));
        
        row.appendChild(nameCol);
        row.appendChild(townCol);
        row.appendChild(addressCol);
        row.appendChild(telephoneCol);
        row.appendChild(websiteCol);
        row.appendChild(employeeCol);
        table.appendChild(row);
        };
};


async function deleteRow(event) {
    const deleteCompany = confirm("Are you sure you want to delete this company?")
    if (deleteCompany == true) {
        const company_id = event.target.dataset.id;
        await fetch(api_url + "/companies/delete/" + company_id, {
            method: "DELETE"
        });
        location.reload();
    };
    
};
