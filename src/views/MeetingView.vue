<template>
  <div class="meeting-view-container">
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Meeting Details -->
    <div class="meeting-details">
      <h2>Meeting Title</h2>
      <p class="meeting-text">{{ meetingTitle }}</p>

      <h2>Meeting Description</h2>
      <p class="meeting-text">{{ meetingDescription }}</p>

      <h2>Meeting Link</h2>
      <p class="meeting-text">
        {{ meetingLink }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'MeetingViewStudent',
  props: ['id'], // Meeting ID passed through route
  data() {
    return {
      courseTitle: '', // Course title
      meetingTitle: '', // Meeting title
      meetingDescription: '', // Meeting description
      meetingLink: '' // Meeting link
    }
  },
  methods: {
    async fetchMeetingDetails() {
      const meetingId = this.$route.params.id
      const userId = localStorage.getItem('userId') // Fetch userId from localStorage

      if (!userId) {
        console.error('Error: User ID is missing')
        alert('Failed to load meeting details. User ID is missing.')
        return
      }

      try {
        const response = await axios.get(`/meetings/${meetingId}/student`, {
          params: { userId }
        })
        const { title, description, meeting_link, courseTitle } = response.data

        this.meetingTitle = title
        this.meetingDescription = description
        this.meetingLink = meeting_link
        this.courseTitle = courseTitle
      } catch (error) {
        console.error('Error fetching meeting details:', error.response?.data || error.message)
        if (error.response?.status === 403) {
          alert('Access denied: You are not enrolled in this course.')
          this.$router.push('/home')
        } else {
          alert('Failed to load meeting details. Please try again.')
        }
      }
    }
  },
  mounted() {
    this.fetchMeetingDetails()
  }
}
</script>

<style scoped>
.meeting-view-container {
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

.meeting-details h2 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.meeting-text {
  font-size: 1em;
  color: #555;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.meeting-link {
  font-size: 1em;
  color: #007bff;
  text-decoration: none;
  word-break: break-word;
}

.meeting-link:hover {
  text-decoration: underline;
}

/* Dark Mode */
body.dark-mode .meeting-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
}

body.dark-mode .meeting-text {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .meeting-link {
  color: #4a90e2;
}

body.dark-mode .meeting-link:hover {
  color: #82caff;
}
</style>
