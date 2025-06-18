<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #007bff">
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between w-100">
        <!-- Brand / Logo -->
        <a style="all: unset">
          <img src="@/assets/EduCore.png" alt="EduCore Logo" height="100" style="display: block" />
        </a>

        <!-- Action Buttons (hidden when search box expands on small screens) -->
        <div class="d-flex align-items-center justify-content-end flex-wrap">
          <!-- Sun Icon Button -->
          <button
            class="btn btn-light text-primary ms-2"
            type="button"
            style="padding: 8px"
            @click="toggleDarkMode"
          >
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
</template>

<script>
export default {
  name: 'NavbarStudent',
  data() {
    return {
      isSmallScreen: window.innerWidth < 768,
      isDarkMode: localStorage.getItem('darkMode') === 'true' // Load dark mode state from localStorage
    }
  },
  methods: {
    toggleOffcanvas() {
      this.offcanvasOpen = !this.offcanvasOpen
      this.$emit('toggle-offcanvas')
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
.navbar {
  margin-bottom: 20px;
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  z-index: 1030;
}

/* Flex container for aligning the action buttons properly */
.d-flex.align-items-center {
  display: flex;
  align-items: center;
  justify-content: end;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 1050;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* Customize the offcanvas */
.custom-offcanvas {
  position: fixed;
  top: 70px; /* Adjust based on navbar height */
  left: -220px; /* Start off-screen */
  width: 220px; /* Adjust width */
  height: calc(100% - 70px); /* Full height minus navbar */
  background-color: white;
  z-index: 1040;
  transition: left 0.3s ease-in-out;
  border-right: 2px solid #ccc; /* Add vertical line (border) */
}

/* When the offcanvas is active, slide it into view */
.custom-offcanvas.active {
  left: 0;
}

.offcanvas-body {
  padding: 15px;
}

/* Search bar behavior */
.search-icon {
  display: inline-block;
}

.search-input {
  display: none;
}

.search-container.expand .search-input {
  display: inline-block;
  width: 150px;
  margin-left: 10px;
}

.search-container.expand .search-icon {
  display: none;
}

/* Button to collapse search */
.close-search {
  margin-left: 10px;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  /* Show full search bar on larger screens */
  .search-input {
    display: inline-block;
  }

  .search-icon {
    display: none; /* Hide search icon on larger screens */
  }
}

/* Adjust the navbar buttons and layout for smaller screens */
@media (max-width: 768px) {
  .navbar .d-flex.align-items-center {
    justify-content: space-between; /* Adjust button positioning */
    width: 100%;
  }

  .search-container {
    justify-content: flex-end;
  }
}

.navbar-nav .nav-link i {
  color: #007afe; /* Purple color */
  font-size: 20px;
  margin-right: 8px;
}

/* Dark mode styles */
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
}

body.dark-mode .dropdown-menu {
  background-color: #444;
  color: #e0e0e0;
}

body.dark-mode .dropdown-menu .dropdown-item {
  color: #ffffff; /* Make text white in dark mode */
}

body.dark-mode .dropdown-menu .dropdown-item:hover {
  background-color: #555; /* Optional hover effect for dark mode */
  color: #ffffff; /* Keep text white on hover */
}

body.dark-mode .btn-light {
  background-color: #555;
  color: #e0e0e0;
}
</style>
