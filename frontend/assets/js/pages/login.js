document.addEventListener('DOMContentLoaded', () => {
  auth.checkGuest();

  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('btn-submit');
      
      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        
        const res = await api.post('/auth/login', { email, password });
        
        if (res.success && res.data && res.data.token) {
          auth.setToken(res.data.token);
          app.showNotification('Login berhasil! Mengalihkan...', 'success');
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 800);
        } else {
          throw new Error(res.message || 'Login gagal, periksa email & password.');
        }
      } catch (error) {
        app.showNotification(error.message || 'Email atau password salah', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Masuk';
      }
    });
  }
});
