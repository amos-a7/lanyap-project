document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');
  
  if (!jobId) {
    window.location.href = 'jobs.html';
    return;
  }

  let alreadyApplied = false;
  loadJobDetail(jobId);

  async function loadJobDetail(id) {
    const container = document.getElementById('job-detail-container');
    app.showLoading('#job-detail-container');
    
    try {
      // Check existing applications
      try {
        const appsRes = await api.get('/applications');
        if (appsRes.success && appsRes.data) {
          alreadyApplied = appsRes.data.some(a => String(a.job_id) === String(id));
        }
      } catch (e) {
        console.warn('Could not check applications', e);
      }

      const res = await api.get(`/jobs/${id}`);
      if (!res.success || !res.data) {
        container.innerHTML = '<p class="text-danger text-center">Lowongan tidak ditemukan.</p>';
        return;
      }

      const job = res.data;
      const companyName = job.company_name || 'Perusahaan';
      const initial = companyName.charAt(0).toUpperCase();

      let salaryText = 'Gaji Dirahasiakan';
      if (job.salary_min && job.salary_max) {
        salaryText = `${app.formatCurrency(job.salary_min)} - ${app.formatCurrency(job.salary_max)}`;
      } else if (job.salary_min) {
        salaryText = `Mulai ${app.formatCurrency(job.salary_min)}`;
      }

      const requirementsList = job.requirements 
        ? job.requirements.split('\n').filter(r => r.trim().length > 0)
        : ['Memiliki keterampilan yang relevan dengan posisi', 'Dapat bekerja sama dalam tim', 'Komunikatif dan bertanggung jawab'];

      const applyBtnHtml = alreadyApplied
        ? '<button class="btn btn-outline btn-lg btn-block mt-4" disabled><i class="fas fa-check-circle"></i> Sudah Dilamar</button>'
        : '<button class="btn btn-primary btn-lg btn-block mt-4" id="btn-apply"><i class="fas fa-paper-plane"></i> Lamar Pekerjaan Ini</button>';

      container.innerHTML = `
        <div class="card mb-4">
            <div class="d-flex align-center gap-2 mb-3">
                <div class="avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">${initial}</div>
                <div>
                    <h2>${app.escapeHtml(job.title)}</h2>
                    <p class="text-secondary">${app.escapeHtml(companyName)} &bull; <span class="badge badge-info">${app.escapeHtml(job.category_name || 'Umum')}</span></p>
                </div>
            </div>
            
            <div class="grid-3 mb-4 mt-4 text-center">
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-map-marker-alt text-primary mb-2 text-gradient"></i>
                    <p class="text-secondary">Lokasi</p>
                    <p class="font-weight-bold">${app.escapeHtml(job.location || 'Indonesia')}</p>
                </div>
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-money-bill-wave text-success mb-2"></i>
                    <p class="text-secondary">Kisaran Gaji</p>
                    <p class="font-weight-bold">${salaryText}</p>
                </div>
                <div class="card" style="padding: 1rem; background: rgba(0,0,0,0.2);">
                    <i class="fas fa-briefcase text-info mb-2"></i>
                    <p class="text-secondary">Tipe Pekerjaan</p>
                    <p class="font-weight-bold">${app.escapeHtml(job.type || 'Full-time')}</p>
                </div>
            </div>

            <div class="mb-4">
                <h3 class="mb-2">Deskripsi Pekerjaan</h3>
                <p class="text-secondary" style="white-space: pre-line;">${app.escapeHtml(job.description || 'Tidak ada deskripsi rinci.')}</p>
            </div>
            
            <div class="mb-4">
                <h3 class="mb-2">Persyaratan</h3>
                <ul class="text-secondary" style="margin-left: 1.5rem; line-height: 1.8;">
                    ${requirementsList.map(r => `<li>${app.escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>

            ${applyBtnHtml}
        </div>
      `;

      // Setup apply button
      const btnApply = document.getElementById('btn-apply');
      if (btnApply) {
        btnApply.addEventListener('click', () => {
          document.getElementById('apply-modal').classList.add('show');
        });
      }

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat detail pekerjaan dari server</p>';
    }
  }

  // Modal logic
  const modal = document.getElementById('apply-modal');
  const btnClose = document.getElementById('btn-close-modal');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }
  
  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-apply');
      const coverLetter = document.getElementById('cover-letter').value.trim();
      
      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

        const res = await api.post('/applications', {
          job_id: jobId,
          cover_letter: coverLetter
        });

        if (res.success) {
          app.showNotification('Lamaran berhasil dikirim ke perusahaan!', 'success');
          modal.classList.remove('show');
          applyForm.reset();
          loadJobDetail(jobId);
        } else {
          throw new Error(res.message || 'Gagal mengirim lamaran');
        }
      } catch (err) {
        app.showNotification(err.message || 'Terjadi kesalahan saat melamar', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Kirim Lamaran';
      }
    });
  }
});
