<template>
  <div class="assignment-view-container">
    <h1>{{ courseTitle }}</h1>
    <h2>{{ assignmentTitle }}</h2>
    <p class="assignment-description">{{ assignmentDescription }}</p>

    <div class="assignment-info">
      <table>
        <tbody>
          <tr>
            <td>Submission Status</td>
            <td>{{ submissionStatus }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ status }}</td>
          </tr>
          <tr>
            <td>Due Date</td>
            <td>{{ dueDate }}</td>
          </tr>
          <tr>
            <td>Time Remaining</td>
            <td>{{ timeRemaining }}</td>
          </tr>
        </tbody>
      </table>
      <div class="grade-container">
        <span class="grade-label">Grade:</span>
        <span class="grade">{{ grade }}</span>
      </div>
    </div>

    <!-- Display Uploaded Files -->
    <div v-if="uploadedFiles.length > 0" class="uploaded-file-container">
      <h2>Uploaded Files</h2>
      <ul>
        <li v-for="file in uploadedFiles" :key="file.id">
          <a :href="file.file_url" target="_blank">{{ file.file_name }}</a>
          <button v-if="status !== 'Graded'" @click="deleteFile(file.id)" class="delete-button">
            Delete
          </button>
        </li>
      </ul>
    </div>

    <!-- File Upload Section -->
    <!-- File Upload Section -->
    <div v-if="status !== 'Graded'" class="file-upload-container">
      <h2>Upload Files</h2>
      <input type="file" multiple @change="handleFileUpload" />
      <button
        class="upload-button"
        @click="submitAssignment"
        :disabled="selectedFiles.length === 0"
      >
        Submit Files
      </button>
    </div>
    <div v-else class="file-upload-disabled">
      <p>File uploads are disabled for graded assignments.</p>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AssignmentView',
  props: ['id'],
  data() {
    return {
      courseTitle: '',
      assignmentTitle: '',
      assignmentDescription: '',
      submissionStatus: 'Not Submitted',
      status: 'No grade',
      dueDate: '',
      timeRemaining: '',
      grade: '-',
      uploadedFiles: [], // Array to hold uploaded files
      selectedFiles: [] // Array to hold selected files for upload
    }
  },
  methods: {
    async fetchAssignmentDetails() {
      const userId = localStorage.getItem('userId')

      if (!userId) {
        alert('User not authenticated!')
        this.$router.push('/login') // Redirect to login if no userId is available
        return
      }

      try {
        const response = await axios.get(`/assignments/${this.id}/student?studentId=${userId}`)
        const { assignment, submission, timeRemaining } = response.data

        this.courseTitle = assignment.course_title
        this.assignmentTitle = assignment.title
        this.assignmentDescription = assignment.description
        this.dueDate = assignment.due_date
        this.timeRemaining = timeRemaining // Assign time remaining

        if (submission) {
          this.submissionStatus = 'Submitted'
          this.status = submission.grade ? 'Graded' : 'Pending' // Update status based on grade
          this.uploadedFiles = submission.files || []
          this.grade = submission.grade || '-' // Display the grade
        } else {
          this.submissionStatus = 'Not Submitted'
          this.uploadedFiles = []
          this.grade = '-'
        }
      } catch (error) {
        console.error('Error fetching assignment details:', error.response?.data || error.message)
        if (error.response?.status === 403) {
          alert('Access denied! Please log in to access this assignment.')
          this.$router.push('/home') // Redirect to login on forbidden access
        } else {
          alert('Failed to load assignment details.')
          this.$router.push('/home')
        }
      }
    },
    handleFileUpload(event) {
      this.selectedFiles = Array.from(event.target.files)
    },
    async submitAssignment() {
      if (this.selectedFiles.length === 0) {
        alert('Please select files before submitting.')
        return
      }

      const formData = new FormData()
      this.selectedFiles.forEach((file) => formData.append('files', file))
      formData.append('studentId', localStorage.getItem('userId'))

      try {
        await axios.post(`/assignments/${this.id}/student/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('Files uploaded successfully!')
        this.fetchAssignmentDetails()
      } catch (error) {
        console.error('Error uploading files:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to upload files please try again.')
      }
    },
    async deleteFile(fileId) {
      const userId = localStorage.getItem('userId')

      try {
        await axios.delete(`/assignments/${this.id}/student/file`, {
          data: { fileId, studentId: userId }
        })
        alert('File deleted successfully!')
        this.fetchAssignmentDetails()
      } catch (error) {
        if (error.response?.status === 403) {
          alert('Cannot delete file. The assignment is already graded.')
        } else {
          console.error('Error deleting file:', error.response?.data || error.message)
          alert('Failed to delete file. Please try again.')
        }
      }
    }
  },
  mounted() {
    this.fetchAssignmentDetails()
  }
}
</script>

<style scoped>
.assignment-view-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

h1 {
  font-size: 1.8em;
  color: #333;
}

h2 {
  font-size: 1.5em;
  color: #555;
}

.assignment-description {
  margin-bottom: 20px;
  font-size: 1.2em;
  color: #666;
}

.assignment-info {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.grade-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.grade-label {
  font-weight: bold;
  color: #333;
}

.grade {
  font-size: 1.2em;
  color: red;
}

.file-upload-container {
  margin-top: 20px;
  text-align: left;
}

.file-upload-container h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

input[type='file'] {
  margin-bottom: 10px;
  font-size: 1em;
}

.upload-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.upload-button:hover {
  background-color: #0056b3;
}

.upload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #c9302c;
}

/* Dark Mode */
body.dark-mode .assignment-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

body.dark-mode table td {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .assignment-info {
  background-color: #444;
  border: 2px solid #555;
}

body.dark-mode .upload-button {
  background-color: #0056b3;
}

body.dark-mode .upload-button:hover {
  background-color: #003f8a;
}

body.dark-mode .delete-button {
  background-color: #d9534f;
}

body.dark-mode .delete-button:hover {
  background-color: #c9302c;
}

body.dark-mode .grade {
  color: #ff6666;
}

body.dark-mode .grade-label {
  color: #f0f0f0;
}

body.dark-mode .assignment-view-container h1,
body.dark-mode .assignment-view-container h2,
body.dark-mode .assignment-description {
  color: #f0f0f0;
}
</style>
