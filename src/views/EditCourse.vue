<template>
  <div class="edit-course-container">
    <h1>Edit Course</h1>

    <!-- Course Form -->
    <div class="form-container">
      <form @submit.prevent="updateCourse">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="course.title" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="course.description" required></textarea>
        </div>

        <div class="form-group">
          <label for="createdBy">Created By</label>
          <input type="text" id="createdBy" v-model="course.createdBy" disabled />
        </div>

        <button type="submit" class="update-button">Update Course</button>
      </form>
    </div>

    <!-- Enrolled Students Section -->
    <h2>Enrolled Students</h2>
    <div class="table-container">
      <table class="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in enrolledStudents" :key="student.participant_id">
            <td>{{ student.student_id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <button class="remove-button" @click="removeStudent(student.participant_id)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Student Button -->
    <button class="add-student-button" @click="openAddStudentModal">Add Student</button>

    <!-- Add Student Modal -->
    <div v-if="showAddStudentModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Student</h2>
        <form @submit.prevent="addStudent">
          <div class="form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" v-model="newStudentId" required />
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
  name: 'EditCourse',
  data() {
    return {
      course: {
        id: this.$route.params.id,
        title: '',
        description: '',
        createdBy: ''
      },
      enrolledStudents: [],
      showAddStudentModal: false,
      newStudentId: ''
    }
  },
  mounted() {
    this.loadCourseData()
    this.loadEnrolledStudents()
  },
  methods: {
    async loadCourseData() {
      try {
        const response = await axios.get(`/admin/courses/${this.course.id}`)
        this.course = response.data
      } catch (error) {
        console.error('Error fetching course details:', error.response?.data || error.message)
        alert('Failed to load course details.')
      }
    },
    async loadEnrolledStudents() {
      try {
        const response = await axios.get(`/admin/courses/${this.course.id}/participants`)
        this.enrolledStudents = response.data
      } catch (error) {
        console.error('Error fetching enrolled students:', error.response?.data || error.message)
        alert('Failed to load enrolled students.')
      }
    },
    async updateCourse() {
      try {
        await axios.put(`/admin/courses/${this.course.id}`, this.course)
        alert('Course updated successfully!')
      } catch (error) {
        console.error('Error updating course:', error.response?.data || error.message)
        alert('Failed to update course.')
      }
    },
    async removeStudent(participantId) {
      try {
        await axios.delete(`/admin/courses/${this.course.id}/participants/${participantId}`)
        this.enrolledStudents = this.enrolledStudents.filter(
          (student) => student.participant_id !== participantId
        )
        alert('Student removed successfully!')
      } catch (error) {
        console.error('Error removing student:', error.response?.data || error.message)
        alert('Failed to remove student.')
      }
    },
    openAddStudentModal() {
      this.showAddStudentModal = true
    },
    closeAddStudentModal() {
      this.showAddStudentModal = false
      this.newStudentId = ''
    },
    async addStudent() {
      try {
        await axios.post(`/admin/courses/${this.course.id}/participants`, {
          studentId: this.newStudentId
        })
        this.loadEnrolledStudents()
        this.closeAddStudentModal()
        alert('Student added successfully!')
      } catch (error) {
        console.error('Error adding student:', error.response?.data || error.message)
        alert('Failed to add student.')
      }
    }
  }
}
</script>

<style scoped>
.edit-course-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1,
h2 {
  color: #333;
}

.form-container {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-weight: bold;
}

input[type='text'],
textarea,
input[type='email'] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

.update-button,
.add-student-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1em;
  margin-top: 20px;
}

.update-button:hover,
.add-student-button:hover {
  background-color: #0056b3;
}

.table-container {
  overflow-x: auto;
  margin-top: 20px;
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
}

.students-table th {
  background-color: #007bff;
  color: #ffffff;
}

.remove-button {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.remove-button:hover {
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

.save-button,
.cancel-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  font-size: 1em;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Dark mode styles */
body.dark-mode .edit-course-container {
  background-color: #333;
  color: #e0e0e0;
}

body.dark-mode h1,
body.dark-mode h2 {
  color: #e0e0e0;
}

body.dark-mode .students-table {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .students-table th {
  background-color: #444;
  color: #e0e0e0;
}

body.dark-mode .students-table td {
  border-bottom: 1px solid #555;
}

body.dark-mode .remove-button {
  background-color: #e53935;
}

body.dark-mode .remove-button:hover {
  background-color: #d32f2f;
}

body.dark-mode .update-button,
body.dark-mode .add-student-button {
  background-color: #007bff;
}

body.dark-mode .update-button:hover,
body.dark-mode .add-student-button:hover {
  background-color: #0056b3;
}

body.dark-mode .modal-content {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .form-group input {
  background-color: #444;
  color: #e0e0e0;
  border: 1px solid #555;
}

body.dark-mode .modal-content h2 {
  color: #f0f0f0;
}

body.dark-mode .save-button {
  background-color: #007bff;
}

body.dark-mode .save-button:hover {
  background-color: #0056b3;
}

body.dark-mode .cancel-button {
  background-color: #dc3545;
}

body.dark-mode .cancel-button:hover {
  background-color: #c82333;
}

/* Dark mode for textarea (description field) */
body.dark-mode textarea {
  background-color: #444;
  color: #e0e0e0;
  border: 1px solid #555;
}
</style>
