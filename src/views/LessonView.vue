<template>
  <div class="lesson-view-container">
    <!-- Course Title -->
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Lesson Title and Description -->
    <div class="lesson-info">
      <h2>Lesson Title</h2>
      <p class="lesson-title">{{ lessonTitle }}</p>

      <h2>Lesson Description</h2>
      <p class="lesson-description">{{ lessonDescription }}</p>
    </div>

    <!-- Uploaded Files -->
    <div class="uploaded-files-container">
      <h2>Materials</h2>
      <ul v-if="materials.length > 0" class="uploaded-files-list">
        <li v-for="(file, index) in materials" :key="index" class="file-item">
          <div class="file-info">
            <i class="fas fa-file-pdf file-icon"></i>
            <span>{{ file.name }}</span>
          </div>
          <button class="download-button" @click="downloadFile(file.file_url)">
            <i class="fas fa-download"></i> Download
          </button>
        </li>
      </ul>
      <p v-else>No materials available for this lesson.</p>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'LessonView',
  data() {
    return {
      courseTitle: 'Loading...', // Default loading text
      lessonTitle: '',
      lessonDescription: '',
      materials: [] // Updated: Changed from uploadedFiles to materials
    }
  },
  methods: {
    // Fetch lesson details and materials
    async fetchLessonDetails() {
      const lessonId = this.$route.params.id // Get lesson ID from route params
      const userId = localStorage.getItem('userId') // Get userId from localStorage

      if (!userId) {
        console.error('Error: User ID is missing')
        alert('Failed to load lesson details. User ID is missing.')
        return
      }

      try {
        // Call the new student-specific API endpoint with userId
        const response = await axios.get(`/lessons/${lessonId}/student`, {
          params: { userId }
        })

        const { lesson, materials } = response.data

        this.lessonTitle = lesson.title
        this.lessonDescription = lesson.description
        this.courseTitle = lesson.courseTitle // Set the real course title here
        this.materials = materials // Files to download
      } catch (error) {
        console.error('Error fetching lesson details:', error.response?.data || error.message)
        if (error.response?.status === 403) {
          alert('Access denied: You are not enrolled in this course.')
          this.$router.push('/home')
        } else {
          alert('Failed to load lesson details. Please try again.')
          this.$router.push('/home')
        }
      }
    },
    // Download file by opening its URL
    downloadFile(url) {
      window.open(url, '_blank')
    }
  },
  mounted() {
    this.fetchLessonDetails()
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

/* Dark Mode: Lesson Container */
body.dark-mode .lesson-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

/* Course Title */
.course-title {
  text-align: center;
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
}

/* Dark Mode: Course Title */
body.dark-mode .course-title {
  color: #f0f0f0;
}

/* Lesson Information Section */
.lesson-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Dark Mode: Lesson Info */
body.dark-mode .lesson-info {
  background-color: #444;
  border-color: #555;
  color: #f0f0f0;
}

/* Lesson Title & Description */
.lesson-title,
.lesson-description {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #ddd;
}

/* Dark Mode: Lesson Title & Description */
body.dark-mode .lesson-title,
body.dark-mode .lesson-description {
  background-color: #555;
  border-color: #666;
  color: #f0f0f0;
}

/* Uploaded Files Section */
.uploaded-files-container h2 {
  margin-top: 20px;
  font-size: 1.3em;
  color: #444;
}

/* Dark Mode: Uploaded Files Header */
body.dark-mode .uploaded-files-container h2 {
  color: #f0f0f0;
}

.uploaded-files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Dark Mode: File Items */
body.dark-mode .file-item {
  background-color: #444;
  border-color: #555;
  color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

/* File Information (Icon + Name) */
.file-info {
  display: flex;
  align-items: center;
}

.file-icon {
  font-size: 1.5em;
  color: #e74c3c;
  margin-right: 10px;
}

/* Dark Mode: File Icon */
body.dark-mode .file-icon {
  color: #f16c6c;
}

/* Download Button */
.download-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.download-button i {
  margin-right: 5px;
}

.download-button:hover {
  background-color: #0056b3;
}

/* Dark Mode: Download Button */
body.dark-mode .download-button {
  background-color: #0056b3;
}

body.dark-mode .download-button:hover {
  background-color: #003f8a;
}
</style>
