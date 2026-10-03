document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuth();
  loadProfile();

  async function loadProfile() {
    try {
      const res = await api.get('/auth/profile');
      if (res.success && res.data) {
        const user = res.data;
        
        // Populate view
        document.getElementById('profile-name-display').textContent = user.name || 'User Name';
        document.getElementById('profile-email-display').textContent = user.email || 'email@example.com';
        document.getElementById('profile-avatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
        document.getElementById('profile-bio-display').textContent = user.bio || 'Belum ada bio.';

        const roleBadge = document.getElementById('profile-role-badge');
        if (roleBadge) {
          if (user.role === 'admin') {
            roleBadge.textContent = 'Administrator';
            roleBadge.className = 'badge badge-warning mb-3';
          } else {
            roleBadge.textContent = 'Pencari Kerja';
            roleBadge.className = 'badge badge-active mb-3';
          }
        }

        // Populate form
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('skills').value = user.skills || '';
        document.getElementById('bio').value = user.bio || '';
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      app.showNotification('Gagal memuat data profil dari server', 'error');
    }
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-save');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
      
      const updatedData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        skills: document.getElementById('skills').value.trim(),
        bio: document.getElementById('bio').value.trim()
      };

      try {
        const res = await api.put('/auth/profile', updatedData);
        if (res.success) {
          app.showNotification('Profil berhasil diperbarui di database!', 'success');
          
          // Update sidebar name
          const nameEls = document.querySelectorAll('.user-name-display');
          nameEls.forEach(el => el.textContent = updatedData.name);
          const avatarEls = document.querySelectorAll('.user-avatar-display');
          avatarEls.forEach(el => el.textContent = updatedData.name.charAt(0).toUpperCase());

          loadProfile();
        } else {
          throw new Error(res.message || 'Gagal memperbarui profil');
        }
      } catch (err) {
        app.showNotification(err.message || 'Terjadi kesalahan saat menyimpan profil', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Simpan Perubahan';
      }
    });
  }
});
