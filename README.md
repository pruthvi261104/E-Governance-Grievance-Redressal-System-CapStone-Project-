📘 E-Governance Grievance Redressal System

A secure and centralized e-governance platform that enables citizens to lodge grievances, track their status, and ensures transparent resolution through role-based workflows.

🛠️ Tech Stack

Backend: ASP.NET Core Web API

Frontend: Angular

Database: SQL Server

Authentication: JWT

Authorization: Role-Based Access Control (RBAC)

👥 User Roles

The system supports four roles:

Admin

Citizen

Department Officer

Supervisor

🔐 Seeded Admin Credentials

For initial access, an Admin account is already seeded in the database:

Email: admin@egov.com
Password: Admin@123


Use these credentials to log in and assign roles to newly registered users.

⚙️ Setup Instructions
1️⃣ Backend Setup (ASP.NET Core)

Clone the repository:

git clone <repository-url>


Open the backend project in Visual Studio.

Update the SQL Server connection string in appsettings.json.

Apply migrations and seed data:

Update-Database


This will create the database and seed the Admin user.

Run the backend:

dotnet run


Backend will run on:

https://localhost:xxxx

2️⃣ Frontend Setup (Angular)

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the Angular application:

ng serve


Frontend will be available at:

http://localhost:4200

🔄 System Workflow
Step-by-Step Workflow Explanation

User Registration

Any user registers using the registration page.

Role Assignment (Admin)

Admin logs in using seeded credentials.

Admin assigns one of the four roles:

Citizen

Department Officer

Supervisor

Admin

Grievance Lodging (Citizen)

Citizen logs in and lodges a grievance.

Grievance Assignment (Supervisor)

Supervisor assigns the grievance to a Department Officer.

Grievance Review & Resolution (Department Officer)

Department Officer marks grievance as In Review.

Resolves the grievance.

Citizen Feedback

If satisfied → grievance proceeds to closure.

If not satisfied → Citizen escalates the grievance.

Escalation & Reassignment (Supervisor)

Escalated grievance goes to Supervisor.

Supervisor reassigns it to a Department Officer.

Final Closure (Supervisor)

After resolution, Supervisor closes the grievance.

📊 System Workflow Diagram (Mermaid)

flowchart TD
    A[User Registers] --> B[Admin Assigns Role]
    B --> C[Citizen Lodges Grievance]
    C --> D[Supervisor Assigns to Dept Officer]
    D --> E[Dept Officer Reviews & Resolves]
    E --> F{Citizen Satisfied?}

    F -- Yes --> G[Supervisor Closes Grievance]
    F -- No --> H[Citizen Escalates Grievance]
    H --> I[Supervisor Reassigns Grievance]
    I --> E

 Key Features

Role-based dashboards

Secure JWT authentication

End-to-end grievance lifecycle tracking

Escalation and reassignment handling

Supervisor-controlled closure

Centralized and transparent system

 Conclusion

This system ensures accountability, transparency, and efficiency in handling public grievances through a structured role-based workflow.

