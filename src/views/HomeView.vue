<template>
  <div class="main-container">
    <h1>QuickAction</h1>
    <hr class="divider" />
    <div class="container mt-2">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12 mb-4">
          <div class="card">
            <h3>Announcements</h3>
            <p>See what's new on EduCore.</p>
            <router-link to="/announcements" class="btn btn-primary">
              View Announcements
            </router-link>
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mb-4">
          <div class="card">
            <h3>Professors</h3>
            <p>View All The Professors on the platform</p>
            <router-link to="/professors" class="btn btn-primary"> View Details </router-link>
          </div>
        </div>
      </div>
    </div>
    <h1>Quick Courses</h1>
    <hr class="divider" />
    <div class="container mt-4">
      <div class="row">
        <div v-for="course in courses" :key="course.id" class="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div class="card" :style="{ backgroundColor: course.color || '#f8f9fa' }">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <router-link
              :to="userRole === 'Professor' ? `/viewp/${course.id}` : `/view/${course.id}`"
              class="btn btn-primary"
            >
              View Course
            </router-link>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    </div>
    <div class="d-flex justify-content-center">
      <router-link
        :to="userRole === 'Professor' ? '/coursesp' : '/courses'"
        class="btn btn-primary"
      >
        View All Courses
      </router-link>
    </div>
    <br />
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'HomeView',
  data() {
    return {
      courses: [],
      errorMessage: '',
      userRole: localStorage.getItem('userRole') // Get user role from localStorage
    }
  },
  methods: {
    async fetchCourses() {
      const userId = localStorage.getItem('userId') // Get the logged-in user ID
      let route = '' // Backend route

      // Determine the backend route based on the user's role
      if (this.userRole === 'Student') {
        route = `/student_course_home/${userId}`
      } else if (this.userRole === 'Professor') {
        route = `/professor_course_home/${userId}`
      } else {
        console.error('Unknown role:', this.userRole)
        return
      }

      try {
        const response = await axios.get(route)
        this.courses = response.data
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message)
        this.errorMessage = error.response?.data?.message || 'Error fetching courses.'
      }
    }
  },
  mounted() {
    this.fetchCourses()
  }
}
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  padding-left: 15px;
  padding-right: 15px;
}

h1 {
  margin-top: 20px;
  text-align: left;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.divider {
  border: none;
  border-top: 5px solid #007bff; /* Blue color to match the theme */
  width: 100%;
  margin: 20px 0;
}

/* Modern Card with Hover Animation */
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  background: #fff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Text color for error messages */
.text-danger {
  color: red;
}

/* Button Styling */
.btn {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    margin-bottom: 20px;
  }
}

/* Dark Mode */
body.dark-mode .card {
  background-color: #333;
  border-color: #555;
  color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
</style>
