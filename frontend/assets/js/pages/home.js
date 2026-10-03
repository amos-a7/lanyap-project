document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();

  loadDashboardStats();
  loadLatestJobs();
  loadPopularCourses();

  async function loadDashboardStats() {
    try {
      const res = await api.get('/dashboard');
      if (res.success && res.data) {
        document.getElementById('stat-jobs').textContent = res.data.totalJobs ?? 0;
        document.getElementById('stat-courses').textContent = res.data.totalCourses ?? 0;
      }
    } catch (err) {
      console.error('Failed to load global stats', err);
    }

    // Load user personal stats
    try {
      const appsRes = await api.get('/applications');
      if (appsRes.success && appsRes.data) {
        document.getElementById('stat-apps').textContent = appsRes.data.length;
      }
    } catch (e) {
      document.getElementById('stat-apps').textContent = '0';
    }

    try {
      const enrollRes = await api.get('/enrollments');
      if (enrollRes.success && enrollRes.data) {
        document.getElementById('stat-my-courses').textContent = enrollRes.data.length;
      }
    } catch (e) {
      document.getElementById('stat-my-courses').textContent = '0';
    }
  }

  async function loadLatestJobs() {
    const container = document.getElementById('latest-jobs-container');
    app.showLoading('#latest-jobs-container');
    
    try {
      const res = await api.get('/jobs');
      const jobs = (res.success && res.data) ? res.data.slice(0, 3) : [];

      container.innerHTML = '';
      if (jobs.length === 0) {
        app.showEmptyState('#latest-jobs-container', 'Belum ada lowongan terbaru');
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
              <span class="text-primary font-weight-bold" style="font-size: 0.9rem;">${salaryText}</span>
              <a href="job-detail.html?id=${job.id}" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Detail</a>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat lowongan terbaru dari server</p>';
    }
  }

  async function loadPopularCourses() {
    const container = document.getElementById('popular-courses-container');
    app.showLoading('#popular-courses-container');
    
    try {
      const res = await api.get('/courses');
      const courses = (res.success && res.data) ? res.data.slice(0, 3) : [];

      container.innerHTML = '';
      if (courses.length === 0) {
        app.showEmptyState('#popular-courses-container', 'Belum ada kursus tersedia');
        return;
      }

      courses.forEach(course => {
        const rating = course.rating ? Number(course.rating).toFixed(1) : '5.0';
        const price = Number(course.price) === 0 ? 'Gratis' : app.formatCurrency(course.price);

        container.innerHTML += `
          <div class="card">
            <div style="height: 150px; background: rgba(124, 58, 237, 0.2); border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-graduation-cap" style="font-size: 3rem; color: var(--accent-purple);"></i>
            </div>
            <span class="badge badge-pending mb-2">${app.escapeHtml(course.level || 'Beginner')}</span>
            <h4 class="mb-1">${app.escapeHtml(course.title)}</h4>
            <p class="text-secondary mb-2" style="font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${app.escapeHtml(course.instructor || 'Tutor LearnHire')}</p>
            <div class="d-flex align-center gap-1 mb-3">
              <i class="fas fa-star text-warning"></i> <span>${rating}</span>
              <span class="text-secondary" style="font-size: 0.8rem;">(${course.total_students || 0} siswa)</span>
            </div>
            <div class="d-flex justify-between align-center pt-2" style="border-top: 1px solid var(--card-border);">
              <span class="text-primary font-weight-bold">${price}</span>
              <a href="course-detail.html?id=${course.id}" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Lihat</a>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat kursus populer dari server</p>';
    }
  }
});
