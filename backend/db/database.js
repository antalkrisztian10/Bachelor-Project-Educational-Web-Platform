import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'salut', // Ensure password is correctly passed
  database: process.env.DB_NAME || 'EduCore',
  port: process.env.DB_PORT || 5432
})

export default pool
