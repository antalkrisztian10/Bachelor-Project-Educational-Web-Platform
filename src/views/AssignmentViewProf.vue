<template>
  <div class="assignment-view-container">
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Top controls -->
    <div class="controls">
      <button v-if="!isEditing" class="btn btn-outline-primary" @click="enterEdit">Edit</button>
      <div v-else>
        <button class="btn btn-success" @click="saveMetadata">Save</button>
        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- Assignment Metadata -->
    <div class="assignment-details">
      <!-- VIEW MODE -->
      <div v-if="!isEditing">
        <label>Title</label>
        <input type="text" v-model="assignmentTitle" class="assignment-input" disabled />

        <label>Description</label>
        <textarea v-model="assignmentDescription" class="assignment-textarea" disabled></textarea>

        <p><strong>Due Date:</strong> {{ formattedDueDate }}</p>
        <p><strong>Allowed Files:</strong> {{ allowedFiles.join(', ') }}</p>
      </div>

      <!-- EDIT MODE -->
      <div v-else>
        <label>Title</label>
        <input type="text" v-model="assignmentTitle" class="assignment-input" />

        <label>Description</label>
        <textarea v-model="assignmentDescription" class="assignment-textarea"></textarea>

        <label>Due Date</label>
        <input type="date" v-model="assignmentDueDate" class="assignment-input" />

        <label for="allowed-files">Allowed File Types:</label>
        <select id="allowed-files" v-model="allowedFiles" multiple class="assignment-input">
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
          <option value="docx">DOCX</option>
          <option value="ppt">PPT</option>
          <option value="pptx">PPTX</option>
          <option value="txt">TXT</option>
          <option value="zip">ZIP</option>
        </select>
      </div>
    </div>

    <!-- STUDENTS & GRADES (only in view mode) -->
    <div v-if="!isEditing">
      <table class="students-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Status</th>
            <th>Student File</th>
            <th>Student Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.student_id">
            <td>{{ student.student_name }}</td>
            <td>
              <span
                class="upload-status"
                :class="{
                  'on-time': student.status === 'Submitted',
                  late: student.status === 'Late',
                  'not-submitted': student.status === 'Not Submitted'
                }"
              >
                {{ student.status }}
              </span>
            </td>
            <td>
              <div v-if="student.submissions.length">
                <ul>
                  <li v-for="file in student.submissions" :key="file.file_url">
                    <a :href="file.file_url" target="_blank">{{ file.file_name }}</a>
                  </li>
                </ul>
              </div>
              <span v-else>None</span>
            </td>
            <td>
              <input type="text" v-model="student.grade" class="grade-input" placeholder="-" />
            </td>
          </tr>
        </tbody>
      </table>

      <button class="finish-button" @click="saveGrades">Finish</button>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AssignmentViewProf',
  props: ['id'],
  data() {
    return {
      courseTitle: '',
      assignmentTitle: '',
      assignmentDescription: '',
      assignmentDueDate: '',
      allowedFiles: [],
      students: [],
      isEditing: false
    }
  },
  computed: {
    formattedDueDate() {
      if (!this.assignmentDueDate) return '—'
      const d = new Date(this.assignmentDueDate)
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }
  },
  methods: {
    async fetchAssignmentDetails() {
      const userId = localStorage.getItem('userId')
      if (!userId) throw new Error('User ID missing')

      const { data } = await axios.get(`/assignments/${this.id}`, {
        params: { userId }
      })

      this.courseTitle = data.courseTitle
      this.assignmentTitle = data.title
      this.assignmentDescription = data.description
      this.assignmentDueDate = data.due_date || ''
      this.allowedFiles = data.allowed_files || []

      this.students = data.students.map((s) => ({
        ...s,
        grade: s.grade == null ? '-' : s.grade,
        initialGrade: s.grade == null ? '-' : s.grade
      }))
    },

    enterEdit() {
      this._backup = {
        title: this.assignmentTitle,
        description: this.assignmentDescription,
        dueDate: this.assignmentDueDate,
        files: [...this.allowedFiles]
      }
      this.isEditing = true
    },

    cancelEdit() {
      this.assignmentTitle = this._backup.title
      this.assignmentDescription = this._backup.description
      this.assignmentDueDate = this._backup.dueDate
      this.allowedFiles = [...this._backup.files]
      this.isEditing = false
    },

    async saveMetadata() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) throw new Error('User ID missing')

        await axios.put(`/assignments/${this.id}`, {
          userId,
          title: this.assignmentTitle,
          description: this.assignmentDescription,
          dueDate: this.assignmentDueDate,
          allowedFiles: this.allowedFiles
        })

        this.isEditing = false
        alert('Assignment metadata saved!')
      } catch (err) {
        console.error(err)
        alert('Failed to save metadata.')
      }
    },

    async saveGrades() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) throw new Error('User ID missing')

        const grades = this.students
          .filter((s) => s.grade !== s.initialGrade)
          .map((s) => ({
            student_id: s.student_id,
            grade: s.grade === '-' ? null : s.grade
          }))

        if (!grades.length) {
          alert('No grade changes to save.')
          return
        }

        await axios.put(`/assignments/${this.id}/grades`, {
          grades,
          userId
        })

        alert('Grades saved!')
        this.fetchAssignmentDetails()
      } catch (err) {
        console.error(err)
        alert('Failed to save grades.')
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

.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.controls button {
  margin-left: 10px;
}

.assignment-details > * {
  margin-bottom: 20px;
}

.assignment-input,
.assignment-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.assignment-textarea {
  resize: none;
  height: 100px;
}

select.assignment-input {
  height: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.students-table th,
.students-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.upload-status {
  padding: 5px 10px;
  border-radius: 5px;
}

.upload-status.on-time {
  background-color: #28a745;
  color: white;
}

.upload-status.late {
  background-color: #dc3545;
  color: white;
}

.upload-status.not-submitted {
  background-color: #ffc107; /* Yellow color */
  color: black; /* Black text color */
}

.grade-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.finish-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.finish-button:hover {
  background-color: #0056b3;
}

/* Dark Mode */
body.dark-mode .assignment-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode .assignment-input,
body.dark-mode .assignment-textarea,
body.dark-mode .grade-input,
body.dark-mode select.assignment-input {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .students-table th,
body.dark-mode .students-table td {
  border-color: #555;
}

body.dark-mode .upload-status.on-time {
  background-color: #28a745;
}

body.dark-mode .upload-status.late {
  background-color: #dc3545;
}

body.dark-mode .finish-button {
  background-color: #0056b3;
}

body.dark-mode .finish-button:hover {
  background-color: #003f8a;
}
</style>
