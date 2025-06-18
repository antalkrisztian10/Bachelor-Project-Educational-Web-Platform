<template>
  <div class="courses-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Courses</h1>
      <button class="btn btn-primary" @click="showModal = true">Create Course</button>
    </div>
    <hr class="divider" />
    <div class="container mt-4">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-12 mb-4" v-for="card in cards" :key="card.id">
          <div class="card" :style="{ backgroundColor: card.color }">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <!-- Dynamically redirect to viewp/:id -->
            <router-link :to="`/viewp/${card.id}`" class="btn btn-light">View Course</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for creating a course -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Course</h5>
            <button type="button" class="close" @click="closeModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createCourse">
              <div class="form-group">
                <label for="courseName">Course Name</label>
                <input
                  type="text"
                  id="courseName"
                  v-model="courseName"
                  class="form-control"
                  placeholder="Enter Course Name"
                  required
                />
              </div>
              <div class="form-group mt-3">
                <label for="courseDescription">Course Description</label>
                <textarea
                  id="courseDescription"
                  v-model="courseDescription"
                  class="form-control"
                  placeholder="Enter Course Description"
                  required
                ></textarea>
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
              <div class="form-group mt-3">
                <label for="courseColor">Course Background Color</label>
                <input
                  type="color"
                  id="courseColor"
                  v-model="courseColor"
                  class="form-control"
                  style="width: 50px; height: 50px; padding: 0; border: none"
                />
              </div>
              <button type="submit" class="btn btn-primary mt-4">Submit</button>
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
  name: 'CoursesViewProf',
  data() {
    return {
      showModal: false,
      courseName: '',
      courseDescription: '',
      coursePassword: '',
      courseColor: '#007bff',
      cards: [] // List of courses
    }
  },
  methods: {
    async createCourse() {
      try {
        const creatorId = localStorage.getItem('userId')
        if (!creatorId) throw new Error('User ID is missing')

        const newCourse = {
          title: this.courseName,
          description: this.courseDescription,
          color: this.courseColor,
          password: this.coursePassword,
          creator_id: creatorId
        }

        const response = await axios.post('/create_course', newCourse)
        this.cards.push(response.data.course)
        this.closeModal()
      } catch (error) {
        console.error('Error creating course:', error.response?.data || error.message)
        alert('Failed to create the course. Please try again.')
      }
    },
    async fetchCourses() {
      try {
        const creatorId = localStorage.getItem('userId')
        if (!creatorId) throw new Error('User ID is missing')

        const response = await axios.get('/courses', { params: { creatorId } })
        this.cards = response.data
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message)
        alert('Failed to load courses. Please refresh the page.')
      }
    },
    closeModal() {
      this.showModal = false
      this.courseName = ''
      this.courseDescription = ''
      this.coursePassword = ''
      this.courseColor = '#007bff'
    }
  },
  mounted() {
    this.fetchCourses()
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
  border: 1px solid #2d2929;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
