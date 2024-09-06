<h1>Agency Database Website</h1>
<p>
  A web application that allows users to add, edit and delete data on companies and people as well as the relationships between them. This project is intended to showcase some of my skills for recruitment purposes.
</p>
<p>
  Access the project here: https://agency-wtwz.onrender.com
</p>

<h2>Please note: The live website may take about a minute to show the data as it is running on a free hosting service.</h2>

<h3>Features</h3>
<ul>
  <li>Responsive design</li>
  <li>Interactive elements including dropdowns, inputs and animation.</li>
  <li>Home Page with animation.</li>
  <li>Pages to show company data and Person data</li>
  <li>Pages to create a new entry</li>
  <li>Pages to view and edit individual rows</li>
  <li>Delete buttons</li>
  <li>Sort data by column</li>
  <li>Visually appealing sidebar</li>
</ul>

<h3>Technologies</h3>
<ul>
  <li>HTML and JS frontend using Boostrap 5 for styling.</li>
  <li>Python backend API using the Flask framework and pyscog2 library to connect to a postgres database.</li>
  <li>Frontend and backend are hosted on render.com, while the database is on aiven.com.</li>
  <li>Version control with Git and Github.</li>
  <li>API testing done using Postman</li>
</ul>

<h3>Project Structure</h3>
<p>
  HTML and JS files are stored in the 'frontend' directory, while the python api file is kept in the 'api' directory.
</p>

<h3>Installation</h3>
<p>Clone this repository:<br>
```bash<br>
git clone https://github.com/vincent-jack/agency.git</p>

<h4>Run frontend</h4>

<p>Navigate to the directory:<br>
cd agency<br>
cd frontend</p>

<p>Install dependencies:<br>
npm install</p>

<p>Run the development server:<br>
npm start</p>

<h4>Database setup</h4>
<p>Setup PostgreSQL:<br>
Download and install a PostgreSQL server. For instructions, refer to the PostgreSQL documentation on www.postgresql.org.<br>
Add the PostgreSQL bin directory path to the PATH environmental variable.<br>
Open the command line and replace userName with your username: psql -U userName<br>
Enter your password if prompted.</p>

<p>Restore database:<br>
Create a template database with your chosen name: createdb -T template0 dbname<br>
Restore the data.sql file found in the agency directory: psql dbname < data.sql<br>
See https://www.postgresql.org/docs/8.1/backup.html for more info on dumping.
</p>

<h4>Run api</h4>

<p>Navigate to the diectory:<br>
cd agency<br>
cd api</p>

<p>Install dependencies:<br>
Python 3 must be installed: https://www.python.org/downloads/<br>
Create the DB_URL environment variable, filling in the required data on your database: export DB_URL="postgresql://username:password@host:port/database_name"<br>
pip install requirements.txt<br>
python3 main.py</p>

<h3>Contact me</h3>
<p>You can email me at vincent.jack@icloud.com or see my linkedin at: https://www.linkedin.com/in/jack-vincent-51b7542a8/</p>

