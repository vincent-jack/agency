async function getCompanies(file) {
    const response = await fetch(file);
    const json = await response.json();

    const table = document.getElementById("data-table");

    for (let i = 0; i < json.length; i++) {
        const row = document.createElement("tr");
        const buttonCol = document.createElement("th");

        const viewButton = document.createElement("a");
        viewButton.appendChild(document.createTextNode("View"));
        const viewUrl = new URL("http://127.0.0.1:8080/edit-company.html");
        viewUrl.searchParams.append("id", json[i].Id)
        viewUrl.searchParams.append("companyName", json[i].CompanyName)
        viewUrl.searchParams.append("town", json[i].Town)
        viewUrl.searchParams.append("editable", false)
        viewButton.href = viewUrl
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-outline-dark");
        buttonCol.appendChild(viewButton);

        const editButton = document.createElement("a");
        editButton.appendChild(document.createTextNode("Edit"));
        editButton.dataset.id = json[i].Id;
        const editUrl = new URL("http://127.0.0.1:8080/edit-company.html");
        editUrl.searchParams.append("id", json[i].Id)
        editUrl.searchParams.append("companyName", json[i].CompanyName)
        editUrl.searchParams.append("town", json[i].Town)
        editUrl.searchParams.append("editable", true)
        editButton.href = editUrl
        editButton.classList.add("btn");
        editButton.classList.add("btn-outline-primary");
        buttonCol.appendChild(editButton)

        const deletebutton = document.createElement("button");
        deletebutton.appendChild(document.createTextNode("Delete"));
        deletebutton.dataset.id = json[i].Id;
        deletebutton.addEventListener("click", deleteRow);
        deletebutton.classList.add("btn");
        deletebutton.classList.add("btn-outline-danger");
        buttonCol.appendChild(deletebutton);

        row.appendChild(buttonCol);

        const idCol = document.createElement("th");
        idCol.appendChild(document.createTextNode(json[i].Id));
        const nameCol = document.createElement("th");
        nameCol.appendChild(document.createTextNode(json[i].CompanyName));
        const townCol = document.createElement("th");
        townCol.appendChild(document.createTextNode(json[i].Town));
        row.appendChild(idCol);
        row.appendChild(nameCol);
        row.appendChild(townCol);

        table.appendChild(row);
        }

    }

    getCompanies("http://127.0.0.1:5000/companies");


async function deleteRow(event) {
    const deleteCompany = confirm("Are you sure you want to delete this company?")
    if (deleteCompany == true) {
        const company_id = event.target.dataset.id;
        await fetch("http://127.0.0.1:5000/companies/delete/" + company_id, {
            method: "DELETE"
        });
        location.reload();
    }
    
}

async function updateRow(event) {
    const company_id = event.target.dataset.id;
    const new_name = prompt("Enter Name of Company:");
    const new_town = prompt("Enter Town of Company:");

    if (new_name == "" || new_town == "") {
        alert("Fields cannot be left blank")
        return
    }

    const data = JSON.stringify({
        company_name: new_name,
        town: new_town,
    });

    await fetch("http://127.0.0.1:5000/companies/update/" + company_id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
          },
        body: data,
    })
    location.reload();
}


