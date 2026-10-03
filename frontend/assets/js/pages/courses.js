document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  
  loadCategories();
  loadCourses();

  document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    loadCourses();
  });

  async function loadCategories() {
    try {
      const res = await api.get('/categories/courses');
      if (res.success && res.data) {
        const select = document.getElementById('category-select');
        select.innerHTML = '<option value="">Semua Kategori</option>';
        res.data.forEach(cat => {
          select.innerHTML += `<option value="${cat.id}">${app.escapeHtml(cat.name)}</option>`;
        });
      }
    } catch (err) {
      console.warn('Could not load course categories:', err);
    }
  }

  async function loadCourses() {
    const container = document.getElementById('courses-container');
    app.showLoading('#courses-container');
    
    const search = document.getElementById('search-input').value.trim();
    const categoryId = document.getElementById('category-select').value;
    const level = document.getElementById('level-select').value;
    
    try {
      let endpoint = '/courses';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      if (level) params.append('level', level);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const res = await api.get(endpoint);
      const courses = (res.success && res.data) ? res.data : [];

      container.innerHTML = '';
      if (courses.length === 0) {
        app.showEmptyState('#courses-container', 'Tidak ada kursus yang sesuai kriteria');
        return;
      }

      courses.forEach(course => {
        const rating = course.rating ? Number(course.rating).toFixed(1) : '5.0';
        const price = Number(course.price) === 0 ? 'Gratis' : app.formatCurrency(course.price);

        container.innerHTML += `
          <div class="card">
            <div style="height: 150px; background: rgba(124, 58, 237, 0.2); border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-laptop-code" style="font-size: 3rem; color: var(--accent-purple);"></i>
            </div>
            <div class="d-flex justify-between align-center mb-2">
                <span class="badge badge-pending">${app.escapeHtml(course.level || 'Beginner')}</span>
                <span class="text-secondary" style="font-size: 0.8rem;"><i class="fas fa-clock"></i> ${app.escapeHtml(course.duration || 'Flexible')}</span>
            </div>
            <h4 class="mb-1">${app.escapeHtml(course.title)}</h4>
            <p class="text-secondary mb-2" style="font-size: 0.9rem;"><i class="fas fa-user-tie"></i> ${app.escapeHtml(course.instructor || 'Tutor LearnHire')}</p>
            <div class="d-flex align-center gap-1 mb-3">
              <i class="fas fa-star text-warning"></i> <span>${rating}</span>
              <span class="text-secondary" style="font-size: 0.8rem;">(${course.total_students || 0} siswa)</span>
            </div>
            <div class="d-flex justify-between align-center pt-2" style="border-top: 1px solid var(--card-border);">
              <span class="text-primary font-weight-bold">${price}</span>
              <a href="course-detail.html?id=${course.id}" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Lihat Detail</a>
            </div>
          </div>
        `;
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat data kursus dari server</p>';
    }
  }
});
