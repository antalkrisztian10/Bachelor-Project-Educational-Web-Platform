<template>
  <div class="view-course-container">
    <!-- Course Title and Settings Icon -->
    <div class="view-course">
      <div class="course-header">
        <h1 class="course-title">{{ courseTitle || 'Loading...' }}</h1>
        <div class="settings-icon" @click="showLeaveConfirmation = true">⚙️</div>
      </div>

      <!-- Course Items -->
      <div v-for="item in courseItems" :key="item.id" class="course-item">
        <div class="icon" :class="`icon-${item.type}`"></div>
        <div class="details">
          <h3>{{ item.title }}</h3>
          <p v-if="item.description">{{ item.description }}</p>
        </div>
        <button class="action-button" @click="navigateTo(item.type, item.id)">
          {{ capitalizeType(item.type) }}
        </button>
      </div>
    </div>

    <!-- Leave Course Confirmation Modal -->
    <div v-if="showLeaveConfirmation" class="modal-overlay">
      <div class="modal-content">
        <h2>Leave Course</h2>
        <p>Are you sure you want to leave this course? This action cannot be undone.</p>
        <div class="modal-buttons">
          <button class="cancel-button" @click="showLeaveConfirmation = false">Cancel</button>
          <button class="confirm-button" @click="leaveCourse">Leave Course</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'ViewCourse',
  data() {
    return {
      courseTitle: '',
      courseItems: [],
      showLeaveConfirmation: false
    }
  },
  methods: {
    async fetchCourseContent() {
      try {
        const userId = localStorage.getItem('userId')
        const courseId = this.$route.params.id

        if (!userId) {
          throw new Error('User ID is missing')
        }

        const response = await axios.get(`/courses/${courseId}/content`, {
          params: { userId }
        })

        const { course, items } = response.data

        this.courseTitle = course.title
        this.courseItems = items.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          description: item.description,
          iconClass: `icon-${item.type}`
        }))
      } catch (error) {
        console.error('Error fetching course content:', error.response?.data || error.message)

        const message =
          error.response?.data?.message || 'Failed to load course content. Please try again.'

        alert(message)

        if (error.response && (error.response.status === 404 || error.response.status === 403)) {
          this.$router.push('/home')
        }
      }
    },
    navigateTo(type, id) {
      if (type === 'lesson') this.$router.push(`/lesson/${id}`)
      else if (type === 'quiz') this.$router.push(`/quiz/${id}`)
      else if (type === 'meeting') this.$router.push(`/meeting/${id}`)
      else if (type === 'assignment') this.$router.push(`/assignment/${id}`)
    },
    capitalizeType(type) {
      if (!type) return ''
      return type.charAt(0).toUpperCase() + type.slice(1)
    },
    async leaveCourse() {
      try {
        const userId = localStorage.getItem('userId')
        const courseId = this.$route.params.id

        if (!userId) {
          throw new Error('User ID is missing')
        }

        await axios.delete(`/courses/${courseId}/leave`, {
          data: { userId }
        })

        alert('You have successfully left the course.')
        this.$router.push('/courses')
      } catch (error) {
        console.error('Error leaving course:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to leave the course. Please try again.')
      } finally {
        this.showLeaveConfirmation = false
      }
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchCourseContent()
      }
    }
  }
}
</script>

<style scoped>
.view-course {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Course header with title and settings icon */
.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.course-title {
  font-size: 2em;
  color: #333;
  margin: 0;
}

.settings-icon {
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.settings-icon:hover {
  background-color: #f0f0f0;
}

/* Dark mode styles */
body.dark-mode .view-course {
  background-color: #1e1e1e;
  border-color: #444;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode .course-title {
  color: #f0f0f0;
}

body.dark-mode .settings-icon:hover {
  background-color: #333;
}

.course-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Dark mode for each course item */
body.dark-mode .course-item {
  background-color: #333;
  border-color: #555;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Icon styles (preserved from original) */
.icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

body.dark-mode .icon {
  background-color: #4a90e2;
  border: 2px solid #333;
}

.icon-lesson::before {
  content: '\1F4DA'; /* Book icon */
}

.icon-quiz::before {
  content: '\1F4DD'; /* Memo icon */
}

.icon-assignment::before {
  content: '\1F4C4'; /* Document icon */
}

.icon-meeting::before {
  content: '\1F4BB'; /* Laptop icon */
}

.details {
  flex: 1;
}

.details h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

body.dark-mode .details h3 {
  color: #f0f0f0;
}

body.dark-mode .details p {
  color: #ccc;
}

.details p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9em;
}

.action-button {
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #0056b3;
}

body.dark-mode .action-button {
  background-color: #0056b3;
}

body.dark-mode .action-button:hover {
  background-color: #003f8a;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

body.dark-mode .modal-content {
  background-color: #333;
  color: #f0f0f0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
}

body.dark-mode .cancel-button {
  background-color: #555;
  color: #f0f0f0;
}

body.dark-mode .confirm-button {
  background-color: #b52b38;
}
</style>
