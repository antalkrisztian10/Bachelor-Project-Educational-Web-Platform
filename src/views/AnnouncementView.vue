<template>
  <div class="announcement-container">
    <h1 class="announcement-title">Announcements</h1>
    <div v-if="announcements.length === 0" class="no-announcements">
      No announcements available.
    </div>
    <div v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
      <p class="announcement-meta">
        Created: {{ new Date(announcement.date_created).toLocaleDateString() }}
      </p>
      <p class="announcement-title">{{ announcement.title }}</p>
      <p class="announcement-content">
        {{ announcement.content }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AnnouncementView',
  data() {
    return {
      announcements: [] // Dynamically fetched announcements
    }
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const response = await axios.get('/announcements')
        this.announcements = response.data
      } catch (error) {
        console.error('Error fetching announcements:', error.response?.data || error.message)
        alert('Failed to load announcements. Please try again later.')
      }
    }
  },
  mounted() {
    this.fetchAnnouncements()
  }
}
</script>

<style scoped>
.announcement-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.announcement-title {
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.no-announcements {
  text-align: center;
  font-size: 1.2em;
  color: #666;
}

.announcement-card {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.announcement-meta {
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
}

.announcement-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.announcement-content {
  color: #333;
}

/* Dark Mode */
body.dark-mode .announcement-container {
  background-color: #333;
  color: #f0f0f0;
  border: 1px solid #1e1d1d;
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3);
}

body.dark-mode .announcement-card {
  background-color: #444;
  border-color: #555;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.3);
}

body.dark-mode .announcement-meta {
  color: #bbb;
}

body.dark-mode .announcement-title {
  color: #f0f0f0;
}

body.dark-mode .announcement-content {
  color: #f0f0f0;
}
</style>
