import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoursesView from '../views/CoursesView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import ViewCourse from '@/views/ViewCourse.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CoursesViewProf from '@/views/CoursesViewProf.vue'
import ViewCourseProf from '@/views/ViewCourseProf.vue'
import AdminStudents from '@/views/AdminStudents.vue'
import EditStudent from '@/views/EditStudent.vue'
import AdminProfessors from '@/views/AdminProfessors.vue'
import EditProfessor from '@/views/EditProfessor.vue'
import AdminAnnouncements from '@/views/AdminAnnouncements.vue'
import EditAnnouncement from '@/views/EditAnnouncement.vue'
import AdminCourses from '@/views/AdminCourses.vue'
import EditCourse from '@/views/EditCourse.vue'
import LessonView from '@/views/LessonView.vue'
import QuizView from '@/views/QuizView.vue'
import MeetingView from '@/views/MeetingView.vue'
import AssignmentView from '@/views/AssignmentView.vue'
import AddAssignment from '@/views/AddAssignment.vue'
import CreateProf from '@/views/CreateProf.vue'
import LessonViewProf from '@/views/LessonViewProf.vue'
import QuizViewProf from '@/views/QuizViewProf.vue'
import MeetingViewProf from '@/views/MeetingViewProf.vue'
import AssignmentViewProf from '@/views/AssignmentViewProf.vue'
import AnnouncementView from '@/views/AnnouncementView.vue'
import AllProfessorsView from '@/views/AllProfessorsView.vue'
import UpdateProfile from '@/views/UpdateProfile.vue'
import RequestsView from '@/views/RequestsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // Redirect root URL to login
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Requires authentication
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
      meta: { requiresAuth: true, role: 'Student' } // Role-specific access
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true } // Requires authentication
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { requiresAuth: true } // Requires authentication
    },
    {
      path: '/view/:id',
      name: 'view',
      component: ViewCourse,
      props: true, // Pass the ID as a prop to the component
      meta: { requiresAuth: true, role: 'Student' } // Student-only
    },
    {
      path: '/viewp/:id', // Dynamic route for course ID
      name: 'viewp',
      component: ViewCourseProf,
      meta: { requiresAuth: true, role: 'Professor' }, // Professor-only
      props: true // Pass route params as props
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: ProfilePage,
      meta: { requiresAuth: true }, // Requires authentication
      props: true // Pass `id` as a prop
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/coursesp',
      name: 'coursesp',
      component: CoursesViewProf,
      meta: { requiresAuth: true, role: 'Professor' } // Professor-only
    },
    {
      path: '/admin_student',
      name: 'admin_student',
      component: AdminStudents,
      meta: { requiresAuth: true, role: 'Admin' } // Admin-only
    },
    {
      path: '/edit_student/:id',
      name: 'edit_student',
      component: EditStudent,
      meta: { requiresAuth: true, role: 'Admin' }, // Admin-only
      props: true // Pass route params as props
    },
    {
      path: '/admin_professor',
      name: 'admin_professor',
      component: AdminProfessors,
      meta: { requiresAuth: true, role: 'Admin' } // Admin-only
    },
    {
      path: '/edit_professor/:id',
      name: 'edit_professor',
      component: EditProfessor,
      meta: { requiresAuth: true, role: 'Admin' }, // Admin-only
      props: true // Pass route params as props
    },
    {
      path: '/admin_announcement',
      name: 'admin_announcement',
      component: AdminAnnouncements,
      meta: { requiresAuth: true, role: 'Admin' } // Admin-only
    },
    {
      path: '/edit_announcement/:id',
      name: 'edit_announcement',
      component: EditAnnouncement,
      meta: { requiresAuth: true, role: 'Admin' }, // Admin-only
      props: true // Pass route params as props
    },
    {
      path: '/admin_course',
      name: 'admin_course',
      component: AdminCourses,
      meta: { requiresAuth: true, role: 'Admin' } // Admin-only
    },
    {
      path: '/edit_course/:id',
      name: 'edit_course',
      component: EditCourse,
      meta: { requiresAuth: true, role: 'Admin' }, // Admin-only
      props: true // Pass route params as props
    },
    {
      path: '/lesson/:id', // Dynamic route for lesson ID
      name: 'lesson',
      component: LessonView,
      meta: { requiresAuth: true, role: 'Student' }, // Student-only
      props: true // Pass route params as props
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: QuizView,
      meta: { requiresAuth: true, role: 'Student' }, // Student-only
      props: true // Pass route params as props
    },
    {
      path: '/meeting/:id',
      name: 'meeting',
      component: MeetingView,
      meta: { requiresAuth: true, role: 'Student' }, // Student-only
      props: true // Pass route params as props
    },
    {
      path: '/assignment/:id',
      name: 'assignment',
      component: AssignmentView,
      meta: { requiresAuth: true, role: 'Student' }, // Student-only
      props: true // Pass route params as props
    },
    {
      path: '/add_assignment',
      name: 'add_assignment',
      component: AddAssignment,
      meta: { requiresAuth: true, role: 'Professor' } // Professor-only
    },
    {
      path: '/create/:id', // Dynamic route for course ID
      name: 'create',
      component: CreateProf,
      meta: { requiresAuth: true, role: 'Professor' }, // Professor-only
      props: true // This ensures the `id` parameter is passed as a prop
    },
    {
      path: '/lessonp/:id', // Dynamic route for lesson ID
      name: 'lessonp',
      component: LessonViewProf,
      meta: { requiresAuth: true, role: 'Professor' }, // Professor-only
      props: true // This ensures the `id` parameter is passed as a prop
    },
    {
      path: '/quizp/:id', // Dynamic route for quiz ID
      name: 'quizp',
      component: QuizViewProf,
      meta: { requiresAuth: true, role: 'Professor' },
      props: true // Ensure the `id` parameter is passed as a prop
    },
    {
      path: '/meetingp/:id', // Dynamic route for meeting ID
      name: 'meetingp',
      component: MeetingViewProf,
      meta: { requiresAuth: true, role: 'Professor' }, // Only for professors
      props: true // Pass route params as props
    },
    {
      path: '/assignmentp/:id', // Dynamic route for assignment ID
      name: 'assignmentp',
      component: AssignmentViewProf,
      meta: { requiresAuth: true, role: 'Professor' }, // Only for professors
      props: true // Pass route params as props
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: AnnouncementView,
      meta: { requiresAuth: true } // Requires authentication
    },
    {
      path: '/professors',
      name: 'professors',
      component: AllProfessorsView,
      meta: { requiresAuth: true } // Requires authentication
    },
    {
      path: '/update/:id',
      name: 'UpdateProfile',
      component: UpdateProfile,
      meta: { requiresAuth: true }, // Requires authentication
      props: true // Pass `id` as a prop
    },
    {
      path: '/requests',
      name: 'requests',
      component: RequestsView,
      meta: { requiresAuth: true }, // Requires authentication
      props: true
    }
  ]
})

// Add navigation guard for authentication and role-based access
router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !authToken) {
    return next('/login')
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return next('/home') // Redirect to home or appropriate page
  }

  next()
})

export default router
