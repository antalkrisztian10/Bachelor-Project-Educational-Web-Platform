<template>
  <div class="edit-student-container">
    <h1>Edit Student</h1>
    <div class="form-container">
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="student.username" required />
        </div>

        <div class="form-group">
          <label for="full_name">Full Name</label>
          <input type="text" id="full_name" v-model="student.full_name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="student.email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="student.password"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" class="update-button">Update Student</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'EditStudent',
  props: ['id'],
  data() {
    return {
      student: {
        username: '',
        full_name: '',
        email: '',
        password: ''
      }
    }
  },
  mounted() {
    this.fetchStudentData()
  },
  methods: {
    async fetchStudentData() {
      try {
        const response = await axios.get(`/admin/students/${this.id}`)
        this.student = {
          username: response.data.username,
          full_name: response.data.full_name,
          email: response.data.email,
          password: '' // Password is not fetched for security reasons
        }
      } catch (error) {
        console.error('Error fetching student data:', error.response?.data || error.message)
        alert('Failed to load student data.')
      }
    },
    async handleUpdate() {
      const updateData = {
        username: this.student.username,
        full_name: this.student.full_name,
        email: this.student.email
      }

      // Only send password if it was changed
      if (this.student.password) {
        updateData.password = this.student.password
      }

      try {
        await axios.put(`/admin/students/${this.id}`, updateData)
        alert('Student updated successfully!')
        this.$router.push('/admin_student')
      } catch (error) {
        console.error('Error updating student:', error.response?.data || error.message)
        alert('Failed to update student.')
      }
    }
  }
}
</script>

<style scoped>
.edit-student-container {
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
body.dark-mode .edit-student-container {
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

body.dark-mode .edit-student-container h1 {
  color: #e0e0e0;
}
</style>
