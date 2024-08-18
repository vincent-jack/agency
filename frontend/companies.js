getCompaniesByName();


async function getCompanies() {
    const response = await fetch("http://127.0.0.1:5000/companies");
    const jsonData = await response.json();
    return jsonData;
}


async function getCompaniesByName() {
    const data = await getCompanies();
    data.sort(function (a, b) {
        if (a.CompanyName < b.CompanyName) {
          return -1;
        }
        if (a.CompanyName > b.CompanyName) {
          return 1;
        }
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Company Name";
    document.getElementById("orderNameButton").style.display = "none";
    document.getElementById("orderTownButton").style.display = "block";
}


async function getCompaniesByTown() {
    const data = await getCompanies();
    data.sort(function (a, b) {
        if (a.Town < b.Town) {
          return -1;
        }
        if (a.Town > b.Town) {
          return 1;
        }
        return 0;
    });

    getRows(data);
    document.getElementById("orderDropdown").innerHTML = "Ordering by: Town";
    document.getElementById("orderNameButton").style.display = "block";
    document.getElementById("orderTownButton").style.display = "none";
}


function getRows(json) {
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
        const viewUrl = new URL("http://127.0.0.1:8080/edit-company.html");
        viewUrl.searchParams.append("id", json[i].Id);
        viewUrl.searchParams.append("companyName", json[i].CompanyName);
        viewUrl.searchParams.append("town", json[i].Town);
        viewUrl.searchParams.append("editable", false);
        viewButton.href = viewUrl;
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-outline-dark");
        buttonCol.appendChild(viewButton);

        const editButton = document.createElement("a");
        editButton.appendChild(document.createTextNode("Edit"));
        editButton.dataset.id = json[i].Id;
        const editUrl = new URL("http://127.0.0.1:8080/edit-company.html");
        editUrl.searchParams.append("id", json[i].Id);
        editUrl.searchParams.append("companyName", json[i].CompanyName);
        editUrl.searchParams.append("town", json[i].Town);
        editUrl.searchParams.append("editable", true);
        editButton.href = editUrl;
        editButton.classList.add("btn");
        editButton.classList.add("btn-outline-primary");
        buttonCol.appendChild(editButton);

        const deletebutton = document.createElement("button");
        deletebutton.appendChild(document.createTextNode("Delete"));
        deletebutton.dataset.id = json[i].Id;
        deletebutton.addEventListener("click", deleteRow);
        deletebutton.classList.add("btn");
        deletebutton.classList.add("btn-outline-danger");
        buttonCol.appendChild(deletebutton);

        row.appendChild(buttonCol);

        const nameCol = document.createElement("th");
        nameCol.appendChild(document.createTextNode(json[i].CompanyName));
        const townCol = document.createElement("th");
        townCol.appendChild(document.createTextNode(json[i].Town));
        row.appendChild(nameCol);
        row.appendChild(townCol);
        table.appendChild(row);
        }
}


async function deleteRow(event) {
    const deleteCompany = confirm("Are you sure you want to delete this company?")
    if (deleteCompany == true) {
        const company_id = event.target.dataset.id;
        await fetch(render_url + "/companies/delete/" + company_id, {
            method: "DELETE"
        });
        location.reload();
    }
    
}
