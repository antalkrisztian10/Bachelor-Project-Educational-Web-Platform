<template>
  <div class="admin-students-container">
    <h1>Manage Students</h1>

    <!-- Add Student Button -->
    <button class="add-student-button" @click="openAddStudentModal">Add Student</button>

    <div class="table-container">
      <table class="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.full_name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.username }}</td>
            <td>
              <button class="edit-button" @click="editStudent(student.id)">Edit</button>
              <button class="delete-button" @click="deleteStudent(student.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Student Modal -->
    <div v-if="showAddStudentModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Student</h2>
        <form @submit.prevent="addStudent">
          <div class="form-group">
            <label for="full_name">Full Name</label>
            <input type="text" id="full_name" v-model="newStudent.full_name" required />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="newStudent.username" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="newStudent.email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="newStudent.password" required />
          </div>
          <button type="submit" class="save-button">Save</button>
          <button type="button" class="cancel-button" @click="closeAddStudentModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AdminStudents',
  data() {
    return {
      students: [], // Initially empty, will be filled with data from the backend
      showAddStudentModal: false,
      newStudent: {
        full_name: '',
        username: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axios.get('/admin/students')
        this.students = response.data
      } catch (error) {
        console.error('Error fetching students:', error.response?.data || error.message)
        alert('Failed to load students. Please try again.')
      }
    },
    openAddStudentModal() {
      this.showAddStudentModal = true
    },
    closeAddStudentModal() {
      this.showAddStudentModal = false
      this.resetNewStudent()
    },
    editStudent(id) {
      this.$router.push({ name: 'edit_student', params: { id } })
    },
    addStudent() {
      try {
        axios
          .post('/admin/students', this.newStudent)
          .then(() => {
            alert('Student added successfully!')
            this.fetchStudents() // Refresh the student list
            this.closeAddStudentModal()
          })
          .catch((error) => {
            console.error('Error adding student:', error.response?.data || error.message)
            alert('Failed to add student. Please try again.')
          })
      } catch (error) {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred. Please try again.')
      }
    },
    resetNewStudent() {
      this.newStudent = {
        full_name: '',
        username: '',
        email: '',
        password: ''
      }
    },
    async deleteStudent(id) {
      if (confirm('Are you sure you want to delete this student?')) {
        try {
          await axios.delete(`/admin/students/${id}`)
          alert('Student deleted successfully!')
          this.fetchStudents() // Refresh the students list
        } catch (error) {
          console.error('Error deleting student:', error.response?.data || error.message)
          alert('Failed to delete student. Please try again.')
        }
      }
    }
  },
  mounted() {
    this.fetchStudents() // Fetch students when the component is mounted
  }
}
</script>

<style scoped>
.admin-students-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}

.add-student-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
}

.add-student-button:hover {
  background-color: #0056b3;
}

/* Table container for responsiveness */
.table-container {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.students-table th,
.students-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

.students-table th {
  background-color: #007bff;
  color: #ffffff;
}

.edit-button {
  background-color: #28a745;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-button:hover {
  background-color: #218838;
}

.delete-button {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 5px;
}

.cancel-button:hover {
  background-color: #c82333;
}

body.dark-mode .students-table {
  background-color: #333333; /* Darker background for table */
  color: #f0f0f0; /* Light text color for table cells */
}

body.dark-mode .students-table th {
  background-color: #444; /* Darker background for table header */
  color: #e0e0e0; /* Light text color for table header */
}

body.dark-mode .students-table td {
  border-bottom: 1px solid #555; /* Darker border color for table cells */
}

body.dark-mode .edit-button {
  background-color: #4caf50;
}

body.dark-mode .delete-button {
  background-color: #e53935;
}

/* Dark mode hover effects */
body.dark-mode .edit-button:hover {
  background-color: #43a047;
}

body.dark-mode .delete-button:hover {
  background-color: #d32f2f;
}

body.dark-mode .modal-content {
  background-color: #333; /* Darker background for modal */
  color: #f0f0f0; /* Light text color for modal content */
}

body.dark-mode .form-group input {
  background-color: #444; /* Darker background for form inputs */
  color: #f0f0f0; /* Light text color for form inputs */
  border: 1px solid #555; /* Darker border color for form inputs */
}

body.dark-mode .modal-content h2 {
  color: #f0f0f0; /* Light text color for modal heading */
}
</style>
