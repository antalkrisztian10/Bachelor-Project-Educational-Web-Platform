<template>
  <div class="view-course-container">
    <!-- Course Title -->
    <div class="view-course">
      <h1 class="course-title">{{ course.title || 'Loading...' }}</h1>

      <!-- Buttons -->
      <div class="button-group">
        <button class="create-item-button" @click="navigateToCreatePage">Create Item</button>
        <button
          class="delete-item-button"
          :disabled="!selectedItems.length"
          @click="confirmDeleteItems"
        >
          Delete Items
        </button>
      </div>

      <!-- Course Items -->
      <div v-for="item in courseItems" :key="item.id" class="course-item">
        <div class="icon" :class="`icon-${item.type}`"></div>
        <div class="details">
          <h3>{{ item.title }}</h3>
          <p v-if="item.description">{{ item.description }}</p>
        </div>
        <button class="action-button" @click="navigateToItem(item)">
          {{ capitalizeType(item.type) }}
        </button>
        <input
          type="checkbox"
          class="select-item-checkbox"
          :checked="item.isSelected"
          @change="toggleSelection(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'ViewCourseProf',
  data() {
    return {
      course: {}, // Holds course details
      courseItems: [], // Items related to the course
      selectedItems: [], // Track selected items for deletion
      errorMessage: '' // Holds error messages, if any
    }
  },
  methods: {
    async fetchCourseDetails() {
      const courseId = this.$route.params.id
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error('User ID is missing')
        }

        const response = await axios.get(`/course/${courseId}`, {
          params: { userId }
        })

        this.course = response.data.course
        this.courseItems = response.data.items.map((item) => ({
          ...item,
          isSelected: false
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
    toggleSelection(item) {
      item.isSelected = !item.isSelected
      if (item.isSelected) {
        this.selectedItems.push({ id: item.id, type: item.type })
      } else {
        this.selectedItems = this.selectedItems.filter(
          (selected) => selected.id !== item.id || selected.type !== item.type
        )
      }
    },
    confirmDeleteItems() {
      if (confirm('Are you sure you want to delete the selected items?')) {
        this.deleteSelectedItems()
      }
    },
    async deleteSelectedItems() {
      if (this.selectedItems.length === 0) {
        alert('Please select at least one item to delete.')
        return
      }

      const courseId = this.$route.params.id
      console.log('Selected items to delete:', this.selectedItems)

      try {
        await axios.delete(`/course/${courseId}/items`, {
          data: { items: this.selectedItems }
        })

        this.courseItems = this.courseItems.filter((item) => !item.isSelected)
        this.selectedItems = []
        alert('Selected items deleted successfully!')
      } catch (error) {
        console.error('Error deleting items:', error.response?.data || error.message)
        alert('Failed to delete selected items. Please try again.')
      }
    },
    navigateToCreatePage() {
      const courseId = this.$route.params.id
      this.$router.push(`/create/${courseId}`)
    },
    navigateToItem(item) {
      const routes = {
        lesson: `/lessonp/${item.id}`,
        quiz: `/quizp/${item.id}`,
        meeting: `/meetingp/${item.id}`,
        assignment: `/assignmentp/${item.id}`
      }

      if (routes[item.type]) {
        this.$router.push(routes[item.type])
      } else {
        alert('Unknown item type.')
      }
    },
    capitalizeType(type) {
      if (!type) return ''
      return type.charAt(0).toUpperCase() + type.slice(1)
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchCourseDetails()
      }
    }
  }
}
</script>

<style scoped>
/* Styling for the main container */
.view-course {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Course title styling */
.course-title {
  font-size: 2em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Create item button styling */
.create-item-button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-item-button:hover {
  background-color: #0056b3;
}

/* Course items styling */
.course-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

/* Icon styling */
.icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: #007afe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

/* Different icons for each item type */
.icon-lesson::before {
  content: '\1F4DA'; /* Book icon */
}

.icon-quiz::before {
  content: '\1F4DD'; /* Memo icon */
}

.icon-meeting::before {
  content: '\1F4BB'; /* Computer icon */
}

.icon-assignment::before {
  content: '\1F4C4'; /* Document icon */
}

/* Styling for details */
.details {
  flex: 1;
}

.details h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.details p {
  margin: 5px 0 0;
  color: #666;
}

/* Action button styling */
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

/* Dark mode styles */
body.dark-mode .view-course {
  background-color: #1e1e1e;
  border-color: #444;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode .course-title {
  color: #f0f0f0;
}

body.dark-mode .course-item {
  background-color: #333;
  border-color: #555;
}

body.dark-mode .icon {
  background-color: #4a90e2;
}

body.dark-mode .details h3 {
  color: #f0f0f0;
}

body.dark-mode .details p {
  color: #ccc;
}

body.dark-mode .action-button {
  background-color: #0056b3;
}

body.dark-mode .action-button:hover {
  background-color: #003f8a;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.delete-item-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-item-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-item-button:hover:not(:disabled) {
  background-color: #b52a38;
}

.select-item-checkbox {
  margin-left: 10px;
  transform: scale(1.5);
}

body.dark-mode .delete-item-button:disabled {
  background-color: #555;
}
</style>
