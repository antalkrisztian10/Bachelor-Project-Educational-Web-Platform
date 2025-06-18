<template>
  <div class="lesson-view-container">
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Lesson Title and Description -->
    <div class="lesson-info">
      <h2>Lesson Title</h2>
      <input type="text" v-model="lessonTitle" :disabled="!isEditing" class="lesson-title-input" />

      <h2>Lesson Description</h2>
      <textarea
        v-model="lessonDescription"
        :disabled="!isEditing"
        class="lesson-description-textarea"
      ></textarea>
    </div>

    <!-- Uploaded Files -->
    <div class="uploaded-files-container">
      <h2>Uploaded Files</h2>
      <ul class="uploaded-files-list">
        <li v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
          <a :href="file.url" target="_blank">{{ file.name }}</a>
          <button v-if="isEditing" class="remove-file-button" @click="removeFile(index)">
            Remove
          </button>
        </li>
      </ul>
      <div v-if="isEditing" class="add-file-container">
        <input type="file" @change="addFile" />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="toggleEditing">{{ isEditing ? 'Cancel' : 'Edit Lesson' }}</button>
      <button v-if="isEditing" @click="updateLessonDetails">Save Changes</button>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'LessonViewProf',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditing: false, // Toggle editing mode
      courseTitle: '', // Course title fetched from backend
      lessonTitle: '', // Fetched lesson title
      lessonDescription: '', // Fetched lesson description
      uploadedFiles: [], // Fetched uploaded files
      errorMessage: '' // Holds error messages, if any
    }
  },
  methods: {
    toggleEditing() {
      this.isEditing = !this.isEditing
    },
    async fetchLessonDetails() {
      try {
        const userId = localStorage.getItem('userId') // Fetch userId from localStorage
        if (!userId) {
          throw new Error('User ID is missing') // Handle missing userId
        }

        // Fetch lesson details with userId as a query parameter
        const response = await axios.get(`/lessons/${this.id}`, {
          params: { userId }
        })
        const { lesson } = response.data

        this.lessonTitle = lesson.title
        this.lessonDescription = lesson.description
        this.uploadedFiles = lesson.files

        // Fetch the course title if necessary
        const courseResponse = await axios.get(`/course/${lesson.course_id}`, {
          params: { userId }
        })
        this.courseTitle = courseResponse.data.course.title
      } catch (error) {
        console.error('Error fetching lesson details:', error.response?.data || error.message)
        const message =
          error.response?.data?.message || 'Failed to load lesson details. Please refresh the page.'

        alert(message)
        this.$router.push('/home')

        if (error.response && error.response.status === 403) {
          this.$router.push('/home')
        }
      }
    },
    async updateLessonDetails() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error('User ID is missing')
        }

        const payload = {
          userId,
          title: this.lessonTitle,
          description: this.lessonDescription,
          files: this.uploadedFiles // Example: [{ name: 'file1.pdf', url: '/uploads/file1.pdf' }]
        }

        await axios.put(`/lessons/${this.id}`, payload)
        alert('Lesson updated successfully!')
        this.isEditing = false // Exit editing mode
      } catch (error) {
        console.error('Error updating lesson:', error.response?.data || error.message)
        alert('Failed to update lesson. Please try again.')
      }
    },
    addFile(event) {
      const file = event.target.files[0]
      if (file) {
        const newFile = {
          name: file.name,
          url: URL.createObjectURL(file) // Use a temporary URL for now
        }
        this.uploadedFiles.push(newFile)
      }
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
    }
  },
  mounted() {
    this.fetchLessonDetails() // Fetch details when the component is mounted
  }
}
</script>

<style scoped>
.lesson-view-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

.course-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}

.lesson-info {
  margin-bottom: 20px;
}

.lesson-title-input,
.lesson-description-textarea {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.lesson-description-textarea {
  resize: none;
  height: 100px;
}

.uploaded-files-container {
  margin-top: 20px;
}

.uploaded-files-list {
  list-style: none;
  padding: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.file-item a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.file-item a:hover {
  text-decoration: underline;
}

.remove-file-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.remove-file-button:hover {
  background-color: darkred;
}

.add-file-container {
  margin-top: 10px;
}

.add-file-container input {
  display: block;
  font-size: 1em;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.action-buttons button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-buttons button:first-of-type {
  background-color: #007bff;
  color: white;
}

.action-buttons button:first-of-type:hover {
  background-color: #0056b3;
}

.action-buttons button:nth-of-type(2) {
  background-color: #28a745;
  color: white;
}

.action-buttons button:nth-of-type(2):hover {
  background-color: #218838;
}

.action-buttons button:nth-of-type(3) {
  background-color: #dc3545;
  color: white;
}

.action-buttons button:nth-of-type(3):hover {
  background-color: #c82333;
}

/* Dark Mode */
body.dark-mode .lesson-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

body.dark-mode .lesson-title-input,
body.dark-mode .lesson-description-textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .file-item {
  background-color: #444;
  border-color: #555;
}

body.dark-mode .file-item a {
  color: #1e90ff;
}

body.dark-mode .remove-file-button {
  background-color: #ff4444;
}

body.dark-mode .remove-file-button:hover {
  background-color: #cc0000;
}

body.dark-mode .action-buttons button:first-of-type {
  background-color: #0056b3;
}

body.dark-mode .action-buttons button:first-of-type:hover {
  background-color: #004494;
}

body.dark-mode .action-buttons button:nth-of-type(2) {
  background-color: #218838;
}

body.dark-mode .action-buttons button:nth-of-type(2):hover {
  background-color: #1b6e30;
}

body.dark-mode .action-buttons button:nth-of-type(3) {
  background-color: #c82333;
}

body.dark-mode .action-buttons button:nth-of-type(3):hover {
  background-color: #a71d2a;
}
</style>
