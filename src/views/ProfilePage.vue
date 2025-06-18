<template>
  <div class="profile-main">
    <h1 class="section-title">Your Profile</h1>
    <div class="profile-card">
      <img src="@/assets/pic-2.png" alt="Profile Picture" class="profile-picture" />
      <h2 class="profile-name">{{ profile.full_name || 'No Name Found' }}</h2>
      <p class="profile-role">{{ profile.role || 'No Role Found' }}</p>
      <!-- Add router-link for updating the profile -->
      <router-link :to="`/update/${$route.params.id}`" class="btn update-profile-btn">
        Update Profile
      </router-link>
    </div>

    <br />
    <br />
    <br />
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        full_name: '',
        role: ''
      },
      stats: {
        assignmentsCompleted: 0,
        coursesEnrolled: 0,
        quizzesTaken: 0
      }
    }
  },
  methods: {
    async fetchProfileData() {
      const id = this.$route.params.id // Get user ID from route params
      const userId = localStorage.getItem('userId') // Get current logged-in user ID

      if (!userId) {
        alert('You must be logged in to access your profile.')
        this.$router.push('/login') // Redirect to login if not authenticated
        return
      }

      if (parseInt(userId, 10) !== parseInt(id, 10)) {
        alert('Access denied: You can only access your own profile.')
        this.$router.push('/') // Redirect to home page if unauthorized
        return
      }

      try {
        const response = await axios.get(`/profile/fetch/${id}`, {
          params: { userId } // Pass userId as a query parameter
        })
        this.profile = response.data

        // Mocked stats for now, replace with real API calls if available
        this.stats = {
          assignmentsCompleted: 5,
          coursesEnrolled: 3,
          quizzesTaken: 8
        }
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message)
        this.profile.full_name = 'No Name Found'
        this.profile.role = 'No Role Found'
        alert('Failed to fetch profile data. Please try again.')
      }
    }
  },
  mounted() {
    this.fetchProfileData()
  }
}
</script>

<style scoped>
.profile-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  text-align: center;
}

body.dark-mode .profile-main {
  background-color: #333232;
  border: 2px solid #555;
  color: #e0e0e0;
}

.section-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
}

body.dark-mode .section-title {
  color: #e0e0e0;
}

.profile-card {
  background-color: #fff;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
}

body.dark-mode .profile-card {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

.profile-picture {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

body.dark-mode .profile-picture {
  border: 2px solid #555; /* Optional, adds a subtle border in dark mode */
}

.profile-name {
  font-size: 1.2em;
  margin: 0;
  color: #333;
}

body.dark-mode .profile-name {
  color: #e0e0e0;
}

.profile-role {
  color: #888;
  font-size: 0.9em;
}

body.dark-mode .profile-role {
  color: #aaa;
}

.update-profile-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

body.dark-mode .update-profile-btn {
  background-color: #0056b3;
  color: #fff;
}

/* Responsive styles for smaller screens */
@media (max-width: 600px) {
  .profile-main {
    padding: 10px;
  }
}
</style>
