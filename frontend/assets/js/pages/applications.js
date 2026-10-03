document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  loadApplications();

  async function loadApplications() {
    const tbody = document.getElementById('applications-table-body');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</td></tr>';
    
    try {
      const res = await api.get('/applications');
      const apps = (res.success && res.data) ? res.data : [];

      tbody.innerHTML = '';
      if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2.5rem; color: var(--text-secondary);"><i class="fas fa-inbox mb-2" style="font-size: 2rem; display:block;"></i>Belum ada lamaran pekerjaan yang diajukan. <a href="jobs.html" class="text-primary font-weight-bold ml-1">Cari Lowongan</a></td></tr>';
        return;
      }

      apps.forEach(item => {
        let statusBadge = '<span class="badge badge-pending">Menunggu</span>';
        if (item.status === 'reviewed') statusBadge = '<span class="badge badge-info">Direview</span>';
        else if (item.status === 'accepted') statusBadge = '<span class="badge badge-active">Diterima</span>';
        else if (item.status === 'rejected') statusBadge = '<span class="badge badge-rejected">Ditolak</span>';

        const dateStr = item.created_at ? app.formatDate(item.created_at) : '-';

        tbody.innerHTML += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 1rem; font-weight: 500;">
                <a href="job-detail.html?id=${item.job_id}" class="text-primary hover-underline">${app.escapeHtml(item.job_title || 'Pekerjaan')}</a>
              </td>
              <td style="padding: 1rem; color: var(--text-secondary);">${app.escapeHtml(item.company_name || '-')}</td>
              <td style="padding: 1rem; color: var(--text-secondary);">${dateStr}</td>
              <td style="padding: 1rem;">${statusBadge}</td>
              <td style="padding: 1rem;">
                  <button class="btn btn-outline btn-sm delete-btn" data-id="${item.id}" title="Batalkan Lamaran" style="padding: 0.3rem 0.7rem; border-color: rgba(239, 68, 68, 0.4);">
                    <i class="fas fa-trash text-danger"></i>
                  </button>
              </td>
          </tr>
        `;
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
             const id = e.currentTarget.getAttribute('data-id');
             if (confirm('Apakah Anda yakin ingin membatalkan lamaran pekerjaan ini?')) {
                 try {
                   const delRes = await api.delete(`/applications/${id}`);
                   if (delRes.success) {
                     app.showNotification('Lamaran berhasil dibatalkan', 'success');
                     loadApplications();
                   } else {
                     throw new Error(delRes.message || 'Gagal menghapus');
                   }
                 } catch (err) {
                   app.showNotification(err.message || 'Gagal membatalkan lamaran', 'error');
                 }
             }
          });
      });

    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger" style="padding: 2rem;">Gagal memuat data lamaran dari server.</td></tr>';
    }
  }
});
