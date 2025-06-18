<template>
  <div class="edit-professor-container">
    <h1>Edit Professor</h1>
    <div class="form-container">
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="professor.username" required />
        </div>

        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="professor.full_name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="professor.email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="professor.password"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" class="update-button">Update Professor</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'EditProfessor',
  props: ['id'], // Receive the professor ID from the route
  data() {
    return {
      professor: {
        id: '', // ID will be set dynamically
        username: '',
        full_name: '',
        email: '',
        password: ''
      }
    }
  },
  mounted() {
    this.fetchProfessorData()
  },
  methods: {
    async fetchProfessorData() {
      try {
        const response = await axios.get(`/admin/professors/${this.id}`) // Use the passed ID
        this.professor = response.data
      } catch (error) {
        console.error('Error fetching professor:', error.response?.data || error.message)
        alert('Failed to load professor details. Please try again.')
      }
    },
    async handleUpdate() {
      try {
        await axios.put(`/admin/professors/${this.id}`, this.professor)
        alert('Professor updated successfully!')
        this.$router.push('/admin_professor')
      } catch (error) {
        console.error('Error updating professor:', error.response?.data || error.message)
        alert('Failed to update professor. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.edit-professor-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
}

/* Form styles */
.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.update-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.update-button:hover {
  background-color: #0056b3;
}

/* Dark mode styles */
body.dark-mode .edit-professor-container {
  background-color: #333;
  color: #e0e0e0;
}

body.dark-mode label {
  color: #e0e0e0;
}

body.dark-mode input[type='text'],
body.dark-mode input[type='email'],
body.dark-mode input[type='password'] {
  background-color: #444;
  color: #e0e0e0;
  border: 1px solid #555;
}

body.dark-mode .update-button {
  background-color: #007bff;
}

body.dark-mode .update-button:hover {
  background-color: #0056b3;
}

body.dark-mode .edit-professor-container h1 {
  color: #e0e0e0;
}
</style>
