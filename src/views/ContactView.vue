<template>
  <div class="contact-container">
    <div class="contact-row">
      <!-- Contact Info Card -->
      <div class="contact-card animate-slide-in">
        <h2>Contact Information</h2>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <p>
            <strong>Email:</strong>
            <a href="mailto:your-email@example.com">your-email@example.com</a>
          </p>
        </div>
        <div class="contact-item">
          <i class="fas fa-phone"></i>
          <p><strong>Phone:</strong> +1 234 567 890</p>
        </div>
        <div class="contact-item">
          <i class="fas fa-map-marker-alt"></i>
          <p><strong>Address:</strong> 1234 Your Street, Your City, Your Country</p>
        </div>
        <p class="note">
          We'd love to hear from you! Feel free to reach out for any inquiries or feedback.
        </p>
      </div>

      <!-- Image Card -->
      <div class="image-card animate-slide-in">
        <img src="@/assets/contact-us.png" alt="Contact Us" class="contact-image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView'
}
</script>

<style scoped>
/* Container */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 15px;
}

/* Row */
.contact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* Contact Card */
.contact-card {
  background: linear-gradient(135deg, #007bff, #021c48);
  color: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  flex: 1;
  min-width: 300px;
  max-width: 48%;
}

.contact-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Contact Items */
.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.contact-item i {
  font-size: 1.5rem;
  margin-right: 15px;
  color: #fff;
  animation: bounce 1.5s infinite ease-in-out;
}

.contact-item a {
  color: #ffea70;
  text-decoration: none;
  font-weight: bold;
}

.contact-item a:hover {
  text-decoration: underline;
}

.note {
  margin-top: 20px;
  font-style: italic;
}

/* Image Card */
.image-card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  flex: 1;
  min-width: 300px;
  max-width: 48%;
}

.image-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.contact-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

/* Animations */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-slide-in {
  animation: slide-in 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
}

@keyframes slide-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-row {
    flex-direction: column;
  }

  .contact-card,
  .image-card {
    max-width: 100%;
  }
}

body.dark-mode .contact-image,
body.dark-mode .image-card {
  background-color: #333232;
}
</style>
