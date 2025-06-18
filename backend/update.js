import bcrypt from 'bcrypt'
import pkg from 'pg'

const { Pool } = pkg

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EduCore',
  password: 'salut',
  port: 5432
})

;(async () => {
  try {
    console.log('Starting password hashing process...')
    const users = await pool.query('SELECT id, password FROM users')

    for (const user of users.rows) {
      const { id, password } = user

      // Check if the password is plain-text (not hashed)
      if (!password.startsWith('$2b$')) {
        console.log(`Hashing password for user ID ${id}...`)
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Update the password in the database
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id])

        console.log(`Password for user ID ${id} has been successfully hashed.`)
      } else {
        console.log(`Password for user ID ${id} is already hashed. Skipping.`)
      }
    }

    console.log('Password hashing process completed.')
    process.exit(0)
  } catch (err) {
    console.error('Error during password hashing:', err.message)
    process.exit(1)
  }
})()
