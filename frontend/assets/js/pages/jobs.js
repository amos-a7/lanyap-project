document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  
  loadCategories();
  loadJobs();

  document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    loadJobs();
  });

  async function loadCategories() {
    try {
      const res = await api.get('/categories/jobs');
      if (res.success && res.data) {
        const select = document.getElementById('category-select');
        select.innerHTML = '<option value="">Semua Kategori</option>';
        res.data.forEach(cat => {
          select.innerHTML += `<option value="${cat.id}">${app.escapeHtml(cat.name)}</option>`;
        });
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  }

  async function loadJobs() {
    const container = document.getElementById('jobs-container');
    app.showLoading('#jobs-container');
    
    // Get filters
    const search = document.getElementById('search-input').value.trim();
    const categoryId = document.getElementById('category-select').value;
    
    try {
      let endpoint = '/jobs';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      
      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const res = await api.get(endpoint);
      const jobs = (res.success && res.data) ? res.data : [];

      container.innerHTML = '';
      if (jobs.length === 0) {
        app.showEmptyState('#jobs-container', 'Tidak ada lowongan yang sesuai kriteria');
        return;
      }

      jobs.forEach(job => {
        const companyName = job.company_name || 'Perusahaan';
        const initial = companyName.charAt(0).toUpperCase();
        let salaryText = 'Gaji dirahasiakan';
        if (job.salary_min && job.salary_max) {
          salaryText = `${app.formatCurrency(job.salary_min)} - ${app.formatCurrency(job.salary_max)}`;
        } else if (job.salary_min) {
          salaryText = `Mulai ${app.formatCurrency(job.salary_min)}`;
        }

        container.innerHTML += `
          <div class="card">
            <div class="d-flex justify-between align-center mb-2">
              <div class="avatar">${initial}</div>
              <span class="badge badge-info">${app.escapeHtml(job.type || 'Full-time')}</span>
            </div>
            <h4>${app.escapeHtml(job.title)}</h4>
            <p class="text-secondary mb-1"><i class="fas fa-building"></i> ${app.escapeHtml(companyName)}</p>
            <p class="text-secondary mb-3"><i class="fas fa-map-marker-alt"></i> ${app.escapeHtml(job.location || 'Indonesia')}</p>
            <div class="d-flex justify-between align-center mt-3 pt-3" style="border-top: 1px solid var(--card-border);">
              <span class="text-primary font-weight-bold" style="font-size:0.9rem;">${salaryText}</span>
              <a href="job-detail.html?id=${job.id}" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Detail</a>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat data pekerjaan dari server</p>';
    }
  }
});
