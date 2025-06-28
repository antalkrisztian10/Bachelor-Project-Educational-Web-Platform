<template>
  <div class="about-container">
    <div class="row align-items-center">
      <!-- Image Section (Left side) -->
      <div class="col-md-6 image-section">
        <img src="@/assets/about-img.png" alt="About Us" class="about-image" />
      </div>

      <!-- Text Section (Right side) -->
      <div class="col-md-6 text-section">
        <h2>Why Choose Us?</h2>
        <p>
          Welcome to <strong>EduCore</strong> – your all-in-one educational platform designed to
          simplify and enhance the learning experience for both students and educators. EduCore
          provides a seamless way to manage courses, assignments, quizzes, and communication, all in
          one modern and intuitive interface.
        </p>
        <p>
          Whether you're a student tracking your progress or a teacher organizing lessons and
          grading work, EduCore offers the tools you need to succeed. With built-in features like
          personalized dashboards, secure file submissions, real-time grading, and smart course
          management, EduCore transforms traditional education into a fully digital, interactive
          experience. Start learning or teaching smarter — join EduCore today and be part of the
          future of education.
        </p>
        <router-link to="/courses" class="btn btn-primary">Enroll Now!</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 15px;
  display: flex;
}

.row {
  display: flex;
  align-items: center;
}

.image-section {
  text-align: center; /* Centers the image within its column */
}

.about-image {
  max-width: 100%; /* Ensures the image is responsive */
  height: auto;
}

.text-section {
  text-align: justify;
  padding-left: 30px; /* Adds some padding on the left of the text */
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #007bff; /* Adjust the button color to match the purple theme in the image */
  border-color: #007bff;
}
</style>
