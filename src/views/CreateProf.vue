<template>
  <div class="create-prof-container">
    <h1>Create New Item</h1>

    <!-- Type Selector -->
    <div class="selector-container">
      <label for="item-type">Select Type</label>
      <select v-model="selectedType" id="item-type" @change="resetForm">
        <option value="">Select Type</option>
        <option value="lesson">Lesson</option>
        <option value="quiz">Quiz</option>
        <option value="meeting">Meeting</option>
        <option value="assignment">Assignment</option>
      </select>
    </div>

    <!-- Lesson Form -->
    <div v-if="selectedType === 'lesson'" class="form-container">
      <h2>Create Lesson</h2>
      <input type="text" v-model="form.lessonTitle" placeholder="Lesson Title" />
      <textarea v-model="form.lessonDescription" placeholder="Lesson Description"></textarea>
      <div class="upload-container">
        <label for="lesson-files">Upload Lesson Files</label>
        <input type="file" id="lesson-files" multiple @change="handleFileUpload" />
      </div>
      <button class="submit-button" @click="submitLesson">Save Lesson</button>
    </div>

    <!-- Quiz Form -->
    <div v-if="selectedType === 'quiz'" class="form-container">
      <h2>Create Quiz</h2>
      <input type="text" v-model="form.quizTitle" placeholder="Quiz Title" required />
      <input
        type="number"
        v-model="form.quizTimer"
        placeholder="Quiz Timer (in minutes)"
        required
      />
      <textarea v-model="form.quizDescription" placeholder="Enter Quiz Description"></textarea>

      <h3>Questions:</h3>
      <div v-for="(question, qIndex) in form.quizQuestions" :key="qIndex" class="quiz-question">
        <div>
          <span>Q{{ qIndex + 1 }}:</span>
          <input type="text" v-model="question.text" placeholder="Question Text" required />
        </div>
        <h4>Answers:</h4>
        <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-option">
          <input type="checkbox" v-model="question.correctAnswers" :value="aIndex" />
          <input
            type="text"
            v-model="question.answers[aIndex]"
            placeholder="Answer Text"
            required
          />
        </div>
        <button @click="addAnswer(qIndex)">Add Answer</button>
        <button @click="removeQuestion(qIndex)">Remove Question</button>
      </div>
      <button @click="addQuestion">Add Question</button>
      <button @click="submitQuiz">Save Quiz</button>
    </div>

    <!-- Meeting Form -->
    <div v-if="selectedType === 'meeting'" class="form-container">
      <h2>Create Meeting</h2>
      <input type="text" v-model="form.meetingTitle" placeholder="Meeting Title" required />
      <textarea v-model="form.meetingDescription" placeholder="Meeting Description"></textarea>
      <input type="text" v-model="form.meetingLink" placeholder="Enter Meeting Link" required />
      <button class="submit-button" @click="submitMeeting">Save Meeting</button>
    </div>

    <!-- Assignment Form -->
    <div v-if="selectedType === 'assignment'" class="form-container">
      <h2>Create Assignment</h2>
      <input type="text" v-model="form.assignmentTitle" placeholder="Assignment Title" required />
      <textarea
        v-model="form.assignmentDescription"
        placeholder="Assignment Description"
      ></textarea>

      <!-- Replace text input with a multi-select dropdown -->
      <label for="allowed-files">Allowed File Types:</label>
      <select id="allowed-files" v-model="form.allowedFiles" multiple>
        <option value="pdf">PDF</option>
        <option value="doc">DOC</option>
        <option value="docx">DOCX</option>
        <option value="ppt">PPT</option>
        <option value="pptx">PPTX</option>
        <option value="txt">TXT</option>
        <option value="zip">ZIP</option>
      </select>

      <input type="date" v-model="form.dueDate" placeholder="Due Date" required />
      <button class="submit-button" @click="submitAssignment">Save Assignment</button>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'CreateProf',
  props: {
    courseId: {
      type: String,
      required: false // Allow it to be missing from props and fallback to route params
    }
  },
  data() {
    return {
      selectedType: '',
      isSubmitting: false,
      form: {
        lessonTitle: '',
        lessonDescription: '',
        lessonFiles: [],
        quizTitle: '',
        quizTimer: '',
        quizDescription: '',
        quizQuestions: [
          {
            text: '',
            answers: ['', '', '', ''],
            correctAnswers: []
          }
        ],
        meetingTitle: '',
        meetingDescription: '',
        meetingLink: '', // New property for meeting
        assignmentTitle: '',
        assignmentDescription: '',
        allowedFiles: [],
        dueDate: ''
      }
    }
  },
  computed: {
    resolvedCourseId() {
      return this.courseId || this.$route.params.id // Fallback to route params
    }
  },
  methods: {
    resetForm() {
      this.form = {
        lessonTitle: '',
        lessonDescription: '',
        lessonFiles: [],
        quizTitle: '',
        quizTimer: '',
        quizDescription: '',
        quizQuestions: [{ text: '', answers: ['', '', '', ''], correctAnswers: [] }],
        meetingTitle: '',
        meetingDescription: '',
        meetingLink: '',
        assignmentTitle: '',
        assignmentDescription: '',
        allowedFiles: [],
        dueDate: ''
      }
    },
    handleFileUpload(event) {
      this.form.lessonFiles = Array.from(event.target.files)
    },
    async submitLesson() {
      if (!this.form.lessonTitle) {
        alert('Lesson title is required.')
        return
      }

      const courseId = this.resolvedCourseId
      if (!courseId) {
        alert('Course ID is missing.')
        return
      }

      this.isSubmitting = true
      try {
        const formData = new FormData()
        formData.append('title', this.form.lessonTitle)
        formData.append('description', this.form.lessonDescription)
        formData.append('course_id', courseId)
        if (this.form.lessonFiles.length > 0) {
          formData.append('lessonFile', this.form.lessonFiles[0])
        }

        await axios.post('/lessons', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('Lesson created successfully!')
        this.$router.push(`/viewp/${courseId}`)
      } catch (error) {
        console.error('Error creating lesson:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to create lesson.')
      } finally {
        this.isSubmitting = false
      }
    },
    addQuestion() {
      this.form.quizQuestions.push({
        text: '',
        answers: ['', '', '', ''],
        correctAnswers: []
      })
    },
    addAnswer(questionIndex) {
      this.form.quizQuestions[questionIndex].answers.push('')
    },
    async submitQuiz() {
      const courseId = this.resolvedCourseId
      if (!courseId) {
        alert('Course ID is missing.')
        return
      }

      if (!this.form.quizTitle || this.form.quizQuestions.length === 0) {
        alert('Quiz title and at least one question are required.')
        return
      }

      this.isSubmitting = true
      try {
        const payload = {
          title: this.form.quizTitle,
          description: this.form.quizDescription,
          timer: this.form.quizTimer,
          questions: this.form.quizQuestions,
          course_id: courseId
        }
        console.log('Submitting quiz payload:', payload)
        await axios.post('/quizzes', payload)
        alert('Quiz created successfully!')
        this.$router.push(`/viewp/${courseId}`)
      } catch (error) {
        console.error('Error creating quiz:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to create quiz.')
      } finally {
        this.isSubmitting = false
      }
    },
    async submitMeeting() {
      const courseId = this.courseId || this.$route.params.id
      if (!this.form.meetingTitle || !this.form.meetingLink) {
        alert('Meeting title and link are required.')
        return
      }

      this.isSubmitting = true
      try {
        const payload = {
          title: this.form.meetingTitle,
          description: this.form.meetingDescription,
          meeting_link: this.form.meetingLink,
          course_id: courseId
        }
        await axios.post('/meetings', payload)
        alert('Meeting created successfully!')
        this.$router.push(`/viewp/${courseId}`)
      } catch (error) {
        console.error('Error creating meeting:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to create meeting.')
      } finally {
        this.isSubmitting = false
      }
    },
    async submitAssignment() {
      if (!this.form.assignmentTitle || !this.form.dueDate) {
        alert('Assignment title and due date are required.')
        return
      }

      const courseId = this.resolvedCourseId
      if (!courseId) {
        alert('Course ID is missing.')
        return
      }

      this.isSubmitting = true
      try {
        const payload = {
          title: this.form.assignmentTitle,
          description: this.form.assignmentDescription,
          allowed_files: this.form.allowedFiles, // sending as an array
          due_date: this.form.dueDate,
          course_id: courseId
        }

        await axios.post('/assignments', payload)
        alert('Assignment created successfully!')
        this.$router.push(`/viewp/${courseId}`)
      } catch (error) {
        console.error('Error creating assignment:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to create assignment.')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.create-prof-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff; /* Set the background to pure white for better visibility */
  border-radius: 8px;
  border: 1px solid #ddd; /* Light border to distinguish the container */
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1); /* Enhanced shadows */
}

h1,
h2 {
  text-align: center;
}

.selector-container {
  margin-bottom: 20px;
}

input,
textarea {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.quiz-question {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #fff;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}

.remove-question {
  background-color: #dc3545;
  color: white;
}

.submit-button {
  background-color: green;
  color: white;
}

/* Dark mode styles */
body.dark-mode .create-prof-container {
  background-color: #333;
  color: #f0f0f0;
  border: 1px solid #1e1d1d;
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3); /* Enhanced shadows for dark mode */
}

body.dark-mode input,
body.dark-mode textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode button {
  background-color: #0056b3;
}

body.dark-mode button:hover {
  background-color: #003f8a;
}

body.dark-mode .quiz-question {
  background-color: #444;
  border: 1px solid #555;
}

body.dark-mode .remove-question {
  background-color: #dc3545;
}

body.dark-mode .submit-button {
  background-color: #28a745;
}
</style>
