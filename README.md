<h1 align="center" id="title">Bachelor Thesis Project (Educational Web Platform)</h1>

<p id="description">This Educational Web Platform was built as the central deliverable for my Bachelor’s thesis. It’s a proof-of-concept locally-hosted application designed to demonstrate how role-based systems (for Students Professors and Admins) can streamline online learning workflows—course creation lesson delivery assessments and intelligent Q&amp;A via a chatbot interface.<br><br>**Note:** This platform was developed purely for academic purposes. It runs locally and is not hardened for production use. You may encounter placeholder data stubbed-out features or security gaps that would need addressing before any real-world deployment.</p>

<h2>Project Screenshots:</h2>

<p> Login Page <p>
<img src="https://raw.githubusercontent.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/main/screenshots/loginPage.png" alt="project-screenshot" width="1500" height="500/">

<p> Home Page Student <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/HomePage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Courses Page Student <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/CoursesPage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Inside a Course Page <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/InsideCoursePage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Assignment Page Student <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/AssignmentViewPage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Profile Page <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/ProfilePage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Assignment View Page Professor <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/AssignmentProfPage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Create material Page <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/CreateLessonPage%20+%20AI.png?raw=true" alt="project-screenshot" width="1500" height="500/">

<p> Admin Manage Students Page <p>
<img src="https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-/blob/main/screenshots/ManageStudentsPage.png?raw=true" alt="project-screenshot" width="1500" height="500/">

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   ✅ Role-based authentication & authorization (Student Professor Admin)
*   ✅ User profile view & edit
*   ✅ Secure user registration & login (bcrypt)
*   ✅ Course CRUD (create read update delete)
*   ✅ Student enrollment & waitlist management
*   ✅ Lesson upload/download (PDF video)
*   ✅ Quiz builder with auto-grading
*   ✅ Assignment submission with manual grading
*   ✅ Meeting scheduling (Third Party Platform)
*   ✅ OpenAI-powered chatbot for Q&A
*   ✅ Responsive UI with Vue 3 & Vite
*   ✅ RESTful API built on Express & PostgreSQL
*   ✅ File uploads handled via Multer

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repo</p>

```
git clone https://github.com/antalkrisztian10/Bachelor-Project-Educational-Web-Platform-.git
```

```
cd Bachelor-Project-Educational-Web-Platform-
```

<p>3. Install frontend deps</p>

```
npm install
```

<p>4. Install backend deps</p>

```
cd backend
```

```
npm install
```

```
cd...
```

<p>7. Setup environment variables</p>

```
cp .env.example .env
```

```
# then edit .env to add your PostgreSQL URL OpenAI key etc.
```

<p>9. Import the Database into PostgreSQL</p>

<p>10. Run the backend server</p>

```
cd backend
```

```
node server.js
```

<p>12. Run the frontend dev server</p>

```
cd...
```

```
npm run dev
```

<h2>💻 Built with</h2>

Technologies used in the project:

*   Vue
*   Vite
*   Express
*   JavaScript
*   Bycript
*   Node.js
*   HTML
*   CSS
*   RestAPI
