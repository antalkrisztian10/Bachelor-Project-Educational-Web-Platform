<template>
  <div class="edit-announcement-container">
    <h1>Edit Announcement</h1>
    <div class="form-container">
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="announcement.title" required />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" v-model="announcement.content" required></textarea>
        </div>

        <div class="form-group">
          <label for="dateCreated">Date Created</label>
          <input type="date" id="dateCreated" v-model="formattedDate" required />
        </div>

        <button type="submit" class="update-button">Update Announcement</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios' // Adjust the import based on your project structure

export default {
  name: 'EditAnnouncement',
  props: ['id'], // Accept route param as prop
  data() {
    return {
      announcement: {
        id: '',
        title: '',
        content: '',
        date_created: ''
      }
    }
  },
  computed: {
    formattedDate: {
      get() {
        return this.announcement.date_created
          ? new Date(this.announcement.date_created).toISOString().split('T')[0]
          : ''
      },
      set(value) {
        this.announcement.date_created = value
      }
    }
  },
  mounted() {
    this.fetchAnnouncementData()
  },
  methods: {
    async fetchAnnouncementData() {
      try {
        const response = await axios.get(`/admin/announcements/${this.id}`)
        this.announcement = response.data
      } catch (error) {
        console.error('Error fetching announcement:', error.response?.data || error.message)
      }
    },
    async handleUpdate() {
      try {
        await axios.put(`/admin/announcements/${this.id}`, this.announcement)
        alert('Announcement updated successfully!')
        this.$router.push('/admin_announcement') // Redirect to the announcements page
      } catch (error) {
        console.error('Error updating announcement:', error.response?.data || error.message)
      }
    }
  }
}
</script>

<style scoped>
.edit-announcement-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
}

/* Form styles */
.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input[type='text'],
input[type='date'],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

textarea {
  resize: vertical;
}

.update-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.update-button:hover {
  background-color: #0056b3;
}

/* Dark mode styles */
body.dark-mode .edit-announcement-container {
  background-color: #333;
  color: #e0e0e0;
}

body.dark-mode label {
  color: #e0e0e0;
}

body.dark-mode input[type='text'],
body.dark-mode input[type='date'],
body.dark-mode textarea {
  background-color: #444;
  color: #e0e0e0;
  border: 1px solid #555;
}

body.dark-mode .update-button {
  background-color: #007bff;
}

body.dark-mode .update-button:hover {
  background-color: #0056b3;
}

body.dark-mode .edit-announcement-container h1 {
  color: #e0e0e0;
}
</style>
