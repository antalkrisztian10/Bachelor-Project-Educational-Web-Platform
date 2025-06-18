<template>
  <div class="admin-panel container-fluid mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Pending Role Requests</h4>
      </div>
      <div class="card-body">
        <div v-if="requests.length === 0" class="alert alert-info">No pending requests.</div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request.id">
                <td>{{ request.full_name }}</td>
                <td>{{ request.username }}</td>
                <td>{{ request.email }}</td>
                <td>
                  <span class="badge bg-secondary text-uppercase">{{ request.role }}</span>
                </td>
                <td class="text-center">
                  <button class="btn btn-success btn-sm me-2" @click="approveRequest(request.id)">
                    <i class="bi bi-check-lg"></i> Approve
                  </button>
                  <button class="btn btn-danger btn-sm" @click="declineRequest(request.id)">
                    <i class="bi bi-x-lg"></i> Decline
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'RequestsView',
  data() {
    return {
      requests: []
    }
  },
  methods: {
    fetchRequests() {
      axios
        .get('/api/requests')
        .then((res) => {
          this.requests = res.data
        })
        .catch((err) => {
          console.error('Error fetching requests:', err)
          alert('Failed to load requests.')
        })
    },
    approveRequest(id) {
      if (!confirm('Are you sure you want to approve this request?')) return

      axios
        .post(`/api/requests/approve/${id}`)
        .then(() => {
          this.requests = this.requests.filter((req) => req.id !== id)
        })
        .catch((err) => {
          console.error('Error approving request:', err)
          alert('Failed to approve the request.')
        })
    },
    declineRequest(id) {
      if (!confirm('Are you sure you want to decline this request?')) return

      axios
        .delete(`/api/requests/decline/${id}`)
        .then(() => {
          this.requests = this.requests.filter((req) => req.id !== id)
        })
        .catch((err) => {
          console.error('Error declining request:', err)
          alert('Failed to decline the request.')
        })
    }
  },
  mounted() {
    this.fetchRequests()
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1000px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table thead th {
  vertical-align: middle;
}
</style>
