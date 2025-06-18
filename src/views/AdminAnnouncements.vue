<template>
  <div class="admin-announcements-container">
    <h1>Manage Announcements</h1>

    <!-- Add Announcement Button -->
    <button class="add-announcement-button" @click="openAddAnnouncementModal">
      Add Announcement
    </button>

    <div class="table-container">
      <table class="announcements-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="announcement in announcements" :key="announcement.id">
            <td>{{ announcement.id }}</td>
            <td>{{ announcement.title }}</td>
            <td>{{ announcement.content.substring(0, 30) }}...</td>
            <!-- Format the date -->
            <td>{{ formatDate(announcement.date_created) }}</td>
            <td>
              <button class="edit-button" @click="editAnnouncement(announcement.id)">Edit</button>
              <button class="delete-button" @click="deleteAnnouncement(announcement.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Announcement Modal -->
    <div v-if="showAddAnnouncementModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Announcement</h2>
        <form @submit.prevent="addAnnouncement">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newAnnouncement.title" required />
          </div>
          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" v-model="newAnnouncement.content" required></textarea>
          </div>
          <button type="submit" class="save-button">Save</button>
          <button type="button" class="cancel-button" @click="closeAddAnnouncementModal">
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios' // Adjust the import based on your API setup

export default {
  name: 'AdminAnnouncements',
  data() {
    return {
      announcements: [], // Announcements fetched from the backend
      showAddAnnouncementModal: false,
      newAnnouncement: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    // Fetch announcements from the backend
    async fetchAnnouncements() {
      try {
        const response = await axios.get('/admin/announcements')
        this.announcements = response.data
      } catch (error) {
        console.error('Error fetching announcements:', error.response?.data || error.message)
      }
    },

    // Format date to 'YYYY-MM-DD'
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toISOString().split('T')[0]
    },

    // Open the Add Announcement modal
    openAddAnnouncementModal() {
      this.showAddAnnouncementModal = true
    },

    // Close the Add Announcement modal
    closeAddAnnouncementModal() {
      this.showAddAnnouncementModal = false
      this.resetNewAnnouncement()
    },

    // Reset the new announcement form
    resetNewAnnouncement() {
      this.newAnnouncement = {
        title: '',
        content: ''
      }
    },

    // Add a new announcement
    async addAnnouncement() {
      try {
        const response = await axios.post('/admin/announcements', this.newAnnouncement)
        this.announcements.push(response.data)
        this.closeAddAnnouncementModal()
      } catch (error) {
        console.error('Error adding announcement:', error.response?.data || error.message)
      }
    },

    // Delete an announcement
    async deleteAnnouncement(id) {
      try {
        await axios.delete(`/admin/announcements/${id}`)
        this.announcements = this.announcements.filter((announcement) => announcement.id !== id)
      } catch (error) {
        console.error('Error deleting announcement:', error.response?.data || error.message)
      }
    },

    // Edit an announcement (logic to be implemented based on your setup)
    editAnnouncement(id) {
      this.$router.push({ name: 'edit_announcement', params: { id } })
    }
  },
  mounted() {
    this.fetchAnnouncements()
  }
}
</script>

<style scoped>
.admin-announcements-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}

.add-announcement-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
}

.add-announcement-button:hover {
  background-color: #0056b3;
}

/* Table styling */
.table-container {
  overflow-x: auto;
}

.announcements-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.announcements-table th,
.announcements-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

.announcements-table th {
  background-color: #007bff;
  color: #ffffff;
}

.edit-button {
  background-color: #28a745;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-button:hover {
  background-color: #218838;
}

.delete-button {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 5px;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Dark mode styles */
body.dark-mode .announcements-table {
  background-color: #333333;
  color: #f0f0f0;
}

body.dark-mode .announcements-table th {
  background-color: #444;
  color: #e0e0e0;
}

body.dark-mode .announcements-table td {
  border-bottom: 1px solid #555;
}

body.dark-mode .edit-button {
  background-color: #4caf50;
}

body.dark-mode .delete-button {
  background-color: #e53935;
}

body.dark-mode .edit-button:hover {
  background-color: #43a047;
}

body.dark-mode .delete-button:hover {
  background-color: #d32f2f;
}

body.dark-mode .modal-content {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .form-group input,
body.dark-mode .form-group textarea {
  background-color: #444;
  color: #f0f0f0;
  border: 1px solid #555;
}

body.dark-mode .modal-content h2 {
  color: #f0f0f0;
}
</style>
