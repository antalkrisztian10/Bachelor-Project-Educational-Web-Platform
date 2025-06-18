<template>
  <div class="admin-professors-container">
    <h1>Manage Professors</h1>

    <!-- Add Professor Button -->
    <button class="add-professor-button" @click="openAddProfessorModal">Add Professor</button>

    <div class="table-container">
      <table class="professors-table">
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
          <tr v-for="professor in professors" :key="professor.id">
            <td>{{ professor.id }}</td>
            <td>{{ professor.full_name }}</td>
            <td>{{ professor.email }}</td>
            <td>{{ professor.username }}</td>
            <td>
              <button class="edit-button" @click="editProfessor(professor.id)">Edit</button>
              <button class="delete-button" @click="deleteProfessor(professor.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Professor Modal -->
    <div v-if="showAddProfessorModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Professor</h2>
        <form @submit.prevent="addProfessor">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="newProfessor.username" required />
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="newProfessor.full_name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="newProfessor.email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="newProfessor.password" required />
          </div>
          <button type="submit" class="save-button">Save</button>
          <button type="button" class="cancel-button" @click="closeAddProfessorModal">
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AdminProfessors',
  data() {
    return {
      professors: [],
      showAddProfessorModal: false,
      newProfessor: {
        username: '',
        full_name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async fetchProfessors() {
      try {
        const response = await axios.get('/admin/professors')
        this.professors = response.data
      } catch (error) {
        console.error('Error fetching professors:', error.response?.data || error.message)
        alert('Failed to fetch professors.')
      }
    },
    openAddProfessorModal() {
      this.showAddProfessorModal = true
    },
    closeAddProfessorModal() {
      this.showAddProfessorModal = false
      this.resetNewProfessor()
    },
    async addProfessor() {
      try {
        await axios.post('/admin/professors', this.newProfessor)
        alert('Professor added successfully!')
        this.fetchProfessors()
        this.closeAddProfessorModal()
      } catch (error) {
        console.error('Error adding professor:', error.response?.data || error.message)
        alert('Failed to add professor.')
      }
    },
    resetNewProfessor() {
      this.newProfessor = {
        username: '',
        full_name: '',
        email: '',
        password: ''
      }
    },
    async deleteProfessor(id) {
      try {
        await axios.delete(`/admin/professors/${id}`)
        alert('Professor deleted successfully!')
        this.fetchProfessors()
      } catch (error) {
        console.error('Error deleting professor:', error.response?.data || error.message)
        alert('Failed to delete professor.')
      }
    },
    editProfessor(id) {
      this.$router.push({ name: 'edit_professor', params: { id } })
    }
  },
  mounted() {
    this.fetchProfessors()
  }
}
</script>

<style scoped>
/* Similar styling as AdminStudents.vue, but updated for AdminProfessors */

.admin-professors-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}

.add-professor-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
}

.add-professor-button:hover {
  background-color: #0056b3;
}

/* Table styling, similar to students table */
.table-container {
  overflow-x: auto;
}

.professors-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.professors-table th,
.professors-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

.professors-table th {
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

body.dark-mode .professors-table {
  background-color: #333333; /* Darker background for table */
  color: #f0f0f0; /* Light text color for table cells */
}

body.dark-mode .professors-table th {
  background-color: #444; /* Darker background for table header */
  color: #e0e0e0; /* Light text color for table header */
}

body.dark-mode .professors-table td {
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
