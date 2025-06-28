<template>
  <div class="quiz-view-container">
    <!-- Timer -->
    <div v-if="quizStarted && !quizFinished" class="quiz-timer">Time Left: {{ formattedTime }}</div>

    <!-- Intro Screen (only if quiz not started or finished) -->
    <div v-if="!quizStarted && !quizFinished && !quizFinishedPreviously" class="quiz-intro">
      <h1>{{ courseTitle }}</h1>
      <h2>{{ quizTitle }}</h2>
      <p>Max Duration: {{ maxDuration }} minutes</p>
      <button class="start-button" @click="startQuiz">Start Quiz</button>
    </div>

    <!-- Quiz Questions -->
    <div v-if="quizStarted && !quizFinished" class="quiz-questions">
      <h1>{{ courseTitle }}</h1>
      <h2>{{ quizTitle }}</h2>
      <div class="question-navigation">
        <p>Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}</p>
      </div>
      <div class="question-container">
        <h3>{{ currentQuestion.text }}</h3>
        <div class="answers">
          <label
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="answer-option"
          >
            <input type="radio" :value="index" v-model="selectedAnswer" />
            {{ option }}
          </label>
        </div>
        <button class="next-button" :disabled="selectedAnswer === null" @click="nextQuestion">
          {{ currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Results Screen -->
    <div v-if="quizFinished || quizFinishedPreviously" class="quiz-results">
      <h1>{{ courseTitle }}</h1>
      <h2>{{ quizTitle }} Results</h2>
      <p>Your Score: {{ grade }} / 10</p>
      <h3>Correct Answers: {{ correctAnswersCount }} / {{ totalQuestions }}</h3>
      <div class="results-container">
        <div v-for="(question, index) in questions" :key="index" class="result-question">
          <h3>Question {{ index + 1 }}</h3>
          <p>{{ question.text }}</p>
          <ul>
            <li
              v-for="(option, idx) in question.options"
              :key="idx"
              :class="{
                correct: question.correct_answer?.includes(idx),
                selected: userAnswers[index] === idx,
                wrong: userAnswers[index] === idx && !question.correct_answer?.includes(idx)
              }"
            >
              {{ option }}
              <span v-if="question.correct_answer?.includes(idx)">✖</span>
              <span
                v-else-if="userAnswers[index] === idx && !question.correct_answer?.includes(idx)"
                >✔</span
              >
            </li>
          </ul>
        </div>
      </div>
      <button class="finish-button" @click="goToCourse">Finish</button>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'QuizView',
  data() {
    return {
      courseTitle: '',
      quizTitle: '',
      courseId: null,
      maxDuration: 0,
      totalQuestions: 0,

      // Quiz state
      quizStarted: false,
      quizFinished: false,
      quizFinishedPreviously: false,

      // Questions & Answers
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      userAnswers: [],

      // Timer
      timeLeft: 0,
      timerInterval: null,
      quizStartTime: null, // NEW: absolute start timestamp (ms)

      // Results
      correctAnswersCount: 0,
      grade: null
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60)
      const seconds = this.timeLeft % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  },
  methods: {
    async fetchQuizDetails() {
      const quizId = this.$route.params.id
      const userId = localStorage.getItem('userId')

      try {
        const response = await axios.get(`/quizzes/${quizId}/student`, {
          params: { userId }
        })

        const { quiz, questions, alreadyAttempted, grade, correctAnswersCount, totalQuestions } =
          response.data

        this.quizTitle = quiz.title || 'Untitled Quiz'
        this.courseTitle = quiz.course_title || 'Untitled Course'
        this.maxDuration = quiz.max_duration || 0
        this.totalQuestions = totalQuestions || 0
        this.courseId = quiz.course_id

        // Prepare questions
        this.questions = Array.isArray(questions)
          ? questions.map((q) => ({
              ...q,
              correct_answer: Array.isArray(q.correct_answer) ? q.correct_answer : []
            }))
          : []

        // If student already attempted, show results immediately
        if (alreadyAttempted) {
          this.quizFinished = true
          this.quizFinishedPreviously = true
          this.grade = grade || 0
          this.correctAnswersCount = correctAnswersCount || 0
        } else {
          // If not attempted, try to load any local quiz state
          this.loadQuizState()
        }
      } catch (error) {
        console.error('Error fetching quiz details:', error)
        if (error.response?.status === 403) {
          alert('Access denied: You are not enrolled in this course.')
          this.$router.push('/home')
        } else {
          alert('Failed to load quiz details. Please try again.')
        }
      }
    },
    // ===== QUIZ FLOW METHODS =====
    startQuiz() {
      this.quizStarted = true

      // If we don't yet have a timestamp, set it
      if (!this.quizStartTime) {
        this.quizStartTime = Date.now()
      }

      // Recalculate remaining time based on absolute start time
      this.timeLeft = this.maxDuration * 60 - Math.floor((Date.now() - this.quizStartTime) / 1000)

      if (this.timeLeft <= 0) {
        this.finishQuiz()
        return
      }

      this.startTimer()
      this.saveQuizState()
    },
    nextQuestion() {
      // Record the answer for the current question
      this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer

      // Reset selected answer
      this.selectedAnswer = null

      // If it's the last question, finish the quiz
      if (this.currentQuestionIndex === this.questions.length - 1) {
        this.finishQuiz()
      } else {
        this.currentQuestionIndex++
        this.saveQuizState()
      }
    },
    async finishQuiz() {
      clearInterval(this.timerInterval)
      this.quizStarted = false
      this.quizFinished = true

      // Save final state before submission
      this.saveQuizState()

      // Submit user answers to the server
      try {
        const response = await axios.post(`/quizzes/${this.$route.params.id}/student/submit`, {
          userId: localStorage.getItem('userId'),
          userAnswers: this.userAnswers
        })

        // Update results
        this.grade = response.data.grade
        this.correctAnswersCount = response.data.correctAnswersCount
      } catch (error) {
        console.error('Error submitting quiz:', error)
        alert('Failed to submit the quiz.')
      } finally {
        // Clear local storage quiz state once fully submitted
        this.clearQuizState()
      }
    },

    // ===== TIMER METHODS =====
    startTimer() {
      // Stop any existing timer to avoid duplication
      clearInterval(this.timerInterval)

      this.timerInterval = setInterval(() => {
        // Recalculate remaining time each tick using absolute time ─ robust against tab sleeps
        this.timeLeft = this.maxDuration * 60 - Math.floor((Date.now() - this.quizStartTime) / 1000)

        if (this.timeLeft <= 0) {
          this.finishQuiz()
        }

        this.saveQuizState() // Persist every tick
      }, 1000)
    },

    // ===== NAVIGATION =====
    goToCourse() {
      if (this.courseId) {
        this.$router.push(`/view/${this.courseId}`)
      } else {
        alert('Course information is not available.')
      }
    },

    // ===== LOCAL STORAGE =====
    loadQuizState() {
      const key = `quiz_state_${this.$route.params.id}_${localStorage.getItem('userId')}`
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)

        this.quizStartTime = parsed.quizStartTime || null

        // Only restore state if quiz isn't already finished
        if (!parsed.quizFinished) {
          this.quizStarted = parsed.quizStarted
          this.quizFinished = parsed.quizFinished
          this.currentQuestionIndex = parsed.currentQuestionIndex
          this.userAnswers = parsed.userAnswers || []

          // If we have a timestamp, recalc remaining time
          if (this.quizStartTime) {
            const elapsed = Math.floor((Date.now() - this.quizStartTime) / 1000)
            this.timeLeft = Math.max(this.maxDuration * 60 - elapsed, 0)
          } else {
            this.timeLeft = parsed.timeLeft || 0
          }

          if (this.timeLeft <= 0) {
            this.finishQuiz()
            return
          }

          // If the quiz was in progress, resume the timer
          if (this.quizStarted && !this.quizFinished) {
            this.startTimer()
          }
        }
      }
    },
    saveQuizState() {
      const key = `quiz_state_${this.$route.params.id}_${localStorage.getItem('userId')}`
      const state = {
        quizStarted: this.quizStarted,
        quizFinished: this.quizFinished,
        currentQuestionIndex: this.currentQuestionIndex,
        userAnswers: this.userAnswers,
        timeLeft: this.timeLeft,
        quizStartTime: this.quizStartTime // NEW: persist timestamp
      }
      localStorage.setItem(key, JSON.stringify(state))
    },
    clearQuizState() {
      const key = `quiz_state_${this.$route.params.id}_${localStorage.getItem('userId')}`
      localStorage.removeItem(key)
    }
  },
  mounted() {
    this.fetchQuizDetails()
  },
  beforeUnmount() {
    // Clean up timer and save state
    clearInterval(this.timerInterval)
    this.saveQuizState()
  }
}
</script>

<style scoped>
.quiz-view-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  position: relative;
}

/* Titles */
h1 {
  font-size: 1.8em;
  color: #333;
}

h2 {
  font-size: 1.5em;
  color: #555;
}

.quiz-intro p {
  font-size: 1.2em;
  color: #666;
}

/* Buttons */
.start-button,
.next-button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover,
.next-button:hover {
  background-color: #0056b3;
}

.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Quiz Questions */
.question-container {
  margin: 20px 0;
  text-align: left;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.answers {
  margin-top: 15px;
}

.answer-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.answer-option input {
  margin-right: 10px;
}

/* Results View */
.results-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.result-question {
  flex: 1 1 calc(100% - 40px); /* Full-width on small screens */
  max-width: 300px; /* Limit width on larger screens */
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.correct {
  color: red;
  font-weight: bold;
}

.wrong {
  color: green;
  font-weight: bold;
}

.selected {
  text-decoration: underline;
}

.quiz-timer {
  position: absolute; /* Ensure it's always positioned relative to the container */
  top: 20px;
  right: 20px;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  color: #007bff;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Adjust for smaller screens */
@media (max-width: 768px) {
  .quiz-timer {
    position: relative; /* Make it part of the normal flow for small screens */
    margin: 10px auto;
    text-align: center; /* Center-align for better presentation */
    top: auto;
    right: auto;
  }

  .result-question {
    max-width: 100%; /* Full width */
  }
}

/* Dark Mode */
body.dark-mode .quiz-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

body.dark-mode h1,
body.dark-mode h2 {
  color: #f0f0f0;
}

body.dark-mode .quiz-intro p {
  color: #ccc;
}

body.dark-mode .start-button,
body.dark-mode .next-button {
  background-color: #0056b3;
  color: white;
}

body.dark-mode .start-button:hover,
body.dark-mode .next-button:hover {
  background-color: #003f8a;
}

body.dark-mode .next-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

body.dark-mode .question-container {
  background-color: #444;
  border: 2px solid #555;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode .answers {
  color: #ccc;
}

body.dark-mode .answer-option {
  color: #f0f0f0;
}

body.dark-mode .answer-option input {
  accent-color: #007bff;
}

body.dark-mode .results-container .result-question {
  background-color: #444;
  border: 2px solid #555;
  color: #f0f0f0;
}

body.dark-mode .quiz-timer {
  background-color: #555;
  color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.finish-button {
  background: linear-gradient(90deg, #28a745, #218838);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  margin-top: 20px;
}

.finish-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.finish-button:active {
  transform: scale(0.98);
}
</style>
