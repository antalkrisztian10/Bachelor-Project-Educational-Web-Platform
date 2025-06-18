<template>
  <div class="all-professors-container">
    <h1>Professors</h1>
    <div class="professors-grid">
      <div v-for="professor in professors" :key="professor.id" class="professor-card">
        <h2 class="professor-name">{{ professor.name }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'AllProfessorsView',
  data() {
    return {
      professors: [] // To store the list of professors
    }
  },
  methods: {
    async fetchProfessors() {
      try {
        const response = await axios.get('/professors')
        this.professors = response.data
      } catch (error) {
        console.error('Error fetching professors:', error.response?.data || error.message)
        alert('Failed to load professors. Please try again later.')
      }
    }
  },
  mounted() {
    this.fetchProfessors() // Fetch professors when the component is mounted
  }
}
</script>

<style scoped>
.all-professors-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3);
  transition:
    background-color 0.3s,
    color 0.3s;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.professors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.professor-card {
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  padding: 20px;
  width: 200px; /* Ensure uniform square card dimensions */
  height: 100px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex; /* Use flexbox to center the content */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background-color 0.3s,
    color 0.3s;
}

.professor-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.professor-name {
  font-size: 1.2em;
  color: #333;
  margin: 0; /* Remove margin to properly center the text */
}

/* Dark mode styles */
body.dark-mode .all-professors-container {
  background-color: #333;
  color: #f0f0f0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

body.dark-mode h1 {
  color: #f0f0f0;
}

body.dark-mode .professor-card {
  background-color: #444;
  border: 1px solid #555;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

body.dark-mode .professor-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

body.dark-mode .professor-name {
  color: #f0f0f0;
}
</style>
