<template>
  <div class="login-container">
    <!-- Left side image container -->
    <div class="login-image">
      <img src="@/assets/login-img02.png" alt="Login Image" />
    </div>

    <!-- Right side form container -->
    <div class="login-form">
      <h1>Welcome to EduCore</h1>
      <p>The best educational platform for schools and universities</p>

      <div class="form-container">
        <h2>Access the platform</h2>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
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

          <button type="submit" class="login-button">Login</button>
        </form>

        <router-link to="/register" class="forgot-password"
          >Don't have an account?Register here
        </router-link>
        <!-- Display error message -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService' // Import the authService

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await authService.loginUser({
          email: this.email,
          password: this.password
        })

        localStorage.setItem('userId', response.data.userId)
        localStorage.setItem('userRole', response.data.role)
        localStorage.setItem('authToken', response.data.token)

        // Redirect based on role and reload to fix layout
        if (response.data.role === 'Student' || response.data.role === 'Professor') {
          this.$router.push('/home').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 200) // short delay ensures DOM has time to render
          })
        } else if (response.data.role === 'Admin') {
          this.$router.push('/admin_student').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 100)
          })
        }
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message)
        this.errorMessage = 'Invalid email or password'
      }
    }
  }
}
</script>

<style scoped>
/* Main container for the login page */
.login-container {
  display: flex;
}

/* Left side image container */
.login-image {
  flex: 1;
  background-color: #f5f5f5;
  overflow: hidden;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Right side form container */
.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
  background-color: #ffffff;
}

.login-form h1 {
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #333;
}

.login-form p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 30px;
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
  margin-bottom: 20px;
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

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  background: transparent;
}

/* Login button styles */
.login-button {
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

.login-button:hover {
  background-color: #b71c1c;
}

/* Forgot password link */
.forgot-password {
  display: block;
  margin-top: 15px;
  color: #d32f2f;
  text-align: center;
  text-decoration: none;
  font-size: 0.9em;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Dark mode styles */
body.dark-mode .login-container {
  background-color: #121212;
}

body.dark-mode .login-form {
  background-color: #333;
  color: #e0e0e0;
}

body.dark-mode .login-form h1,
body.dark-mode .login-form p,
body.dark-mode .form-container h2 {
  color: #e0e0e0;
}

body.dark-mode .input-container {
  background-color: #444;
}

body.dark-mode .input-container i {
  color: #bbb;
}

body.dark-mode input[type='email'],
body.dark-mode input[type='password'] {
  color: #e0e0e0;
}

body.dark-mode .login-button {
  background-color: #d32f2f;
}

body.dark-mode .login-button:hover {
  background-color: #b71c1c;
}

body.dark-mode .forgot-password {
  color: #d32f2f;
}

body.dark-mode .login-image {
  background-color: #333232;
}

/* Disable browser autofill background in light mode */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: #333 !important;
  -webkit-box-shadow: 0 0 0 1000px #f5f5f5 inset !important;
  box-shadow: 0 0 0 1000px #f5f5f5 inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* For dark mode, match your .input-container's background (#444) */
body.dark-mode input:-webkit-autofill,
body.dark-mode input:-webkit-autofill:hover,
body.dark-mode input:-webkit-autofill:focus {
  -webkit-text-fill-color: #e0e0e0 !important;
  -webkit-box-shadow: 0 0 0 1000px #444 inset !important;
  box-shadow: 0 0 0 1000px #444 inset !important;
}
</style>
