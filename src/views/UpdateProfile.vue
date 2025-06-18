<template>
  <div class="update-profile">
    <h1>Update Your Profile</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          v-model="formData.fullName"
          placeholder="Enter your full name"
        />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          v-model="formData.username"
          placeholder="Enter your username"
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="formData.email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="formData.password"
          placeholder="Enter a new password (or leave blank to keep)"
        />
      </div>
      <button type="submit" class="btn">Update Profile</button>
    </form>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'UpdateProfile',
  data() {
    return {
      formData: {
        fullName: '',
        username: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async fetchUserData() {
      const userId = this.$route.params.id // ID from route params
      const loggedInUserId = localStorage.getItem('userId') // ID of the logged-in user

      // Verify if the user is accessing their own profile
      if (!loggedInUserId || parseInt(loggedInUserId, 10) !== parseInt(userId, 10)) {
        alert('Access denied: You can only view your own profile.')
        this.$router.push('/login') // Redirect to login if unauthorized
        return
      }

      try {
        // Make sure the request includes the userId
        const response = await axios.get(`/profile/fetch/${userId}`, {
          params: { userId: loggedInUserId }
        })
        this.formData.fullName = response.data.full_name || ''
        this.formData.username = response.data.username || ''
        this.formData.email = response.data.email || ''
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message)
        alert(error.response?.data?.message || 'Failed to fetch user data. Please try again.')
      }
    },
    async updateProfile() {
      const userId = this.$route.params.id
      const loggedInUserId = localStorage.getItem('userId')

      if (!loggedInUserId || parseInt(loggedInUserId, 10) !== parseInt(userId, 10)) {
        alert('Access denied: You can only update your own profile.')
        this.$router.push('/login')
        return
      }

      try {
        await axios.put(`/profile/update/${userId}`, {
          userId: loggedInUserId,
          fullName: this.formData.fullName,
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password || null // Update only if password is provided
        })

        alert('Profile updated successfully!')
        this.$router.push(`/profile/${userId}`) // Redirect to profile view
      } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message)
        alert('Failed to update profile. Please try again.')
      }
    }
  },
  mounted() {
    this.fetchUserData() // Load user data on mount
  }
}
</script>

<style scoped>
.update-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

body.dark-mode .update-profile {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Slightly darker shadow */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

body.dark-mode h1 {
  color: #e0e0e0; /* Light text color in dark mode */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

body.dark-mode label {
  color: #e0e0e0; /* Light label color in dark mode */
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
}

body.dark-mode input {
  background-color: #444; /* Dark input background */
  border: 1px solid #555; /* Dark input border */
  color: #e0e0e0; /* Light text color in dark mode */
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

body.dark-mode .btn {
  background-color: #0056b3; /* Darker blue in dark mode */
  color: #fff;
}

.btn:hover {
  background-color: #0056b3;
}

body.dark-mode .btn:hover {
  background-color: #003f7f; /* Even darker hover color in dark mode */
}
</style>
