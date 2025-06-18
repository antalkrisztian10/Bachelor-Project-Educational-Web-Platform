<template>
  <div class="quiz-view-container">
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Quiz Title and Description -->
    <div class="quiz-info">
      <h2>Quiz Title</h2>
      <input type="text" v-model="quizTitle" class="quiz-title-input" />

      <h2>Quiz Description</h2>
      <textarea v-model="quizDescription" class="quiz-description-textarea"></textarea>
    </div>

    <!-- Quiz Questions -->
    <div class="questions-container">
      <h2>Questions</h2>
      <div v-for="(question, index) in questions" :key="index" class="question-card">
        <h3>Q{{ index + 1 }}: {{ question.text }}</h3>
        <div class="answers">
          <div
            v-for="(option, idx) in question.options"
            :key="idx"
            class="answer-option"
            :class="{ 'correct-answer': question.correctAnswer.includes(idx) }"
          >
            <span>{{ option }}</span>
            <span v-if="question.correctAnswer.includes(idx)" class="correct-icon">✔</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Student Grades -->
    <div class="grades-container">
      <h2>Student Grades</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Correct Answers</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in studentGrades" :key="index">
            <td>{{ student.name }}</td>
            <td>{{ student.correctAnswers }}</td>
            <td>
              <input type="number" v-model="student.grade" class="grade-input" min="0" max="10" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="finish-button" @click="saveAll">Finish</button>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'QuizViewProf',
  props: ['id'],
  data() {
    return {
      courseTitle: '',
      quizTitle: '',
      quizDescription: '',
      questions: [],
      studentGrades: [],
      errorMessage: ''
    }
  },
  methods: {
    async fetchQuizDetails() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) throw new Error('User ID is missing')

        const response = await axios.get(`/quizzes/${this.id}`, {
          params: { userId }
        })

        const { quiz, questions, studentGrades } = response.data

        this.courseTitle = quiz.course_title
        this.quizTitle = quiz.title
        this.quizDescription = quiz.description

        this.questions = questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))

        this.studentGrades = studentGrades.map((s) => ({
          name: s.name,
          correctAnswers: s.correctAnswers || 0,
          grade: s.grade
        }))
      } catch (error) {
        console.error('Error fetching quiz details:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to load quiz details.')
        this.$router.push('/home')
      }
    },
    async saveAll() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) throw new Error('User ID is missing')

        // 1) update title & description
        await axios.put(`/quizzes/${this.id}`, {
          userId,
          title: this.quizTitle,
          description: this.quizDescription
        })

        // 2) save grades
        await axios.post(`/quizzes/${this.id}/update`, {
          userId,
          grades: this.studentGrades
        })

        alert('Quiz info and grades saved successfully!')
      } catch (error) {
        console.error('Error saving quiz or grades:', error.response?.data || error.message)
        alert('Failed to save. Please try again.')
      }
    }
  },
  mounted() {
    this.fetchQuizDetails()
  }
}
</script>

<style scoped>
.quiz-view-container {
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

.quiz-info {
  margin-bottom: 20px;
}

.quiz-title-input,
.quiz-description-textarea {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.quiz-description-textarea {
  resize: none;
  height: 100px;
}

.questions-container {
  margin-top: 20px;
}

.question-card {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.answer-option {
  display: flex;
  align-items: center;
}

.correct-icon {
  margin-left: 10px;
  color: green;
  font-weight: bold;
}

.grades-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

thead th {
  background-color: #007bff;
  color: white;
  text-align: left;
  padding: 10px;
}

tbody td {
  padding: 10px;
  border: 1px solid #ddd;
}

.grade-input {
  width: 60px;
  padding: 5px;
}

.finish-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.finish-button:hover {
  background-color: #218838;
}

/* Dark Mode */
body.dark-mode .quiz-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

body.dark-mode .quiz-title-input,
body.dark-mode .quiz-description-textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .question-card {
  background-color: #444;
  border: 1px solid #555;
}

body.dark-mode .correct-icon {
  color: #00ff00;
}

body.dark-mode thead th {
  background-color: #0056b3;
}

body.dark-mode .finish-button {
  background-color: #28a745;
}
</style>
