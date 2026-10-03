document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  loadMyCourses();

  async function loadMyCourses() {
    const container = document.getElementById('my-courses-container');
    app.showLoading('#my-courses-container');
    
    try {
      const res = await api.get('/enrollments');
      const courses = (res.success && res.data) ? res.data : [];

      container.innerHTML = '';
      if (courses.length === 0) {
        app.showEmptyState('#my-courses-container', 'Anda belum mengikuti kursus apapun. <br><a href="courses.html" class="btn btn-primary mt-3" style="display:inline-block;">Jelajahi Kursus</a>');
        return;
      }

      courses.forEach(item => {
        const progress = item.progress || 0;
        const isCompleted = item.status === 'completed' || progress >= 100;
        const statusBadge = isCompleted 
          ? '<span class="badge badge-active"><i class="fas fa-check-circle"></i> Selesai</span>' 
          : '<span class="badge badge-info"><i class="fas fa-spinner fa-spin"></i> Sedang Berjalan</span>';

        const dateStr = item.enrolled_at ? app.formatDate(item.enrolled_at) : '-';

        container.innerHTML += `
          <div class="card">
            <div class="d-flex justify-between align-start mb-2">
                <h4 style="max-width: 75%;">${app.escapeHtml(item.course_title || 'Kursus')}</h4>
                ${statusBadge}
            </div>
            <p class="text-secondary mb-3"><i class="fas fa-user-tie"></i> Instruktur: ${app.escapeHtml(item.course_instructor || 'Pengajar LearnHire')}</p>
            
            <div class="mb-3">
                <div class="d-flex justify-between text-secondary" style="font-size: 0.9rem;">
                    <span>Progress Belajar</span>
                    <span class="font-weight-bold text-primary">${progress}%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
            </div>
            
            <p class="text-secondary mb-3" style="font-size: 0.8rem;"><i class="fas fa-calendar-check"></i> Terdaftar sejak: ${dateStr}</p>
            
            <div class="d-flex gap-2">
              <button class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-block update-progress-btn" data-id="${item.id}" data-progress="${progress}">
                ${isCompleted ? '<i class="fas fa-redo"></i> Ulangi Materi' : '<i class="fas fa-play"></i> Lanjutkan Belajar (+25%)'}
              </button>
              <button class="btn btn-outline unenroll-btn" data-id="${item.id}" title="Batalkan Kursus" style="padding: 0.5rem 1rem; border-color: rgba(239, 68, 68, 0.4);">
                <i class="fas fa-trash text-danger"></i>
              </button>
            </div>
          </div>
        `;
      });

      // Update progress handler
      document.querySelectorAll('.update-progress-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const currentProgress = parseInt(e.currentTarget.getAttribute('data-progress'), 10) || 0;
          let newProgress = currentProgress + 25;
          let newStatus = 'enrolled';
          if (newProgress >= 100) {
            newProgress = 100;
            newStatus = 'completed';
          }

          try {
            e.currentTarget.disabled = true;
            const putRes = await api.put(`/enrollments/${id}`, {
              progress: newProgress,
              status: newStatus
            });

            if (putRes.success) {
              if (newStatus === 'completed') {
                app.showNotification('Selamat! Anda telah menyelesaikan kursus ini 🎉', 'success');
              } else {
                app.showNotification(`Progress bertambah menjadi ${newProgress}%`, 'info');
              }
              loadMyCourses();
            } else {
              throw new Error(putRes.message);
            }
          } catch (err) {
            app.showNotification(err.message || 'Gagal memperbarui progress', 'error');
            e.currentTarget.disabled = false;
          }
        });
      });

      // Unenroll handler
      document.querySelectorAll('.unenroll-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Apakah Anda yakin ingin membatalkan pendaftaran pada kursus ini?')) {
            try {
              const delRes = await api.delete(`/enrollments/${id}`);
              if (delRes.success) {
                app.showNotification('Pendaftaran kursus berhasil dibatalkan', 'success');
                loadMyCourses();
              } else {
                throw new Error(delRes.message);
              }
            } catch (err) {
              app.showNotification(err.message || 'Gagal membatalkan kursus', 'error');
            }
          }
        });
      });

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat data kursus Anda dari server</p>';
    }
  }
});
