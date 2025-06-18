<template>
  <div class="meeting-view-container">
    <h1 class="course-title">{{ courseTitle }}</h1>

    <!-- Meeting Details -->
    <div class="meeting-details">
      <h2>Meeting Title</h2>
      <input type="text" v-model="meetingTitle" placeholder="Meeting Title" class="meeting-input" />

      <h2>Meeting Description</h2>
      <textarea
        v-model="meetingDescription"
        placeholder="Meeting Description"
        class="meeting-textarea"
      ></textarea>

      <h2>Meeting Link</h2>
      <textarea
        v-model="meetingLink"
        placeholder="Meeting Link"
        class="meeting-textarea"
      ></textarea>
    </div>

    <!-- Save Button -->
    <button class="finish-button" @click="saveMeetingDetails">Finish</button>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'MeetingViewProf',
  props: ['id'], // Meeting ID passed through route
  data() {
    return {
      courseTitle: '', // Course title
      meetingTitle: '', // Meeting title
      meetingDescription: '', // Meeting description
      meetingLink: '', // Meeting link
      errorMessage: '' // Holds error messages, if any
    }
  },
  methods: {
    async fetchMeetingDetails() {
      try {
        const userId = localStorage.getItem('userId') // Fetch userId from localStorage
        if (!userId) {
          throw new Error('User ID is missing') // Handle missing userId
        }

        console.log('Fetching meeting details with userId:', userId)

        // Send request to fetch meeting details with userId as a query parameter
        const response = await axios.get(`/meetings/${this.id}`, {
          params: { userId }
        })

        console.log('Meeting details response:', response.data)

        const meeting = response.data

        // Populate the data
        this.courseTitle = meeting.courseTitle
        this.meetingTitle = meeting.title
        this.meetingDescription = meeting.description
        this.meetingLink = meeting.meeting_link
      } catch (error) {
        console.error('Error fetching meeting details:', error.response?.data || error.message)
        this.errorMessage =
          error.response?.data?.message || 'Failed to load meeting details. Please try again.'
        alert(this.errorMessage) // Display error message to the user
      }
    },
    async saveMeetingDetails() {
      try {
        const userId = localStorage.getItem('userId') // Fetch userId from localStorage
        if (!userId) {
          throw new Error('User ID is missing') // Handle missing userId
        }

        console.log('Saving meeting details with userId:', userId)

        // Send a PUT request to update meeting details with userId included
        const response = await axios.put(`/meetings/${this.id}`, {
          title: this.meetingTitle,
          description: this.meetingDescription,
          meeting_link: this.meetingLink,
          userId // Include userId in the request body
        })

        alert(response.data.message || 'Meeting details have been saved!')
      } catch (error) {
        console.error('Error saving meeting details:', error.response?.data || error.message)

        const message =
          error.response?.data?.message || 'Failed to save meeting details. Please try again.'

        alert(message)
        this.$router.push('/home')

        if (error.response && error.response.status === 403) {
          this.$router.push('/home')
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

.meeting-input,
.meeting-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.meeting-textarea {
  resize: none;
  height: 100px;
}

.finish-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.finish-button:hover {
  background-color: #0056b3;
}

/* Dark Mode */
body.dark-mode .meeting-view-container {
  background-color: #333;
  color: #f0f0f0;
  border: 2px solid #444;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode .meeting-input,
body.dark-mode .meeting-textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .finish-button {
  background-color: #0056b3;
}

body.dark-mode .finish-button:hover {
  background-color: #003f8a;
}
</style>
