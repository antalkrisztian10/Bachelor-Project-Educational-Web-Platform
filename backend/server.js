import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import pool from './db/database.js'
import bcrypt from 'bcrypt'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { OpenAI } from 'openai' // New import style for v4.x.x

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Initialize OpenAI client with the new v4.x.x syntax:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadFolder = path.join(__dirname, 'uploads', 'assignments')
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
}

// Ensure "uploads" folder exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve the "uploads" folder under /backend/uploads
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')))

// Chat endpoint that uses OpenAI's API
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message
  try {
    // Call the chat completion endpoint with the new syntax:
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or another model if you prefer
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 100, // Limit response length to save tokens
      temperature: 0.7 // Control creativity; lower is more deterministic
    })

    const botReply = completion.choices[0].message.content.trim()
    res.json({ reply: botReply })
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    res.status(500).json({ reply: 'Sorry, something went wrong.' })
  }
})

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running!')
})

// Example route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { fullName, username, email, password, role } = req.body

  if (!fullName || !username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [
      username,
      email
    ])

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let queryText, values

    if (role.toLowerCase() === 'student') {
      queryText =
        'INSERT INTO users (full_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id'
      values = [fullName, username, email, hashedPassword, role]
    } else {
      queryText =
        'INSERT INTO requests (full_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id'
      values = [fullName, username, email, hashedPassword, role]
    }

    const result = await pool.query(queryText, values)
    const message =
      role.toLowerCase() === 'student'
        ? 'User registered successfully'
        : 'Request submitted for admin approval'

    res.status(201).json({ message, userId: result.rows[0].id })
  } catch (err) {
    console.error('Error during registration:', err)
    res.status(500).json({ message: 'Error registering user' })
  }
})

// Get all pending role requests
app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests')
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching requests:', err)
    res.status(500).send('Server error')
  }
})

// Approve a request (move from requests → users)
app.post('/api/requests/approve/:id', async (req, res) => {
  const requestId = req.params.id

  try {
    const request = await pool.query('SELECT * FROM requests WHERE id = $1', [requestId])
    if (request.rows.length === 0) {
      return res.status(404).send('Request not found')
    }

    const { full_name, username, email, password, role } = request.rows[0]

    await pool.query(
      'INSERT INTO users (full_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [full_name, username, email, password, role]
    )

    await pool.query('DELETE FROM requests WHERE id = $1', [requestId])

    res.status(200).send('Request approved and user added')
  } catch (err) {
    console.error('Error approving request:', err)
    res.status(500).send('Server error')
  }
})

// Decline a request (delete from requests)
app.delete('/api/requests/decline/:id', async (req, res) => {
  const requestId = req.params.id

  try {
    const result = await pool.query('DELETE FROM requests WHERE id = $1', [requestId])
    if (result.rowCount === 0) {
      return res.status(404).send('Request not found')
    }

    res.status(200).send('Request declined and removed')
  } catch (err) {
    console.error('Error declining request:', err)
    res.status(500).send('Server error')
  }
})

// Route to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const userRole = user.rows[0].role
    const token = 'dummy-token'

    res.status(200).json({
      message: 'Login successful',
      role: userRole,
      userId: user.rows[0].id,
      token
    })
  } catch (err) {
    console.error('Error during login:', err)
    res.status(500).json({ message: 'Error logging in' })
  }
})

// Route to create a course
app.post('/create_course', async (req, res) => {
  const { title, password, color, description, creator_id } = req.body

  if (!title || !creator_id) {
    return res.status(400).json({ message: 'Course title and creator ID are required' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO courses (title, password, color, description, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, password, color, description, creator_id]
    )

    res.status(201).json({ message: 'Course created successfully', course: result.rows[0] })
  } catch (err) {
    console.error('Error creating course:', err)
    res.status(500).json({ message: 'Error creating course' })
  }
})

// Route to fetch courses created by a professor
app.get('/courses', async (req, res) => {
  const { creatorId } = req.query

  if (!creatorId) {
    return res.status(400).json({ message: 'Creator ID is required' })
  }

  try {
    const result = await pool.query('SELECT * FROM courses WHERE creator_id = $1', [creatorId])
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching courses:', err)
    res.status(500).json({ message: 'Error fetching courses' })
  }
})

// Route to join a course
app.post('/join_course', async (req, res) => {
  const { course_id, password, user_id } = req.body

  if (!course_id || !password || !user_id) {
    return res.status(400).json({ message: 'Course ID, password, and user ID are required' })
  }

  try {
    const course = await pool.query('SELECT * FROM courses WHERE id = $1', [course_id])

    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    if (course.rows[0].password !== password) {
      return res.status(401).json({ message: 'Invalid course password' })
    }

    const participant = await pool.query(
      'SELECT * FROM participants WHERE course_id = $1 AND user_id = $2',
      [course_id, user_id]
    )

    if (participant.rows.length > 0) {
      return res.status(400).json({ message: 'You are already enrolled in this course' })
    }

    await pool.query('INSERT INTO participants (course_id, user_id) VALUES ($1, $2)', [
      course_id,
      user_id
    ])

    res.status(200).json({ message: 'Successfully joined the course' })
  } catch (err) {
    console.error('Error joining course:', err)
    res.status(500).json({ message: 'Error joining course' })
  }
})

// Route to fetch courses a student has joined
app.get('/student_courses', async (req, res) => {
  const { user_id } = req.query

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.color 
       FROM participants p 
       JOIN courses c ON p.course_id = c.id 
       WHERE p.user_id = $1`,
      [user_id]
    )

    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching student courses:', err)
    res.status(500).json({ message: 'Error fetching student courses' })
  }
})

app.get('/course/:id', async (req, res) => {
  const courseId = req.params.id
  const userId = req.query.userId // Assume userId is passed as a query parameter

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Fetch course details
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId])
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }
    const course = courseResult.rows[0]

    // Check if the user is the creator of the course
    if (course.creator_id !== parseInt(userId)) {
      return res.status(403).json({ message: 'You are not authorized to view this course' })
    }

    // Fetch enrolled students
    const studentsResult = await pool.query(
      `
      SELECT u.id, u.full_name AS name, u.email
      FROM participants p
      JOIN users u ON p.user_id = u.id
      WHERE p.course_id = $1
      `,
      [courseId]
    )

    // Fetch course items (lessons, quizzes, assignments, meetings)
    const itemsResult = await pool.query(
      `
      SELECT l.id, 'lesson' AS type, l.title, l.description, l.created_at
      FROM lessons l
      WHERE l.course_id = $1

      UNION ALL

      SELECT q.id, 'quiz' AS type, q.title, q.description, q.created_at
      FROM quizzes q
      WHERE q.course_id = $1

      UNION ALL

      SELECT a.id, 'assignment' AS type, a.title, a.description, a.created_at
      FROM assignments a
      WHERE a.course_id = $1

      UNION ALL

      SELECT m.id, 'meeting' AS type, m.title, NULL AS description, NULL AS created_at
      FROM meetings m
      WHERE m.course_id = $1

      ORDER BY created_at
      `,
      [courseId]
    )

    res.status(200).json({
      course,
      students: studentsResult.rows,
      items: itemsResult.rows
    })
  } catch (err) {
    console.error('Error fetching course details:', err)
    res.status(500).json({ message: 'Error fetching course details' })
  }
})

app.delete('/course/:id/items', async (req, res) => {
  const courseId = req.params.id
  const { items } = req.body

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid items list' })
  }

  console.log('Received items to delete:', items)
  console.log('Course ID from URL:', courseId)

  const grouped = {
    lessons: [],
    quizzes: [],
    assignments: [],
    meetings: []
  }

  const mapTypes = {
    lesson: 'lessons',
    quiz: 'quizzes',
    assignment: 'assignments',
    meeting: 'meetings'
  }

  for (const item of items) {
    const key = mapTypes[item.type]
    if (key && grouped[key]) {
      grouped[key].push(item.id)
    }
  }

  try {
    if (grouped.lessons.length > 0) {
      await pool.query(`DELETE FROM lessons WHERE id = ANY($1) AND course_id = $2`, [
        grouped.lessons,
        courseId
      ])
    }

    if (grouped.quizzes.length > 0) {
      await pool.query(`DELETE FROM quizzes WHERE id = ANY($1) AND course_id = $2`, [
        grouped.quizzes,
        courseId
      ])
    }

    if (grouped.assignments.length > 0) {
      await pool.query(`DELETE FROM assignments WHERE id = ANY($1) AND course_id = $2`, [
        grouped.assignments,
        courseId
      ])
    }

    if (grouped.meetings.length > 0) {
      await pool.query(`DELETE FROM meetings WHERE id = ANY($1) AND course_id = $2`, [
        grouped.meetings,
        courseId
      ])
    }

    res.status(200).json({ message: 'Items deleted successfully' })
  } catch (err) {
    console.error('Error deleting course items:', err)
    res.status(500).json({ message: 'Error deleting course items' })
  }
})

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This will physically save files into "<project>/backend/uploads"
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })

// Route to create a lesson with file upload
app.post('/lessons', upload.single('lessonFile'), async (req, res) => {
  const { title, description, course_id } = req.body

  if (!title || !course_id) {
    return res.status(400).json({ message: 'Lesson title and course ID are required' })
  }

  try {
    // If a file was uploaded, store the URL as /backend/uploads/<originalname>
    let fileUrl = null
    if (req.file) {
      fileUrl = `/backend/uploads/${req.file.originalname}`
    }

    const result = await pool.query(
      'INSERT INTO lessons (course_id, title, description, file_url, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [course_id, title, description, fileUrl]
    )

    res.status(201).json({ message: 'Lesson created successfully', lesson: result.rows[0] })
  } catch (error) {
    console.error('Error creating lesson:', error)
    res.status(500).json({ message: 'Error creating lesson' })
  }
})

app.post('/quizzes', async (req, res) => {
  const { title, description, timer, course_id, questions } = req.body

  if (!title || !course_id || !questions || questions.length === 0) {
    return res.status(400).json({
      message: 'Quiz title, course ID, and at least one question are required'
    })
  }

  try {
    // Check if the course exists
    const courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1', [course_id])
    if (courseCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    // Insert the quiz into the `quizzes` table
    const quizResult = await pool.query(
      'INSERT INTO quizzes (title, description, timer, created_at, course_id) VALUES ($1, $2, $3, NOW(), $4) RETURNING id',
      [title, description, timer, course_id]
    )

    const quizId = quizResult.rows[0].id

    // Insert questions into the `quiz_questions` table
    const questionPromises = questions.map((question) =>
      pool.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer) VALUES ($1, $2, $3, $4)',
        [
          quizId,
          question.text,
          JSON.stringify(question.answers), // Store answers as JSON
          JSON.stringify(question.correctAnswers) // Store correct answer indices as JSON
        ]
      )
    )

    await Promise.all(questionPromises)

    res.status(201).json({ message: 'Quiz created successfully' })
  } catch (err) {
    console.error('Error creating quiz:', err.message || err)
    res.status(500).json({ message: 'Error creating quiz' })
  }
})

app.post('/meetings', async (req, res) => {
  const { title, description, meeting_link, course_id } = req.body

  if (!title || !meeting_link || !course_id) {
    return res.status(400).json({
      message: 'Meeting title, link, and course ID are required.'
    })
  }

  try {
    const result = await pool.query(
      `INSERT INTO meetings (course_id, title, meeting_link, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [course_id, title, meeting_link, description]
    )
    res.status(201).json({
      message: 'Meeting created successfully',
      meeting: result.rows[0]
    })
  } catch (err) {
    console.error('Error creating meeting:', err)
    res.status(500).json({ message: 'Error creating meeting' })
  }
})

app.post('/assignments', async (req, res) => {
  const { title, description, allowed_files, due_date, course_id } = req.body

  // Validation
  if (!title || !course_id || !due_date) {
    return res.status(400).json({
      message: 'Assignment title, course ID, and due date are required.'
    })
  }

  try {
    // Insert the assignment into the database
    const result = await pool.query(
      'INSERT INTO assignments (course_id, title, description, allowed_files, due_date, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [course_id, title, description, allowed_files, due_date]
    )

    res.status(201).json({
      message: 'Assignment created successfully!',
      assignment: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating assignment:', error)
    res.status(500).json({
      message: 'Error creating assignment.'
    })
  }
})

app.get('/lessons/:id', async (req, res) => {
  const { userId } = req.query // Ensure userId is sent from the frontend
  const lessonId = req.params.id

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Check if the user is the creator of the course associated with the lesson
    const courseResult = await pool.query(
      `SELECT c.creator_id 
       FROM lessons l
       JOIN courses c ON l.course_id = c.id
       WHERE l.id = $1`,
      [lessonId]
    )

    if (courseResult.rows.length === 0 || courseResult.rows[0].creator_id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied: You do not own this lesson' })
    }

    // Fetch lesson details
    const lessonResult = await pool.query(
      'SELECT id, title, description, file_url, course_id FROM lessons WHERE id = $1',
      [lessonId]
    )

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    const lesson = lessonResult.rows[0]
    const uploadedFiles = lesson.file_url
      ? [{ name: lesson.file_url.split('/').pop(), url: lesson.file_url }]
      : []

    res.status(200).json({
      lesson: {
        title: lesson.title,
        description: lesson.description,
        files: uploadedFiles,
        course_id: lesson.course_id
      }
    })
  } catch (err) {
    console.error('Error fetching lesson details:', err)
    res.status(500).json({ message: 'Error fetching lesson details' })
  }
})

// Update a lesson by ID
app.put('/lessons/:id', async (req, res) => {
  const { id } = req.params // Lesson ID from the route
  const { userId, title, description, files } = req.body // Data from the request body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Update the lesson's title, description, and file URLs
    let fileUrlString = null // Default to null if no files are provided
    if (files && files.length > 0) {
      fileUrlString = files.map((file) => file.url).join(';') // Join multiple file URLs as a semicolon-separated string
    }

    // Update the lesson with the new details
    const result = await pool.query(
      `
      UPDATE lessons
      SET title = $1, description = $2, file_url = $3
      WHERE id = $4 AND course_id IN (
        SELECT id FROM courses WHERE creator_id = $5
      )
      `,
      [title, description, fileUrlString, id, userId]
    )

    // Check if any rows were updated
    if (result.rowCount === 0) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this lesson or it does not exist' })
    }

    res.status(200).json({ message: 'Lesson updated successfully' })
  } catch (err) {
    console.error('Error updating lesson:', err)
    res.status(500).json({ message: 'Error updating lesson' })
  }
})

// Update lesson details
app.get('/quizzes/:id', async (req, res) => {
  const quizId = req.params.id
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Validate if the quiz belongs to the professor
    const quizCheck = await pool.query(
      `SELECT q.id, q.title, q.course_id, c.creator_id 
       FROM quizzes q
       JOIN courses c ON q.course_id = c.id
       WHERE q.id = $1`,
      [quizId]
    )

    if (quizCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    if (quizCheck.rows[0].creator_id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied: This quiz does not belong to you.' })
    }

    // Fetch quiz details
    const quizResult = await pool.query(
      `SELECT q.id, q.title, q.description, c.title AS course_title
       FROM quizzes q
       JOIN courses c ON q.course_id = c.id
       WHERE q.id = $1`,
      [quizId]
    )

    const quiz = quizResult.rows[0]

    // Fetch quiz questions
    const questionsResult = await pool.query(
      `SELECT id, question_text, options, correct_answer 
       FROM quiz_questions 
       WHERE quiz_id = $1`,
      [quizId]
    )

    const questions = questionsResult.rows.map((row) => ({
      id: row.id,
      text: row.question_text,
      options: row.options, // Assuming `options` is a JSONB array
      correctAnswer: row.correct_answer // Assuming `correct_answer` is a JSONB array
    }))

    // Fetch correct answers for all students
    const gradesResult = await pool.query(
      `SELECT 
         u.full_name AS name,
         qr.correct_answers_count AS correctAnswers,
         qr.grade AS grade
       FROM quiz_results qr
       JOIN users u ON qr.user_id = u.id
       WHERE qr.quiz_id = $1`,
      [quizId]
    )

    const studentGrades = gradesResult.rows.map((grade) => ({
      name: grade.name,
      correctAnswers: grade.correctanswers, // Fetch only correct answers
      grade: grade.grade
    }))

    res.status(200).json({
      quiz,
      questions, // Include quiz questions
      studentGrades // Include student grades
    })
  } catch (err) {
    console.error('Error fetching quiz details:', err)
    res.status(500).json({ message: 'Error fetching quiz details' })
  }
})

app.post('/quizzes/:id/update', async (req, res) => {
  const quizId = req.params.id
  const grades = req.body.grades // Expecting an array of grades to update

  try {
    // Iterate over the grades array and update each student's grade
    for (const { name, grade } of grades) {
      const userResult = await pool.query('SELECT id FROM users WHERE full_name = $1', [name])

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: `User ${name} not found` })
      }

      const userId = userResult.rows[0].id

      // Update the grade for this user
      await pool.query(
        `UPDATE quiz_results
         SET grade = $1
         WHERE quiz_id = $2 AND user_id = $3`,
        [grade, quizId, userId]
      )
    }

    res.status(200).json({ message: 'Grades updated successfully' })
  } catch (err) {
    console.error('Error updating grades:', err)
    res.status(500).json({ message: 'Error updating grades' })
  }
})

// Update quiz title & description
app.put('/quizzes/:id', async (req, res) => {
  const quizId = req.params.id
  const { userId, title, description } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Only allow update if this quiz belongs to one of the professor's courses
    const result = await pool.query(
      `UPDATE quizzes
         SET title       = $1,
             description = $2
       WHERE id        = $3
         AND course_id IN (
           SELECT id FROM courses WHERE creator_id = $4
         )`,
      [title, description, quizId, userId]
    )

    if (result.rowCount === 0) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this quiz or it does not exist' })
    }

    res.status(200).json({ message: 'Quiz updated successfully' })
  } catch (err) {
    console.error('Error updating quiz:', err)
    res.status(500).json({ message: 'Error updating quiz' })
  }
})

// Fetch meeting details (GET /meetings/:id)
app.get('/meetings/:id', async (req, res) => {
  const meetingId = req.params.id
  const userId = req.query.userId // Fetch userId from the query

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Check if the meeting belongs to the professor
    const meetingCheck = await pool.query(
      `SELECT m.id, m.course_id, c.creator_id 
       FROM meetings m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = $1`,
      [meetingId]
    )

    if (meetingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    if (meetingCheck.rows[0].creator_id !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: 'Access denied: This meeting does not belong to you.' })
    }

    // Fetch meeting details
    const meetingResult = await pool.query(
      `SELECT m.id, m.title, m.description, m.meeting_link, c.title AS course_title
       FROM meetings m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = $1`,
      [meetingId]
    )

    const meeting = meetingResult.rows[0]

    res.status(200).json({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      meeting_link: meeting.meeting_link,
      courseTitle: meeting.course_title
    })
  } catch (err) {
    console.error('Error fetching meeting details:', err)
    res.status(500).json({ message: 'Error fetching meeting details' })
  }
})

// Update meeting details (PUT /meetings/:id)
app.put('/meetings/:id', async (req, res) => {
  const meetingId = req.params.id
  const { title, description, meeting_link } = req.body

  try {
    // Check if meeting exists
    const checkResult = await pool.query('SELECT * FROM meetings WHERE id = $1', [meetingId])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    // Update meeting details
    await pool.query(
      'UPDATE meetings SET title = $1, description = $2, meeting_link = $3 WHERE id = $4',
      [title, description, meeting_link, meetingId]
    )

    res.status(200).json({ message: 'Meeting details updated successfully!' })
  } catch (err) {
    console.error('Error updating meeting details:', err)
    res.status(500).json({ message: 'Error updating meeting details' })
  }
})

// Fetch assignment details and student submissions
app.get('/assignments/:id', async (req, res) => {
  const assignmentId = req.params.id
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // 1) Ownership check
    const { rows: checkRows } = await pool.query(
      `SELECT a.course_id, c.creator_id
         FROM assignments a
         JOIN courses c ON a.course_id = c.id
        WHERE a.id = $1`,
      [assignmentId]
    )
    if (!checkRows.length) {
      return res.status(404).json({ message: 'Assignment not found' })
    }
    if (checkRows[0].creator_id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // 2) Fetch assignment + metadata
    const { rows: assignmentRows } = await pool.query(
      `SELECT
         a.title,
         a.description,
         a.due_date,
         a.allowed_files,
         c.title AS course_title
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1`,
      [assignmentId]
    )
    const assignment = assignmentRows[0]

    // 3) Fetch students & their submissions
    const { rows: students } = await pool.query(
      `SELECT u.id AS student_id, u.full_name AS student_name
         FROM participants p
         JOIN users u ON p.user_id = u.id
        WHERE p.course_id = $1`,
      [checkRows[0].course_id]
    )
    const { rows: subs } = await pool.query(
      `SELECT student_id, file_name, file_url, is_on_time, late_duration, grade
         FROM assignment_submissions
        WHERE assignment_id = $1`,
      [assignmentId]
    )

    // 4) Combine them
    const combined = students.map((s) => {
      const studentSubs = subs.filter((x) => x.student_id === s.student_id)
      return {
        student_id: s.student_id,
        student_name: s.student_name,
        submissions: studentSubs.map((x) => ({
          file_name: x.file_name,
          file_url: x.file_url,
          is_on_time: x.is_on_time,
          late_duration: x.late_duration
        })),
        status: studentSubs.length
          ? studentSubs.some((x) => !x.is_on_time)
            ? 'Late'
            : 'Submitted'
          : 'Not Submitted',
        grade: studentSubs.length ? studentSubs[0].grade : null
      }
    })

    // 5) Return everything
    res.json({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      allowed_files: assignment.allowed_files,
      courseTitle: assignment.course_title,
      students: combined
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching assignment details' })
  }
})

app.put('/assignments/:id', async (req, res) => {
  const assignmentId = req.params.id
  const {
    userId,
    title,
    description,
    dueDate, // expect "YYYY-MM-DD"
    allowedFiles // expect an array of strings, or a comma string if your column is text
  } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const result = await pool.query(
      `UPDATE assignments
         SET title          = $1,
             description    = $2,
             due_date       = $3,
             allowed_files  = $4
       WHERE id = $5
         AND course_id IN (
           SELECT id FROM courses WHERE creator_id = $6
         )`,
      [title, description, dueDate, allowedFiles, assignmentId, userId]
    )

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Not authorized or assignment not found' })
    }

    res.json({ message: 'Assignment metadata updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating assignment' })
  }
})

// Update grades for students
app.put('/assignments/:id/grades', async (req, res) => {
  const assignmentId = req.params.id
  const { grades } = req.body // Array of { student_id, grade }

  try {
    for (const { student_id, grade } of grades) {
      // Only process grades that are explicitly updated
      if (grade !== null && grade !== '-') {
        // Check if the student has a submission
        const submissionCheck = await pool.query(
          `SELECT id FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2`,
          [assignmentId, student_id]
        )

        if (submissionCheck.rows.length > 0) {
          // Update existing submission grade
          await pool.query(
            `UPDATE assignment_submissions 
             SET grade = $1 
             WHERE assignment_id = $2 AND student_id = $3`,
            [grade, assignmentId, student_id]
          )
        }
      }
    }

    res.status(200).json({ message: 'Grades updated successfully' })
  } catch (err) {
    console.error('Error updating grades:', err)
    res.status(500).json({ message: 'Error updating grades' })
  }
})

// View inside the student course
app.get('/courses/:id/content', async (req, res) => {
  const courseId = req.params.id
  const userId = req.query.userId // Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Check if the user is enrolled in the course
    const enrollmentCheck = await pool.query(
      'SELECT * FROM participants WHERE course_id = $1 AND user_id = $2',
      [courseId, userId]
    )

    if (enrollmentCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied: You are not enrolled in this course.' })
    }

    // Fetch course details
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [courseId])
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const courseTitle = courseResult.rows[0].title

    // Fetch items (lessons, quizzes, assignments, meetings)
    const lessons = await pool.query(
      'SELECT id, title, description FROM lessons WHERE course_id = $1',
      [courseId]
    )
    const quizzes = await pool.query(
      'SELECT id, title, description FROM quizzes WHERE course_id = $1',
      [courseId]
    )
    const assignments = await pool.query(
      'SELECT id, title, description FROM assignments WHERE course_id = $1',
      [courseId]
    )
    const meetings = await pool.query(
      'SELECT id, title, description FROM meetings WHERE course_id = $1',
      [courseId]
    )

    const items = [
      ...lessons.rows.map((item) => ({ ...item, type: 'lesson' })),
      ...quizzes.rows.map((item) => ({ ...item, type: 'quiz' })),
      ...assignments.rows.map((item) => ({ ...item, type: 'assignment' })),
      ...meetings.rows.map((item) => ({ ...item, type: 'meeting' }))
    ]

    res.status(200).json({ course: { title: courseTitle }, items })
  } catch (err) {
    console.error('Error fetching course content:', err)
    res.status(500).json({ message: 'Error fetching course content' })
  }
})

// Delete student from course
app.delete('/courses/:id/leave', async (req, res) => {
  const courseId = req.params.id
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Check if the student is enrolled in the course
    const enrollmentCheck = await pool.query(
      'SELECT * FROM participants WHERE course_id = $1 AND user_id = $2',
      [courseId, userId]
    )

    if (enrollmentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'You are not enrolled in this course.' })
    }

    // Remove student from course
    await pool.query('DELETE FROM participants WHERE course_id = $1 AND user_id = $2', [
      courseId,
      userId
    ])

    res.status(200).json({ message: 'You have successfully left the course.' })
  } catch (error) {
    console.error('Error leaving course:', error)
    res.status(500).json({ message: 'Error leaving course.' })
  }
})

app.get('/lessons/:id/student', async (req, res) => {
  const lessonId = req.params.id
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Fetch the lesson and its course_id
    const lessonResult = await pool.query(
      'SELECT id, title, description, file_url, course_id FROM lessons WHERE id = $1',
      [lessonId]
    )

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    const lesson = lessonResult.rows[0]

    // Check if the student is enrolled in the course
    const enrollmentResult = await pool.query(
      'SELECT id FROM participants WHERE course_id = $1 AND user_id = $2',
      [lesson.course_id, userId]
    )

    if (enrollmentResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied: You are not enrolled in this course.' })
    }

    // Fetch the course title
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [
      lesson.course_id
    ])
    const courseTitle = courseResult.rows.length > 0 ? courseResult.rows[0].title : 'Unknown Course'

    // Prepare file details from file_url (if any)
    const materials = lesson.file_url
      ? [{ id: lesson.id, name: lesson.file_url.split('/').pop(), file_url: lesson.file_url }]
      : []

    res.status(200).json({
      lesson: {
        title: lesson.title,
        description: lesson.description,
        courseTitle: courseTitle // Add course title here
      },
      materials // Include the files directly
    })
  } catch (err) {
    console.error('Error fetching lesson details:', err)
    res.status(500).json({ message: 'Error fetching lesson details' })
  }
})

app.get('/quizzes/:id/student', async (req, res) => {
  const quizId = req.params.id
  const studentId = req.query.userId

  try {
    // Fetch quiz details
    const quizResult = await pool.query(
      `SELECT q.id, q.title, q.course_id, q.timer AS max_duration, c.title AS course_title
       FROM quizzes q
       JOIN courses c ON q.course_id = c.id
       WHERE q.id = $1`,
      [quizId]
    )

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    const quiz = quizResult.rows[0]

    // Check if the student participates in the course
    const participantCheck = await pool.query(
      'SELECT * FROM participants WHERE course_id = $1 AND user_id = $2',
      [quiz.course_id, studentId]
    )

    if (participantCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied: You are not enrolled in this course.' })
    }

    // Fetch total questions
    const totalQuestionsResult = await pool.query(
      'SELECT COUNT(*) AS total FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    )

    const totalQuestions = totalQuestionsResult.rows[0].total

    // Check for previous attempts
    const attemptCheck = await pool.query(
      'SELECT correct_answers_count, grade FROM quiz_results WHERE quiz_id = $1 AND user_id = $2',
      [quizId, studentId]
    )

    if (attemptCheck.rows.length > 0) {
      return res.status(200).json({
        quiz: {
          id: quiz.id,
          title: quiz.title,
          course_id: quiz.course_id, // Include course_id
          course_title: quiz.course_title,
          max_duration: quiz.max_duration
        },
        alreadyAttempted: true,
        grade: attemptCheck.rows[0].grade,
        correctAnswersCount: attemptCheck.rows[0].correct_answers_count,
        totalQuestions
      })
    }

    // Fetch quiz questions
    const quizQuestions = await pool.query(
      'SELECT id, question_text, options FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    )

    const formattedQuestions = quizQuestions.rows.map((question) => ({
      id: question.id,
      text: question.question_text,
      options: question.options,
      correct_answer: Array.isArray(question.correct_answer) ? question.correct_answer : []
    }))

    res.status(200).json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        course_id: quiz.course_id,
        course_title: quiz.course_title,
        max_duration: quiz.max_duration
      },
      questions: formattedQuestions,
      alreadyAttempted: false,
      totalQuestions
    })
  } catch (err) {
    console.error('Error fetching quiz details:', err)
    res.status(500).json({ message: 'Error fetching quiz details' })
  }
})

app.post('/quizzes/:id/student/submit', async (req, res) => {
  const quizId = req.params.id
  const { userId, userAnswers } = req.body // Ensure userId and userAnswers are extracted

  if (!userId || !userAnswers) {
    return res.status(400).json({ message: 'User ID and answers are required.' })
  }

  try {
    // Fetch the quiz questions
    const quizQuestions = await pool.query(
      'SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    )

    const questions = quizQuestions.rows

    // Calculate the correct answers
    let correctAnswersCount = 0
    questions.forEach((question, index) => {
      if (question.correct_answer.includes(userAnswers[index])) {
        correctAnswersCount++
      }
    })

    const grade = (correctAnswersCount / questions.length) * 10 // Grade out of 10

    // Save the student's grade and answers in the database
    await pool.query(
      `INSERT INTO quiz_results (quiz_id, user_id, correct_answers_count, grade)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (quiz_id, user_id)
       DO UPDATE SET correct_answers_count = $3, grade = $4`,
      [quizId, userId, correctAnswersCount, grade]
    )

    res.status(200).json({
      message: 'Quiz submitted successfully',
      correctAnswersCount,
      grade
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    res.status(500).json({ message: 'Error submitting quiz' })
  }
})

// Fetch meeting details for students (GET /meetings/:id/student)
app.get('/meetings/:id/student', async (req, res) => {
  const meetingId = req.params.id
  const userId = req.query.userId // User ID from query parameters

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Fetch the meeting details
    const meetingResult = await pool.query(
      `SELECT m.id, m.title, m.description, m.meeting_link, m.course_id
       FROM meetings m
       WHERE m.id = $1`,
      [meetingId]
    )

    if (meetingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    const meeting = meetingResult.rows[0]

    // Check if the user is a participant in the course
    const participantCheck = await pool.query(
      `SELECT id FROM participants
       WHERE course_id = $1 AND user_id = $2`,
      [meeting.course_id, userId]
    )

    if (participantCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied: You are not enrolled in this course.' })
    }

    // Fetch course title
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [
      meeting.course_id
    ])

    const courseTitle = courseResult.rows.length > 0 ? courseResult.rows[0].title : 'Unknown Course'

    res.status(200).json({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      meeting_link: meeting.meeting_link,
      courseTitle: courseTitle
    })
  } catch (err) {
    console.error('Error fetching meeting details:', err)
    res.status(500).json({ message: 'Error fetching meeting details' })
  }
})

app.get('/assignments/:id/student', async (req, res) => {
  const assignmentId = req.params.id
  const studentId = req.query.studentId

  try {
    // Fetch assignment details
    const assignmentResult = await pool.query(
      `SELECT a.id, a.title, a.description, a.allowed_files, a.due_date, c.title AS course_title, a.course_id
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE a.id = $1`,
      [assignmentId]
    )

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    const assignment = assignmentResult.rows[0]

    // Check if the student participates in the course
    const participantCheck = await pool.query(
      'SELECT * FROM participants WHERE course_id = $1 AND user_id = $2',
      [assignment.course_id, studentId]
    )

    if (participantCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied: You are not enrolled in this course.' })
    }

    // Calculate time remaining
    const currentTime = new Date()
    const dueDate = new Date(assignment.due_date)
    const timeDifference = dueDate - currentTime
    const timeRemaining =
      timeDifference > 0
        ? `${Math.floor(timeDifference / (1000 * 60 * 60))} hours remaining`
        : `Past due - ${Math.ceil(Math.abs(timeDifference) / (1000 * 60 * 60))} hours late`

    const filesResult = await pool.query(
      `SELECT id, file_name, file_url, grade FROM assignment_submissions
       WHERE assignment_id = $1 AND student_id = $2`,
      [assignmentId, studentId]
    )

    const files = filesResult.rows

    res.status(200).json({
      assignment,
      submission: files.length > 0 ? { files, grade: files[0]?.grade } : null,
      timeRemaining
    })
  } catch (err) {
    console.error('Error fetching assignment details:', err)
    res.status(500).json({ message: 'Error fetching assignment details' })
  }
})

const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments') // Make sure this folder actually exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // Save as the original filename
  }
})

const assignmentUpload = multer({ storage: assignmentStorage })

app.post(
  '/assignments/:id/student/upload',
  assignmentUpload.array('files', 10),
  async (req, res) => {
    const assignmentId = req.params.id
    const studentId = req.body.studentId
    const files = req.files

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one file is required!' })
    }

    try {
      // Validate studentId
      const studentCheck = await pool.query('SELECT id FROM users WHERE id = $1', [studentId])
      if (studentCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Student not found' })
      }

      // Check if the assignment exists and if it is graded
      const assignmentCheck = await pool.query(
        `SELECT 
           a.due_date, 
           COALESCE(asub.grade, NULL) AS grade,
           a.allowed_files 
         FROM assignments a 
         LEFT JOIN assignment_submissions asub 
           ON asub.assignment_id = a.id AND asub.student_id = $1 
         WHERE a.id = $2`,
        [studentId, assignmentId]
      )

      if (assignmentCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Assignment not found' })
      }

      const { due_date: dueDate, grade, allowed_files } = assignmentCheck.rows[0]

      // If the assignment is graded, block further uploads
      if (grade !== null) {
        return res
          .status(403)
          .json({ message: 'Assignment has already been graded. Upload not allowed.' })
      }

      // Validate each file's extension against allowed_files
      // Assuming allowed_files is stored as a Postgres array (TEXT[] or JSONB parsed as array)
      for (const file of files) {
        const ext = file.originalname.split('.').pop().toLowerCase()
        if (!allowed_files.includes(ext)) {
          return res.status(400).json({
            message: `File type .${ext} is not allowed. Allowed types: ${allowed_files.join(', ')}`
          })
        }
      }

      const submittedAt = new Date()
      const isOnTime = submittedAt <= new Date(dueDate)
      const lateDuration = isOnTime
        ? null
        : Math.ceil((submittedAt - new Date(dueDate)) / (1000 * 60 * 60 * 24))

      // Insert each file into the database with the updated file URL
      const insertPromises = files.map((file) =>
        pool.query(
          `INSERT INTO assignment_submissions 
                (assignment_id, student_id, file_name, file_url, is_on_time, late_duration, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            assignmentId,
            studentId,
            file.originalname, // Display name: e.g., AntalKrisztian.docx
            `/backend/uploads/assignments/${file.originalname}`, // Updated URL
            isOnTime,
            lateDuration,
            submittedAt
          ]
        )
      )

      await Promise.all(insertPromises)

      res.status(201).json({ message: 'Files uploaded successfully!' })
    } catch (err) {
      console.error('Error uploading files:', err)
      res.status(500).json({ message: 'Error uploading files' })
    }
  }
)

// Endpoint to delete a specific file
app.delete('/assignments/:id/student/file', async (req, res) => {
  const { fileId, studentId } = req.body

  try {
    // Validate if the file belongs to the student
    const fileCheck = await pool.query(
      `SELECT grade FROM assignment_submissions WHERE id = $1 AND student_id = $2`,
      [fileId, studentId]
    )

    if (fileCheck.rows.length === 0) {
      return res.status(404).json({ message: 'File not found or not authorized to delete' })
    }

    // Check if the file is already graded
    const { grade } = fileCheck.rows[0]
    if (grade !== null) {
      return res
        .status(403)
        .json({ message: 'Cannot delete file. The assignment is already graded.' })
    }

    // Delete the file
    await pool.query(`DELETE FROM assignment_submissions WHERE id = $1`, [fileId])

    res.status(200).json({ message: 'File deleted successfully!' })
  } catch (err) {
    console.error('Error deleting file:', err)
    res.status(500).json({ message: 'Error deleting file' })
  }
})

app.get('/admin/students', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, username, email FROM users WHERE role = 'Student'`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching students:', err)
    res.status(500).json({ message: 'Error fetching students' })
  }
})

app.post('/admin/students', async (req, res) => {
  const { full_name, username, email, password } = req.body

  if (!full_name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' })
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5)

    await pool.query(
      `INSERT INTO users (full_name, username, email, password, role) 
       VALUES ($1, $2, $3, $4, $5)`,
      [full_name, username, email, hashedPassword, 'Student']
    )

    res.status(201).json({ message: 'Student added successfully!' })
  } catch (err) {
    console.error('Error adding student:', err)
    res.status(500).json({ message: 'Error adding student' })
  }
})

app.delete('/admin/students/:id', async (req, res) => {
  const studentId = req.params.id

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND LOWER(role) = LOWER($2)', [
      studentId,
      'student'
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found or not a student' })
    }

    res.status(200).json({ message: 'Student deleted successfully' })
  } catch (err) {
    console.error('Error deleting student:', err)
    res.status(500).json({ message: 'Error deleting student' })
  }
})

// Endpoint to fetch a specific student by ID
app.get('/admin/students/:id', async (req, res) => {
  const studentId = req.params.id

  try {
    const result = await pool.query(
      `SELECT id, full_name, username, email FROM users WHERE id = $1 AND LOWER(role) = LOWER($2)`,
      [studentId, 'student']
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found or not a student' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching student:', err)
    res.status(500).json({ message: 'Error fetching student' })
  }
})

// Endpoint to update a specific student's details
app.put('/admin/students/:id', async (req, res) => {
  const studentId = req.params.id
  const { full_name, username, email, password } = req.body

  if (!full_name || !username || !email) {
    return res.status(400).json({ message: 'Full name, username, and email are required!' })
  }

  try {
    // Update the student's details
    if (password) {
      // If password is provided, hash it and update it as well
      const hashedPassword = await bcrypt.hash(password, 5)
      await pool.query(
        `UPDATE users 
         SET full_name = $1, username = $2, email = $3, password = $4 
         WHERE id = $5 AND LOWER(role) = LOWER($6)`,
        [full_name, username, email, hashedPassword, studentId, 'student']
      )
    } else {
      // If no password is provided, only update other details
      await pool.query(
        `UPDATE users 
         SET full_name = $1, username = $2, email = $3 
         WHERE id = $4 AND LOWER(role) = LOWER($5)`,
        [full_name, username, email, studentId, 'student']
      )
    }

    res.status(200).json({ message: 'Student updated successfully' })
  } catch (err) {
    console.error('Error updating student:', err)
    res.status(500).json({ message: 'Error updating student' })
  }
})

// Endpoint to fetch all professors
app.get('/admin/professors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, username, email FROM users WHERE role = 'Professor'`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching professors:', err)
    res.status(500).json({ message: 'Error fetching professors' })
  }
})

// Endpoint to add a new professor
app.post('/admin/professors', async (req, res) => {
  const { full_name, username, email, password } = req.body

  if (!full_name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' })
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5)

    await pool.query(
      `INSERT INTO users (full_name, username, email, password, role) 
       VALUES ($1, $2, $3, $4, $5)`,
      [full_name, username, email, hashedPassword, 'Professor']
    )

    res.status(201).json({ message: 'Professor added successfully!' })
  } catch (err) {
    console.error('Error adding professor:', err)
    res.status(500).json({ message: 'Error adding professor' })
  }
})

// Endpoint to delete a professor
app.delete('/admin/professors/:id', async (req, res) => {
  const professorId = req.params.id

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND LOWER(role) = LOWER($2)', [
      professorId,
      'professor'
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Professor not found or not a professor' })
    }

    res.status(200).json({ message: 'Professor deleted successfully' })
  } catch (err) {
    console.error('Error deleting professor:', err)
    res.status(500).json({ message: 'Error deleting professor' })
  }
})

// Endpoint to fetch a specific professor by ID
app.get('/admin/professors/:id', async (req, res) => {
  const professorId = parseInt(req.params.id, 10)

  if (isNaN(professorId)) {
    return res.status(400).json({ message: 'Invalid professor ID' })
  }

  try {
    const result = await pool.query(
      `SELECT id, full_name, username, email FROM users WHERE id = $1 AND LOWER(role) = LOWER($2)`,
      [professorId, 'professor']
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Professor not found or not a professor' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching professor:', err)
    res.status(500).json({ message: 'Error fetching professor' })
  }
})

// Endpoint to update a specific professor's details
app.put('/admin/professors/:id', async (req, res) => {
  const professorId = req.params.id
  const { full_name, username, email, password } = req.body

  if (!full_name || !username || !email) {
    return res.status(400).json({ message: 'Full name, username, and email are required!' })
  }

  try {
    // Update the professor's details
    if (password) {
      // If password is provided, hash it and update it as well
      const hashedPassword = await bcrypt.hash(password, 5)
      await pool.query(
        `UPDATE users 
         SET full_name = $1, username = $2, email = $3, password = $4 
         WHERE id = $5 AND LOWER(role) = LOWER($6)`,
        [full_name, username, email, hashedPassword, professorId, 'professor']
      )
    } else {
      // If no password is provided, only update other details
      await pool.query(
        `UPDATE users 
         SET full_name = $1, username = $2, email = $3 
         WHERE id = $4 AND LOWER(role) = LOWER($5)`,
        [full_name, username, email, professorId, 'professor']
      )
    }

    res.status(200).json({ message: 'Professor updated successfully' })
  } catch (err) {
    console.error('Error updating professor:', err)
    res.status(500).json({ message: 'Error updating professor' })
  }
})

// Get all courses
app.get('/admin/courses', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, creator_id, color, created_at 
       FROM courses`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching courses:', err)
    res.status(500).json({ message: 'Error fetching courses' })
  }
})

// Add a new course
app.post('/admin/courses', async (req, res) => {
  const { title, password, color, description, creator_id } = req.body

  if (!title || !password || !color || !description || !creator_id) {
    return res.status(400).json({ message: 'All fields are required!' })
  }

  try {
    // Insert the new course into the database
    const result = await pool.query(
      `INSERT INTO courses (title, password, color, description, creator_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`,
      [title, password, color, description, creator_id]
    )

    res.status(201).json({ message: 'Course added successfully!', courseId: result.rows[0].id })
  } catch (err) {
    console.error('Error adding course:', err)
    res.status(500).json({ message: 'Error adding course' })
  }
})

// Delete a course by ID
app.delete('/admin/courses/:id', async (req, res) => {
  const courseId = req.params.id

  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1', [courseId])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.status(200).json({ message: 'Course deleted successfully' })
  } catch (err) {
    console.error('Error deleting course:', err)
    res.status(500).json({ message: 'Error deleting course' })
  }
})

// Get a specific course by ID
app.get('/admin/courses/:id', async (req, res) => {
  const courseId = req.params.id

  try {
    const result = await pool.query(
      `SELECT id, title, password, color, description, creator_id 
       FROM courses 
       WHERE id = $1`,
      [courseId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching course:', err)
    res.status(500).json({ message: 'Error fetching course' })
  }
})

// Update a course by ID
app.put('/admin/courses/:id', async (req, res) => {
  const courseId = req.params.id
  const { title, password, color, description, creator_id } = req.body

  if (!title || !color || !description || !creator_id) {
    return res
      .status(400)
      .json({ message: 'Title, color, description, and creator ID are required!' })
  }

  try {
    if (password) {
      // Update all fields including the password
      await pool.query(
        `UPDATE courses 
         SET title = $1, password = $2, color = $3, description = $4, creator_id = $5 
         WHERE id = $6`,
        [title, password, color, description, creator_id, courseId]
      )
    } else {
      // Update all fields except the password
      await pool.query(
        `UPDATE courses 
         SET title = $1, color = $2, description = $3, creator_id = $4 
         WHERE id = $5`,
        [title, color, description, creator_id, courseId]
      )
    }

    res.status(200).json({ message: 'Course updated successfully' })
  } catch (err) {
    console.error('Error updating course:', err)
    res.status(500).json({ message: 'Error updating course' })
  }
})

// Fetch enrolled students for a specific course
app.get('/admin/courses/:courseId/participants', async (req, res) => {
  const courseId = req.params.courseId

  try {
    const result = await pool.query(
      `SELECT p.id AS participant_id, u.id AS student_id, u.full_name AS name, u.email
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.course_id = $1`,
      [courseId]
    )

    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching participants:', err)
    res.status(500).json({ message: 'Error fetching participants' })
  }
})

// Add a student to a course
app.post('/admin/courses/:courseId/participants', async (req, res) => {
  const courseId = req.params.courseId
  const { studentId } = req.body

  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' })
  }

  try {
    // Check if the student exists
    const studentCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1 AND LOWER(role) = LOWER($2)`,
      [studentId, 'student']
    )

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found or not a valid student' })
    }

    // Add the student to the course
    await pool.query(`INSERT INTO participants (course_id, user_id) VALUES ($1, $2)`, [
      courseId,
      studentId
    ])

    res.status(201).json({ message: 'Student added to the course successfully' })
  } catch (err) {
    console.error('Error adding participant:', err)
    res.status(500).json({ message: 'Error adding participant' })
  }
})

// Remove a student from a course
app.delete('/admin/courses/:courseId/participants/:participantId', async (req, res) => {
  const participantId = req.params.participantId

  try {
    const result = await pool.query(`DELETE FROM participants WHERE id = $1`, [participantId])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Participant not found' })
    }

    res.status(200).json({ message: 'Student removed from the course successfully' })
  } catch (err) {
    console.error('Error removing participant:', err)
    res.status(500).json({ message: 'Error removing participant' })
  }
})

app.get('/admin/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY date_created DESC')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching announcements:', err)
    res.status(500).json({ message: 'Error fetching announcements' })
  }
})

app.post('/admin/announcements', async (req, res) => {
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required!' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO announcements (title, content, date_created) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
      [title, content]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error adding announcement:', err)
    res.status(500).json({ message: 'Error adding announcement' })
  }
})

app.delete('/admin/announcements/:id', async (req, res) => {
  const announcementId = req.params.id

  try {
    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [
      announcementId
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    res.status(200).json({ message: 'Announcement deleted successfully' })
  } catch (err) {
    console.error('Error deleting announcement:', err)
    res.status(500).json({ message: 'Error deleting announcement' })
  }
})

app.get('/admin/announcements/:id', async (req, res) => {
  const announcementId = req.params.id

  try {
    const result = await pool.query(
      `SELECT id, title, content, to_char(date_created, 'DD Mon YYYY') as date_created 
       FROM announcements 
       WHERE id = $1`,
      [announcementId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching announcement:', err)
    res.status(500).json({ message: 'Error fetching announcement' })
  }
})

// Endpoint to update a specific announcement
app.put('/admin/announcements/:id', async (req, res) => {
  const announcementId = req.params.id
  const { title, content, date_created } = req.body

  if (!title || !content || !date_created) {
    return res.status(400).json({ message: 'All fields are required!' })
  }

  try {
    const result = await pool.query(
      `UPDATE announcements 
       SET title = $1, content = $2, date_created = $3
       WHERE id = $4`,
      [title, content, date_created, announcementId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.status(200).json({ message: 'Announcement updated successfully!' })
  } catch (err) {
    console.error('Error updating announcement:', err)
    res.status(500).json({ message: 'Error updating announcement' })
  }
})

// Fetch the profile of a user
app.get('/profile/fetch/:id', async (req, res) => {
  const { id } = req.params
  const userId = req.query.userId // Get the userId from the query parameters

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' }) // Ensure userId is provided
  }

  if (parseInt(userId, 10) !== parseInt(id, 10)) {
    return res.status(403).json({ message: 'Access denied: You can only access your own profile.' }) // Check if userId matches
  }

  try {
    const result = await pool.query(
      `SELECT full_name, username, email, role FROM users WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching profile:', err)
    res.status(500).json({ message: 'Error fetching profile' })
  }
})

// Update a user's profile
app.put('/profile/update/:id', async (req, res) => {
  const { id } = req.params
  const { userId, fullName, username, email, password } = req.body

  // Ensure the logged-in user matches the ID being updated
  if (parseInt(id, 10) !== parseInt(userId, 10)) {
    return res.status(403).json({
      message: 'Access denied: You can only update your own profile.'
    })
  }

  try {
    let hashedPassword = null

    // If a password is provided, hash it
    if (password) {
      const saltRounds = 10
      hashedPassword = await bcrypt.hash(password, saltRounds) // Reuse the existing bcrypt import
    }

    // Update the user's profile
    const updateQuery = `
      UPDATE users
      SET 
        full_name = $1,
        username = $2,
        email = $3,
        password = COALESCE($4, password) -- Update password only if provided
      WHERE id = $5
    `
    const updateValues = [fullName, username, email, hashedPassword, id]

    await pool.query(updateQuery, updateValues)

    res.status(200).json({ message: 'Profile updated successfully!' })
  } catch (err) {
    console.error('Error updating profile:', err)
    res.status(500).json({ message: 'Error updating profile.' })
  }
})

// Fetch the courses for a student
app.get('/student_course_home/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      SELECT c.id, c.title, c.description, c.color
      FROM courses c
      JOIN participants p ON c.id = p.course_id
      WHERE p.user_id = $1
      LIMIT 3
    `
    const result = await pool.query(query, [id])

    console.log(`Student ${id} courses:`, result.rows) // Log the courses for the student

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No courses found for the student.' })
    }

    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching student courses:', err)
    res.status(500).json({ message: 'Error fetching courses.' })
  }
})

// Fetch the courses created by a professor
app.get('/professor_course_home/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      SELECT id, title, description, color
      FROM courses
      WHERE creator_id = $1
      LIMIT 3
    `
    const result = await pool.query(query, [id])

    console.log(`Professor ${id} courses:`, result.rows) // Log the courses for the professor

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No courses found for the professor.' })
    }

    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching professor courses:', err)
    res.status(500).json({ message: 'Error fetching courses.' })
  }
})

// fetch the announcements for the /announcements page
app.get('/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY date_created DESC')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching announcements:', err)
    res.status(500).json({ message: 'Error fetching announcements' })
  }
})

// fetch the professors for the /professors page
app.get('/professors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name AS name 
       FROM users 
       WHERE role = 'Professor'`
    )
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching professors:', err)
    res.status(500).json({ message: 'Error fetching professors' })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// Search courses based on user role
app.get('/search/courses', async (req, res) => {
  const { query, userId, role } = req.query

  // Validate inputs
  if (!userId || !role) {
    return res.status(400).json({ message: 'Missing userId or role' })
  }

  try {
    let sql = ''
    let params = []

    if (role.toLowerCase() === 'student') {
      // Student: find courses the user is enrolled in
      sql = `
        SELECT c.*
        FROM participants p
        JOIN courses c ON p.course_id = c.id
        WHERE p.user_id = $1
          AND c.title ILIKE $2
      `
      params = [userId, `%${query}%`]
    } else if (role.toLowerCase() === 'professor') {
      // Professor: find courses the user created
      sql = `
        SELECT *
        FROM courses
        WHERE creator_id = $1
          AND title ILIKE $2
      `
      params = [userId, `%${query}%`]
    } else {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const result = await pool.query(sql, params)
    res.status(200).json(result.rows) // Return the matching courses
  } catch (err) {
    console.error('Error searching courses:', err)
    res.status(500).json({ message: 'Error searching courses' })
  }
})
