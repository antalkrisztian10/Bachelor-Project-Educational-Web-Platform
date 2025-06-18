<template>
  <div class="admin-courses-container">
    <h1>Manage Courses</h1>

    <!-- Add Course Button -->
    <button class="add-course-button" @click="openAddCourseModal">Add Course</button>

    <div class="table-container">
      <table class="courses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Creator ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.title }}</td>
            <td>{{ course.description }}</td>
            <td>{{ course.creator_id }}</td>
            <td>
              <button class="edit-button" @click="editCourse(course.id)">Edit</button>
              <button class="delete-button" @click="deleteCourse(course.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Course Modal -->
    <div v-if="showAddCourseModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Course</h2>
        <form @submit.prevent="addCourse">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newCourse.title" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="newCourse.password" required />
          </div>
          <div class="form-group">
            <label for="color">Color</label>
            <input type="color" id="color" v-model="newCourse.color" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newCourse.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="creator_id">Creator ID</label>
            <input type="number" id="creator_id" v-model="newCourse.creator_id" required />
          </div>
          <button type="submit" class="save-button">Save</button>
          <button type="button" class="cancel-button" @click="closeAddCourseModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AdminCourses',
  data() {
    return {
      courses: [],
      showAddCourseModal: false,
      newCourse: {
        title: '',
        password: '',
        color: '#ffffff',
        description: '',
        creator_id: ''
      }
    }
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get('/admin/courses')
        this.courses = response.data
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message)
        alert('Failed to load courses.')
      }
    },
    openAddCourseModal() {
      this.showAddCourseModal = true
    },
    closeAddCourseModal() {
      this.showAddCourseModal = false
      this.resetNewCourse()
    },
    async addCourse() {
      try {
        await axios.post('/admin/courses', this.newCourse)
        alert('Course added successfully!')
        this.fetchCourses()
        this.closeAddCourseModal()
      } catch (error) {
        console.error('Error adding course:', error.response?.data || error.message)
        alert('Failed to add course.')
      }
    },
    resetNewCourse() {
      this.newCourse = {
        title: '',
        password: '',
        color: '#ffffff',
        description: '',
        creator_id: ''
      }
    },
    async deleteCourse(id) {
      try {
        await axios.delete(`/admin/courses/${id}`)
        alert('Course deleted successfully!')
        this.fetchCourses()
      } catch (error) {
        console.error('Error deleting course:', error.response?.data || error.message)
        alert('Failed to delete course.')
      }
    },
    editCourse(id) {
      this.$router.push({ name: 'edit_course', params: { id } })
    }
  },
  mounted() {
    this.fetchCourses()
  }
}
</script>

<style scoped>
.admin-courses-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}

.add-course-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
}

.add-course-button:hover {
  background-color: #0056b3;
}

/* Table container for responsiveness */
.table-container {
  overflow-x: auto;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.courses-table th,
.courses-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

.courses-table th {
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  resize: vertical;
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

/* Dark mode styles */
body.dark-mode .courses-table {
  background-color: #333333;
  color: #f0f0f0;
}

body.dark-mode .courses-table th {
  background-color: #444;
  color: #e0e0e0;
}

body.dark-mode .courses-table td {
  border-bottom: 1px solid #555;
}

body.dark-mode .edit-button {
  background-color: #4caf50;
}

body.dark-mode .delete-button {
  background-color: #e53935;
}

body.dark-mode .modal-content {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .form-group input,
body.dark-mode .form-group textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .modal-content h2 {
  color: #f0f0f0;
}
</style>
