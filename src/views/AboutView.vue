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
          Welcome to EduPlatform! We are dedicated to providing a comprehensive and engaging
          learning environment for students of all ages. Our platform offers a wide range of
          courses, expert instructors, and interactive learning tools to ensure you gain the
          knowledge and skills you need for your academic and professional growth.
        </p>
        <p>
          At EduPlatform, we believe in making education accessible to everyone. Whether you're
          looking to enhance your career or simply want to learn something new, we have the right
          course for you. Join us today and start your journey to success!
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
