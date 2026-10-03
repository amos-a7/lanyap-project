document.addEventListener('DOMContentLoaded', () => {
  auth.checkGuest();

  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const btn = document.getElementById('btn-submit');
      
      if (password !== confirmPassword) {
        app.showNotification('Password dan konfirmasi password tidak cocok', 'error');
        return;
      }

      if (password.length < 6) {
        app.showNotification('Password minimal 6 karakter', 'error');
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        
        const res = await api.post('/auth/register', { name, email, phone, password });
        
        if (res.success) {
          app.showNotification('Registrasi berhasil! Mengalihkan ke login...', 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1200);
        } else {
          throw new Error(res.message || 'Registrasi gagal.');
        }
      } catch (error) {
        app.showNotification(error.message || 'Terjadi kesalahan saat pendaftaran', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Daftar';
      }
    });
  }
});
