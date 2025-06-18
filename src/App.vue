<template>
  <div id="app" class="app-container">
    <!-- Conditionally render Navbar based on the route and role -->
    <NavbarLogin v-if="isAuthPage" />
    <component v-else :is="currentNavbar" @toggle-offcanvas="toggleOffcanvas" />

    <div class="main-content">
      <!-- Sidebar (only displayed with non-authentication navbars) -->
      <div v-if="!isAuthPage" class="sidebar" :class="{ active: isOffcanvasOpen }">
        <!-- Sidebar content goes here -->
      </div>

      <!-- Page Content -->
      <div id="content" class="page-content" :class="{ shrink: isOffcanvasOpen && !isAuthPage }">
        <router-view />
      </div>
    </div>
    <!-- Conditionally show the chatbox if user is logged in AND not on quiz page -->
    <FooterChatbot v-if="isLoggedIn && !isQuizPage" />
  </div>
</template>

<script>
import FooterChatbot from '@/components/FooterChatbot.vue'
import NavbarStudent from '@/components/NavbarStudent.vue'
import NavbarProfessor from '@/components/NavbarProfesor.vue'
import NavbarAdmin from '@/components/NavbarAdmin.vue'
import NavbarLogin from '@/components/NavbarLogin.vue'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    NavbarStudent,
    NavbarProfessor,
    NavbarAdmin,
    NavbarLogin,
    FooterChatbot
  },
  setup() {
    const route = useRoute()
    const isOffcanvasOpen = ref(false)

    // Computed property to check if the current route is an authentication page
    const isAuthPage = computed(() => route.name === 'login' || route.name === 'register')

    //Determine if the user is logged in
    const isLoggedIn = computed(() => {
      if (route.path.includes('/login') || route.path.includes('/register')) {
        return false
      }
      return !!localStorage.getItem('token') || !!localStorage.getItem('userRole')
    })

    // 3) Determine if current route is a quiz page
    const isQuizPage = computed(() => {
      return route.path.startsWith('/quiz/')
    })

    // Get the current navbar based on the user's role
    const currentNavbar = computed(() => {
      const role = localStorage.getItem('userRole')
      if (role === 'Student') return 'NavbarStudent'
      if (role === 'Professor') return 'NavbarProfessor'
      if (role === 'Admin') return 'NavbarAdmin'
      return null
    })

    onMounted(() => {
      isOffcanvasOpen.value = false
    })

    const toggleOffcanvas = () => {
      isOffcanvasOpen.value = !isOffcanvasOpen.value
    }

    return {
      isAuthPage,
      currentNavbar,
      isOffcanvasOpen,
      toggleOffcanvas,
      isLoggedIn,
      isQuizPage
    }
  }
}
</script>

<style>
/* Global styles */
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Sidebar styles */
.sidebar {
  width: 0;
  overflow: hidden; /* Prevent content spilling during transition */
  transition:
    width 0.3s ease,
    visibility 0.3s ease;
  visibility: hidden; /* Ensure it's fully hidden when collapsed */
}

.sidebar.active {
  width: 220px; /* Set correct width when open */
  visibility: visible; /* Ensure visibility */
}

/* Content area that adjusts based on sidebar state */
.page-content {
  transition: margin-left 0.3s ease;
  padding: 90px 20px 20px 20px; /* Add padding-top to push content below navbar */
  max-width: 1200px; /* Max-width for the content */
  margin: 0 auto; /* Center content horizontally */
}

.page-content.shrink {
  margin-left: 220px; /* Shift the content when the sidebar is open */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-content.shrink {
    margin-left: 0; /* Don't shift content for smaller screens */
  }
}

body.dark-mode .app-container {
  background-color: #333232;
  color: #e0e0e0;
}

body.dark-mode .sidebar {
  background-color: #333;
}

body.dark-mode .page-content {
  background-color: #333232;
  color: #e0e0e0;
}
</style>
