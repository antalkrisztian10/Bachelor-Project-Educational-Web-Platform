<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #007bff">
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between w-100">
        <!-- Brand / Logo -->
        <router-link to="/admin_student" class="d-inline-block" style="all: unset; cursor: pointer">
          <img src="@/assets/EduCore.png" alt="EduCore Logo" height="100" style="display: block" />
        </router-link>

        <!-- Action Buttons (hidden when search box expands on small screens) -->
        <div
          class="d-flex align-items-center justify-content-end flex-wrap"
          v-if="!isSearchExpanded || !isSmallScreen"
        >
          <!-- Offcanvas Toggle Button -->
          <button class="btn btn-light text-primary" type="button" @click="toggleOffcanvas">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-4a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-4a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z"
              />
            </svg>
          </button>

          <!-- Person Icon Dropdown -->
          <div class="dropdown ms-2">
            <button class="btn btn-light text-primary" type="button" @click="toggleDropdown">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1a5.978 5.978 0 0 0-4.546 2.14C3.75 12.961 4.847 14 6 14h4c1.153 0 2.25-1.039 2.546-2.86A5.978 5.978 0 0 0 8 9z"
                />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="dropdown-menu" :class="{ show: dropdownOpen }">
              <router-link :to="`/profile/${userId}`" class="dropdown-item"
                >View Profile</router-link
              >
              <router-link to="/login" class="dropdown-item" @click="signOut">Sign Out</router-link>
            </div>
          </div>

          <!-- Sun Icon Button -->
          <button class="btn btn-light text-primary ms-2" type="button" @click="toggleDarkMode">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="20"
              fill="currentColor"
              class="bi bi-sun"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Offcanvas Menu -->
  <div
    class="custom-offcanvas"
    :class="{ active: offcanvasOpen }"
    tabindex="-1"
    aria-labelledby="offcanvasNavbarLabel"
  >
    <div class="offcanvas-header"></div>
    <div class="offcanvas-body">
      <!-- Profile Section with Image and Button -->
      <div class="text-center mb-4">
        <img src="@/assets/pic-2.png" alt="Profile Picture" style="width: 70px" />
        <h5 class="mt-2">{{ adminName }}</h5>
        <p class="mt-2">Admin</p>
        <router-link :to="`/profile/${userId}`" class="btn btn-primary">View Profile</router-link>
      </div>

      <!-- Menu Items -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin_student">
            <i class="fas fa-user-graduate"></i> Students
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin_professor">
            <i class="fas fa-graduation-cap"></i> Professors
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin_course">
            <i class="fas fa-book"></i> Courses
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin_announcement">
            <i class="fas fa-headset"></i> Announcements
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/requests">
            <i class="fas fa-envelope"></i> Requests
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'NavbarAdmin',
  data() {
    return {
      userId: null, // Initialize userId
      adminName: '', // Admin's name to display
      offcanvasOpen: false,
      isSearchExpanded: false,
      dropdownOpen: false,
      isSmallScreen: window.innerWidth < 768,
      isDarkMode: localStorage.getItem('darkMode') === 'true' // Load dark mode state from localStorage
    }
  },
  methods: {
    signOut() {
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      localStorage.removeItem('authToken')
      localStorage.removeItem('studyBuddyChat')
    },
    toggleOffcanvas() {
      this.offcanvasOpen = !this.offcanvasOpen
      this.$emit('toggle-offcanvas')

      // Ensure the offcanvas menu is properly visible and prevents overlap issues
      const offcanvas = document.querySelector('.custom-offcanvas')
      if (offcanvas) {
        if (this.offcanvasOpen) {
          offcanvas.style.left = '0' // Ensure it's fully visible
          offcanvas.style.zIndex = '1040' // Keep it on top of other elements
          offcanvas.style.position = 'fixed' // Make sure it stays in place
        } else {
          offcanvas.style.left = '-220px' // Move it back off-screen
          offcanvas.style.zIndex = '' // Reset to default
          offcanvas.style.position = '' // Reset to default
        }
      }
    },
    async fetchAdminName() {
      if (!this.userId) {
        console.error('User ID is not set. Cannot fetch admin name.')
        this.adminName = 'Error Loading Name'
        return
      }

      try {
        // Pass userId as a query parameter
        const response = await axios.get(`/profile/fetch/${this.userId}`, {
          params: { userId: this.userId }
        })
        this.adminName = response.data.full_name || 'Unknown Admin'
      } catch (error) {
        console.error('Error fetching admin name:', error.response?.data || error.message)
        this.adminName = 'Error Loading Name'
      }
    },
    toggleSearch() {
      if (this.isSmallScreen) {
        this.isSearchExpanded = !this.isSearchExpanded
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth < 768
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      document.body.classList.toggle('dark-mode', this.isDarkMode)
      localStorage.setItem('darkMode', this.isDarkMode)
    }
  },
  mounted() {
    this.userId = localStorage.getItem('userId') || this.$store.state.user?.id

    if (this.userId) {
      this.fetchAdminName() // Fetch name only after userId is set
    } else {
      console.error('User ID not found in localStorage or store.')
    }

    window.addEventListener('resize', this.handleResize)
    document.body.classList.toggle('dark-mode', this.isDarkMode) // Apply dark mode on mount
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  emits: ['toggle-offcanvas']
}
</script>

<style scoped>
/* Navbar Container */
.navbar {
  margin-bottom: 20px;
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  z-index: 1030;
  transition: background-color 0.3s ease;
}

/* Replace the previous media query with this more subtle responsive approach */
@media (max-width: 992px) {
  .navbar {
    /* Keep the same fixed height as desktop */
    height: 70px;
    /* Just add a bit of padding for touch targets */
    padding: 0 10px;
  }

  /* Keep horizontal layout but optimize spacing */
  .d-flex.align-items-center.justify-content-between {
    gap: 8px; /* Tighten the gap between elements */
  }

  /* Make logo slightly smaller */
  .navbar img[alt='EduCore Logo'] {
    height: 60px;
  }

  /* Make search container more compact */
  .search-container {
    width: auto;
    min-width: 150px;
    margin: 0 5px;
  }

  /* Make buttons more compact but still touchable */
  .navbar .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    width: 38px;
    padding: 0;
  }

  .navbar .btn svg {
    width: 24px;
    height: 24px;
  }
}

/* These styles stay the same for all screen sizes */
.search-container {
  position: relative;
  width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

/* Flex container for aligning action buttons */
.d-flex.align-items-center {
  display: flex;
  align-items: center;
  justify-content: end;
}

/* Dropdown Menu with smooth fade-in */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 1050;
  transition: all 0.3s ease;
}

.dropdown-menu.show {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: scale(1.02);
}

/* Offcanvas Menu with smooth slide-in */
.custom-offcanvas {
  position: fixed;
  top: 70px;
  left: -220px;
  width: 220px;
  height: calc(100% - 70px);
  background-color: white;
  z-index: 1040;
  transition:
    left 0.3s ease-in-out,
    opacity 0.3s ease;
  border-right: 2px solid #ccc;
  opacity: 0;
}

.custom-offcanvas.active {
  left: 0;
  opacity: 1;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.offcanvas-body {
  padding: 15px;
}

/* Search bar behavior */
.search-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.search-icon:hover {
  transform: scale(1.1);
}

.search-input {
  display: none;
  transition: width 0.3s ease;
}

.search-container.expand .search-input {
  display: inline-block;
  width: 150px;
  margin-left: 10px;
}

.search-container.expand .search-icon {
  display: none;
}

.close-search {
  margin-left: 10px;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .search-input {
    display: inline-block;
  }
  .search-icon {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar .d-flex.align-items-center {
    justify-content: space-between;
    width: 100%;
  }
  .search-container {
    justify-content: flex-end;
  }
}

/* Navbar icons */
/* For the nav-item container (e.g., the <li> element) */
.navbar-nav .nav-item {
  display: inline-block; /* Ensures the transform works properly */
  transition: transform 0.3s ease;
}

.navbar-nav .nav-item:hover {
  transform: scale(1.05);
}

/* For the link within the nav-item */
.navbar-nav .nav-link {
  display: inline-block; /* Enable transform */
  transition: color 0.3s ease;
}

/* For the icon within the nav-link */
.navbar-nav .nav-link i {
  display: inline-block; /* Enable transform */
  color: #007afe;
  font-size: 15px;
  margin-right: 8px;
  transition: transform 0.3s ease;
}

.navbar-nav .nav-link i:hover {
  transform: scale(1);
}

/* Button transitions for modern feel */
.btn,
.btn-light {
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.btn:hover,
.btn-light:hover {
  transform: scale(1.05);
}

/* Dark Mode */
body.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

body.dark-mode .navbar {
  background-color: #333;
}

body.dark-mode .custom-offcanvas {
  background-color: #333;
  color: #e0e0e0;
  border-right: 2px solid #555;
}

body.dark-mode .dropdown-menu {
  background-color: #444;
  color: #e0e0e0;
}

body.dark-mode .dropdown-menu .dropdown-item {
  color: #ffffff;
}

body.dark-mode .dropdown-menu .dropdown-item:hover {
  background-color: #555;
  color: #ffffff;
}

body.dark-mode .btn-light {
  background-color: #555;
  color: #e0e0e0;
}

body.dark-mode input[type='search'] {
  color: white;
  background-color: #555;
  border: 1px solid #ffffff;
}

body.dark-mode input[type='search']::placeholder {
  color: #dbdbdb;
}

/* The dropdown container */
.search-results-dropdown {
  position: absolute;
  top: 100%; /* Align directly below the search bar */
  left: 50%; /* Start at the center */
  transform: translateX(-50%); /* Center the dropdown */
  width: auto; /* Match the width of the search bar */
  min-width: 150px; /* Ensure it has a minimum width */
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 250px; /* Optional scroll limit */
  overflow-y: auto; /* Enable scrolling if many results */
}

/* The list inside the dropdown */
.search-results-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Each item */
.search-results-dropdown li {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

/* Last item style if you want to remove border */
.search-results-dropdown li:last-child {
  border-bottom: none;
}

/* Hover effect */
.search-results-dropdown li:hover {
  background-color: #f0f0f0;
}

/* Additional styling for dark mode */
body.dark-mode .search-results-dropdown {
  background: #333;
  color: #f0f0f0;
  border-color: #555;
}

body.dark-mode .search-results-dropdown li {
  border-bottom: 1px solid #555;
}

body.dark-mode .search-results-dropdown li:hover {
  background-color: #444;
}

.search-container {
  position: relative; /* Needed for absolutely positioned dropdown */
  width: 300px; /* Choose the width you want for your search bar */
  margin: 0 auto; /* Center horizontally within the navbar */
}

/* Make the input fill the container's width */
.search-container input {
  width: 100%;
}

/* 2) Dropdown absolutely positioned, same width as container */
.search-results-dropdown {
  position: absolute;
  top: 100%; /* Just below the input */
  left: 50%; /* Center horizontally relative to container */
  transform: translateX(-50%);
  width: 100%; /* Match container width (300px) */
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 300px; /* Optional max height */
  overflow-y: auto; /* Scroll if many results */
}

/* 3) Vertical list styling */
.search-results-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-results-dropdown li {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.search-results-dropdown li:last-child {
  border-bottom: none;
}

.search-results-dropdown li:hover {
  background-color: #f0f0f0;
}

a.navbar-brand,
a.navbar-brand:hover {
  text-decoration: none !important;
  border-bottom: none !important;
}

/* Specific media query for smaller phones (Galaxy S8+ size) */
@media (max-width: 375px) {
  .navbar .btn {
    height: 34px;
    width: 34px;
  }

  .navbar .btn svg {
    width: 20px;
    height: 20px;
  }

  .navbar img[alt='EduCore Logo'] {
    height: 50px; /* Make logo a bit smaller on very small screens */
  }

  .d-flex.align-items-center.justify-content-between {
    gap: 4px; /* Tighter spacing on very small screens */
  }

  /* Reduce margins between buttons on very small screens */
  .navbar .ms-2 {
    margin-left: 0.25rem !important;
  }
}

/* Ensure no height differences between icons */
.navbar .bi-person,
.navbar .bi-list,
.navbar .bi-sun,
.navbar .bi-search,
.navbar .bi-x {
  vertical-align: middle;
  line-height: 1;
}

/* Medium-small screens (375px-399px) */
@media (min-width: 376px) and (max-width: 400px) {
  .navbar .btn {
    height: 35px;
    width: 35px;
  }

  .navbar .btn svg {
    width: 22px;
    height: 22px;
  }

  .navbar img[alt='EduCore Logo'] {
    height: 55px;
  }

  .d-flex.align-items-center.justify-content-between {
    gap: 6px;
  }

  .navbar .ms-2 {
    margin-left: 0.25rem !important;
  }
}

/* Very small screens (360px and below) */
@media (max-width: 360px) {
  .navbar {
    padding: 0 5px;
  }

  .navbar .btn {
    height: 32px;
    width: 32px;
  }

  .navbar .btn svg {
    width: 18px;
    height: 18px;
  }

  .navbar img[alt='EduCore Logo'] {
    height: 45px;
  }

  .d-flex.align-items-center.justify-content-between {
    gap: 3px;
  }

  /* Minimize margins at very small sizes */
  .navbar .ms-2 {
    margin-left: 0.125rem !important;
  }

  /* Make search container more compact */
  .search-container {
    min-width: 120px;
    margin: 0 2px;
  }
}
</style>
