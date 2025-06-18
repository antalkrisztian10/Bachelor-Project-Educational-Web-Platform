<template>
  <div class="courses-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Courses</h1>
      <button class="btn btn-primary" @click="showModal = true">Join Course</button>
    </div>
    <hr class="divider" />
    <div class="container mt-4">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-12 mb-4" v-for="course in courses" :key="course.id">
          <div class="card" :style="{ backgroundColor: course.color }">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <router-link :to="'/view/' + course.id" class="btn btn-light">View Course</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for joining a course -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Join Course</h5>
            <button type="button" class="close" @click="closeModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="joinCourse">
              <div class="form-group">
                <label for="courseId">Course ID</label>
                <input
                  type="text"
                  id="courseId"
                  v-model="courseId"
                  class="form-control"
                  placeholder="Enter Course ID"
                  required
                />
              </div>
              <div class="form-group mt-3">
                <label for="coursePassword">Course Password</label>
                <input
                  type="password"
                  id="coursePassword"
                  v-model="coursePassword"
                  class="form-control"
                  placeholder="Enter Course Password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary mt-4">Join</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'CoursesView',
  data() {
    return {
      showModal: false, // Controls modal visibility
      courseId: '', // Course ID input
      coursePassword: '', // Course password input
      courses: [] // List of courses the student is enrolled in
    }
  },
  methods: {
    async fetchStudentCourses() {
      try {
        const userId = localStorage.getItem('userId') // Get student ID from localStorage
        if (!userId) throw new Error('User ID is missing')

        const response = await axios.get('/student_courses', {
          params: { user_id: userId } // Send user ID as a query parameter
        })

        this.courses = response.data // Populate the courses array with the fetched data
      } catch (error) {
        console.error('Error fetching student courses:', error.response?.data || error.message)
        alert('Failed to load your courses. Please refresh the page.')
      }
    },
    async joinCourse() {
      try {
        const userId = localStorage.getItem('userId')
        const response = await axios.post('/join_course', {
          course_id: this.courseId,
          password: this.coursePassword,
          user_id: userId
        })
        alert(response.data.message)
        this.fetchStudentCourses() // Refresh the list of courses
        this.closeModal()
      } catch (error) {
        console.error('Error joining course:', error.response?.data?.message || error.message)
        alert(error.response?.data?.message || 'Error joining course')
      }
    },
    closeModal() {
      this.showModal = false
      this.courseId = ''
      this.coursePassword = ''
    }
  },
  mounted() {
    this.fetchStudentCourses() // Fetch courses when the component is mounted
  }
}
</script>

<style scoped>
.courses-container {
  max-width: 1200px;
  padding-left: 15px;
  padding-right: 15px;
}

h1 {
  margin-top: 20px;
  text-align: left;
}

.divider {
  border: none;
  border-top: 5px solid #007bff;
  width: 100%;
  margin: 20px 0;
}

.card {
  padding: 20px;
  border: 1px solid #000000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  color: white;
}

body.dark-mode .card {
  padding: 20px;
  border: 1px solid #2d2929;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 250px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-3 {
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
}

.modal-content {
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-control {
  padding: 10px;
  border-radius: 5px;
}

body.dark-mode .modal-content {
  background-color: #2d2929;
  color: #e0e0e0;
}

body.dark-mode .modal-header {
  border-bottom: 1px solid #444;
}

body.dark-mode .form-control {
  background-color: #444;
  color: #e0e0e0;
  border: 1px solid #555;
}

body.dark-mode .form-control::placeholder {
  color: #bbbbbb;
}
</style>
