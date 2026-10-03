document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  loadTickets();

  async function loadTickets() {
    const container = document.getElementById('tickets-container');
    app.showLoading('#tickets-container');
    
    try {
      const res = await api.get('/support');
      const tickets = (res.success && res.data) ? res.data : [];

      container.innerHTML = '';
      if (tickets.length === 0) {
        app.showEmptyState('#tickets-container', 'Belum ada tiket bantuan yang dibuat.');
        return;
      }

      tickets.forEach(ticket => {
        let statusBadge = '<span class="badge badge-warning">Terbuka</span>';
        if (ticket.status === 'in_progress') {
          statusBadge = '<span class="badge badge-info">Sedang Diproses</span>';
        } else if (ticket.status === 'resolved') {
          statusBadge = '<span class="badge badge-active">Selesai Dijawab</span>';
        }

        const dateStr = ticket.created_at ? app.formatDate(ticket.created_at) : '-';
        
        let replyHtml = '';
        if (ticket.reply) {
          replyHtml = `
            <div class="mt-3 p-3" style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--accent-blue); border-radius: 6px;">
              <div class="d-flex align-center gap-1 mb-1 text-primary font-weight-bold" style="font-size: 0.85rem;">
                <i class="fas fa-headset"></i> Respon Tim Dukungan:
              </div>
              <p class="text-secondary" style="font-size: 0.9rem; line-height: 1.5;">${app.escapeHtml(ticket.reply)}</p>
            </div>
          `;
        }

        container.innerHTML += `
          <div class="card">
            <div class="d-flex justify-between align-start mb-2">
                <h4 style="max-width: 70%;">${app.escapeHtml(ticket.subject)}</h4>
                ${statusBadge}
            </div>
            <p class="text-secondary mb-3" style="font-size: 0.95rem; white-space: pre-line;">${app.escapeHtml(ticket.message)}</p>
            ${replyHtml}
            <div class="d-flex justify-between align-center mt-3 pt-2" style="border-top: 1px solid var(--card-border);">
                <div class="text-secondary" style="font-size: 0.8rem;">
                    <i class="fas fa-calendar-alt"></i> ${dateStr}
                </div>
                <button class="btn btn-outline btn-sm delete-ticket-btn" data-id="${ticket.id}" title="Hapus Tiket" style="padding: 0.2rem 0.5rem; border-color: rgba(239, 68, 68, 0.4);">
                  <i class="fas fa-trash text-danger"></i>
                </button>
            </div>
          </div>
        `;
      });

      // Delete ticket handler
      document.querySelectorAll('.delete-ticket-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm('Apakah Anda yakin ingin menghapus tiket bantuan ini?')) {
            try {
              const delRes = await api.delete(`/support/${id}`);
              if (delRes.success) {
                app.showNotification('Tiket bantuan berhasil dihapus', 'success');
                loadTickets();
              } else {
                throw new Error(delRes.message);
              }
            } catch (err) {
              app.showNotification(err.message || 'Gagal menghapus tiket', 'error');
            }
          }
        });
      });

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="text-danger text-center">Gagal memuat tiket bantuan dari server</p>';
    }
  }

  // Modal logic
  const modal = document.getElementById('ticket-modal');
  const btnNewTicket = document.getElementById('btn-new-ticket');
  if (btnNewTicket) {
    btnNewTicket.addEventListener('click', () => {
      modal.classList.add('show');
    });
  }

  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      modal.classList.remove('show');
      document.getElementById('ticket-form').reset();
    });
  }
  
  const ticketForm = document.getElementById('ticket-form');
  if (ticketForm) {
    ticketForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-ticket');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      try {
        const res = await api.post('/support', { subject, message });
        if (res.success) {
          app.showNotification('Pesan berhasil dikirim! Tim kami akan segera menanggapi.', 'success');
          modal.classList.remove('show');
          ticketForm.reset();
          loadTickets();
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        app.showNotification(err.message || 'Gagal mengirim pesan dukungan', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Kirim Pesan';
      }
    });
  }
});
