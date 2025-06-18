<template>
  <div class="add-assignment-container">
    <h1>{{ courseTitle }}</h1>
    <h2>{{ assignmentTitle }}</h2>
    <p>{{ assignmentDescription }}</p>

    <div class="file-upload-area" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
      <p>
        <i class="fas fa-arrow-down"></i> Upload your document here by drag and dropping them or use
        the button below to select files.
      </p>
      <p class="file-types">Allowed file types: PDF, RAR, XLS</p>
      <input type="file" ref="fileInput" class="file-input" multiple @change="handleFileSelect" />
      <button class="upload-button" @click="triggerFileInput">Select Files</button>
    </div>

    <div v-if="uploadedFiles.length" class="uploaded-files">
      <h3>Uploaded Files:</h3>
      <ul>
        <li v-for="(file, index) in uploadedFiles" :key="index" class="uploaded-file-item">
          {{ file.name }}
          <button class="remove-file-button" @click="removeFile(index)">X</button>
        </li>
      </ul>
    </div>

    <button v-if="uploadedFiles.length" class="submit-button" @click="submitAssignment">
      Submit Assignment
    </button>
  </div>
</template>

<script>
export default {
  name: 'AddAssignment',
  data() {
    return {
      courseTitle: 'Course Title',
      assignmentTitle: 'Assignment 1',
      assignmentDescription: 'The Description of the assignment goes here.',
      uploadedFiles: [], // Array to store uploaded files
      allowedFileTypes: [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/x-rar-compressed'
      ] // Allowed MIME types
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.validateAndAddFiles(files)
    },
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      this.validateAndAddFiles(files)
    },
    validateAndAddFiles(files) {
      files.forEach((file) => {
        if (this.allowedFileTypes.includes(file.type)) {
          this.uploadedFiles.push(file)
        } else {
          alert(`File "${file.name}" is not allowed. Please upload only PDF, RAR, or XLS files.`)
        }
      })
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
    },
    submitAssignment() {
      if (this.uploadedFiles.length) {
        const fileNames = this.uploadedFiles.map((file) => file.name).join(', ')
        alert(`Assignment files (${fileNames}) have been submitted.`)
        // Add logic to send files to the server
      } else {
        alert('No files uploaded. Please upload at least one file before submitting.')
      }
    }
  }
}
</script>

<style scoped>
.add-assignment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  color: #333;
}

p {
  margin-bottom: 20px;
  color: #555;
}

.file-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  margin: 20px 0;
  background-color: #f9f9f9;
  text-align: center;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #007bff;
}

.file-types {
  color: #007bff;
  font-size: 0.9em;
  margin-top: 10px;
}

.file-input {
  display: none;
}

.upload-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.upload-button:hover {
  background-color: #0056b3;
}

.uploaded-files {
  margin-top: 20px;
  text-align: left;
}

.uploaded-files ul {
  list-style-type: none;
  padding: 0;
}

.uploaded-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.remove-file-button {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.remove-file-button:hover {
  background-color: #e64a19;
}

.submit-button {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}

/* Dark mode styles */
body.dark-mode .add-assignment-container {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .file-upload-area {
  background-color: #444;
  border-color: #666;
}

body.dark-mode .file-types {
  color: #80d4ff;
}

body.dark-mode .upload-button {
  background-color: #007bff;
  color: #f0f0f0;
}
body.dark-mode .remove-file-button {
  background-color: #d32f2f;
  color: #f0f0f0;
}
body.dark-mode .submit-button {
  background-color: #28a745;
  color: #f0f0f0;
}

body.dark-mode .upload-button:hover {
  background-color: #777;
}

body.dark-mode .remove-file-button:hover {
  background-color: #d32f2f;
}

body.dark-mode .submit-button:hover {
  background-color: #1e7e34;
}

body.dark-mode .uploaded-file-item {
  background-color: #555;
  border-color: #666;
}

body.dark-mode .uploaded-files h3 {
  color: #f0f0f0;
}

body.dark-mode .add-assignment-container h1,
body.dark-mode .add-assignment-container h2,
body.dark-mode .add-assignment-container p {
  color: #ccc;
}
</style>
