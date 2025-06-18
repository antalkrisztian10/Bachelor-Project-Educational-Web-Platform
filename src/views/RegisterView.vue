<template>
  <div class="register-container">
    <div class="register-image">
      <img src="@/assets/register-img02.png" alt="Registration Image" />
    </div>
    <div class="register-form">
      <h1>Welcome to EduPlatform</h1>
      <p>The best educational platform for schools and universities</p>

      <div class="form-container">
        <h2>Register</h2>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <div class="input-container">
              <i class="fas fa-user"></i>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                v-model="fullName"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-container">
              <i class="fas fa-user"></i>
              <input type="text" id="username" placeholder="Username" v-model="username" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-container">
              <i class="fas fa-envelope"></i>
              <input type="email" id="email" placeholder="Email" v-model="email" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                placeholder="Password"
                v-model="password"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="role">Select Role</label>
            <div class="input-container">
              <i class="fas fa-user-tag"></i>
              <select id="role" v-model="role" required>
                <option disabled value="">Choose Role</option>
                <option value="Professor">Professor</option>
                <option value="Student">Student</option>
                <option value="Student">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" class="register-button">Register</button>
        </form>

        <a href="/login" class="login-link">If you already have an account, click here</a>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService' // Import the authService module

export default {
  name: 'RegisterView',
  data() {
    return {
      fullName: '', // Added fullName field
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '' // Bound to the role select input
    }
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      try {
        const userData = {
          fullName: this.fullName,
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        }

        console.log('Sending registration data:', userData)

        await authService.registerUser(userData)

        if (this.role.toLowerCase() === 'professor' || this.role.toLowerCase() === 'admin') {
          alert(
            'Account created successfully, but you need to wait until an administrator approves your account. Please come back later.'
          )
        } else {
          alert('Registration successful!')
          this.$router.push('/login')
        }

        // Optional: reset form fields
        this.fullName = ''
        this.username = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.role = ''
      } catch (err) {
        console.error('Error registering user:', err.message)
        alert('Error registering user')
      }
    }
  }
}
</script>

<style scoped>
/* Main container for the registration page */
.register-container {
  display: flex;
  flex-wrap: wrap;
}

.register-image {
  flex: 1;
  overflow: hidden;
}

.register-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Right side form container */
.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
}

.register-form h1 {
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #333;
}

.register-form p {
  color: #666;
  font-size: 1em;
  margin-bottom: 20px;
}

/* Form container */
.form-container {
  width: 100%;
  max-width: 400px;
}

.form-container h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

/* Form styles */
.form-group {
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 10px;
}

.input-container i {
  color: #888;
  margin-right: 10px;
}

input[type='text'],
input[type='email'],
input[type='password'],
select {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  background: transparent;
}

.register-button {
  width: 100%;
  padding: 10px;
  background-color: #d32f2f;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #b71c1c;
}

.login-link {
  display: block;
  margin-top: 15px;
  color: #d32f2f;
  text-align: center;
  text-decoration: none;
  font-size: 0.9em;
}

.login-link:hover {
  text-decoration: underline;
}

/* Responsive styles for smaller devices */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-image {
    display: none;
  }

  .register-form {
    width: 100%;
    padding: 20px;
  }
}

/* Dark mode styles */
body.dark-mode .register-container {
  background-color: #333;
}

body.dark-mode .register-form {
  background-color: #333;
  color: #e0e0e0;
}

body.dark-mode .input-container {
  background-color: #444;
}

body.dark-mode input,
body.dark-mode select {
  color: #e0e0e0;
}

body.dark-mode .register-button {
  background-color: #d32f2f;
}

body.dark-mode .register-button:hover {
  background-color: #b71c1c;
}

body.dark-mode .login-link {
  color: #d32f2f;
}
</style>
