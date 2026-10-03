document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  
  if (!courseId) {
    window.location.href = 'courses.html';
    return;
  }

  let alreadyEnrolled = false;
  let userEnrollment = null;

  loadCourseDetail(courseId);

  async function loadCourseDetail(id) {
    const container = document.getElementById('course-detail-container');
    app.showLoading('#course-detail-container');
    
    try {
      // Check existing enrollment
      try {
        const enrollRes = await api.get('/enrollments');
        if (enrollRes.success && enrollRes.data) {
          userEnrollment = enrollRes.data.find(e => String(e.course_id) === String(id));
          alreadyEnrolled = !!userEnrollment;
        }
      } catch (e) {
        console.warn('Could not check enrollments', e);
      }

      const res = await api.get(`/courses/${id}`);
      if (!res.success || !res.data) {
        container.innerHTML = '<p class="text-danger text-center">Kursus tidak ditemukan.</p>';
        return;
      }

      const course = res.data;
      const rating = course.rating ? Number(course.rating).toFixed(1) : '5.0';
      const price = Number(course.price) === 0 ? 'Gratis' : app.formatCurrency(course.price);

      let actionSection = '';
      if (alreadyEnrolled) {
        const progress = userEnrollment ? (userEnrollment.progress || 0) : 0;
        actionSection = `
          <div class="card mt-4" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3);">
            <div class="d-flex justify-between align-center mb-2">
              <span class="badge badge-active"><i class="fas fa-check-circle"></i> Anda Sudah Terdaftar</span>
              <span class="text-secondary font-weight-bold">${progress}% Selesai</span>
            </div>
            <div class="progress-container mb-3" style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden;">
              <div class="progress-bar" style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue));"></div>
            </div>
            <a href="my-courses.html" class="btn btn-primary btn-block"><i class="fas fa-play"></i> Lanjutkan Belajar di Kursus Saya</a>
          </div>
        `;
      } else {
        actionSection = `
          <button class="btn btn-primary btn-lg btn-block mt-4" id="btn-enroll">
            <i class="fas fa-graduation-cap"></i> Daftar Kursus Ini (${price})
          </button>
        `;
      }

      container.innerHTML = `
        <div class="card mb-4">
            <div style="height: 250px; background: linear-gradient(45deg, var(--accent-purple), var(--accent-blue)); border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; opacity: 0.9;">
                <i class="fas fa-laptop-code" style="font-size: 5rem; color: white;"></i>
            </div>
            
            <div class="d-flex justify-between align-center mb-2">
                <h2>${app.escapeHtml(course.title)}</h2>
                <h2 class="text-primary">${price}</h2>
            </div>
            
            <p class="text-secondary mb-4" style="font-size: 1.1rem;">
              <i class="fas fa-user-tie"></i> Instruktur: <strong>${app.escapeHtml(course.instructor || 'Pengajar LearnHire')}</strong> &bull; 
              <span class="badge badge-info">${app.escapeHtml(course.category_name || 'Umum')}</span>
            </p>
            
            <div class="grid-3 mb-4 text-center">
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-star text-warning mb-2 text-gradient"></i>
                    <p class="text-secondary">Rating</p>
                    <p class="font-weight-bold">${rating} / 5.0</p>
                </div>
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-clock text-info mb-2"></i>
                    <p class="text-secondary">Durasi Pembelajaran</p>
                    <p class="font-weight-bold">${app.escapeHtml(course.duration || 'Akses Selamanya')}</p>
                </div>
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-layer-group text-success mb-2"></i>
                    <p class="text-secondary">Tingkat Kesulitan</p>
                    <p class="font-weight-bold">${app.escapeHtml(course.level || 'Semua Level')}</p>
                </div>
            </div>

            <div class="mb-4">
                <h3 class="mb-2">Deskripsi Kursus</h3>
                <p class="text-secondary" style="white-space: pre-line; line-height: 1.8;">${app.escapeHtml(course.description || 'Kursus praktis dengan materi terstruktur untuk meningkatkan kemampuan kerja Anda.')}</p>
            </div>

            ${actionSection}
        </div>
      `;

      // Setup enroll button
      const btnEnroll = document.getElementById('btn-enroll');
      if (btnEnroll) {
        btnEnroll.addEventListener('click', () => {
          document.getElementById('enroll-modal').classList.add('show');
        });
      }

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat detail kursus dari server</p>';
    }
  }

  // Modal logic
  const modal = document.getElementById('enroll-modal');
  const btnClose = document.getElementById('btn-close-modal');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
  
  const btnConfirm = document.getElementById('btn-confirm-enroll');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', async () => {
      btnConfirm.disabled = true;
      btnConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      try {
        const res = await api.post('/enrollments', { course_id: courseId });
        if (res.success) {
          app.showNotification('Pendaftaran berhasil! Anda dapat mulai belajar sekarang.', 'success');
          modal.classList.remove('show');
          loadCourseDetail(courseId);
        } else {
          throw new Error(res.message || 'Pendaftaran gagal');
        }
      } catch (err) {
        app.showNotification(err.message || 'Terjadi kesalahan saat pendaftaran kursus', 'error');
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = 'Ya, Daftar Sekarang';
      }
    });
  }
});
