// Global utilities
const app = {
  showNotification(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  },
  
  escapeHtml(unsafe) {
    return (unsafe || '').toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  },

  async loadSidebar() {
    const sidebarEl = document.getElementById('sidebar-container');
    if (sidebarEl) {
      try {
        const res = await fetch('../components/sidebar.html');
        const html = await res.text();
        sidebarEl.innerHTML = html;
        this.setActiveSidebarLink();
        this.initSidebarEvents();
        this.updateUserInfo();
      } catch (err) {
        console.error('Failed to load sidebar', err);
      }
    }
  },

  setActiveSidebarLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.getAttribute('href') && path.includes(link.getAttribute('href').replace('./', ''))) {
        link.classList.add('active');
      }
    });
  },

  initSidebarEvents() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
      });
    }
  },

  async updateUserInfo() {
    const user = auth.getUser();
    if (user) {
      const nameEls = document.querySelectorAll('.user-name-display');
      nameEls.forEach(el => el.textContent = user.name || 'User');
      
      const avatarEls = document.querySelectorAll('.user-avatar-display');
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      avatarEls.forEach(el => el.textContent = initial);

      const roleEls = document.querySelectorAll('.user-role-display');
      roleEls.forEach(el => {
        if (user.role === 'admin') {
          el.innerHTML = '<span class="badge badge-warning" style="font-size:0.68rem; padding: 1px 7px; margin-bottom: 3px; display:inline-block; font-weight:600;"><i class="fas fa-shield-alt"></i> ADMIN</span>';
        } else {
          el.innerHTML = '<span class="badge badge-info" style="font-size:0.68rem; padding: 1px 7px; margin-bottom: 3px; display:inline-block; font-weight:600;"><i class="fas fa-user"></i> USER</span>';
        }
      });
    }

    if (auth.isLoggedIn()) {
      try {
        const res = await api.get('/auth/profile');
        if (res.success && res.data) {
          const u = res.data;
          const nameEls = document.querySelectorAll('.user-name-display');
          nameEls.forEach(el => el.textContent = u.name || 'User');
          const avatarEls = document.querySelectorAll('.user-avatar-display');
          avatarEls.forEach(el => el.textContent = (u.name || 'U').charAt(0).toUpperCase());

          const roleEls = document.querySelectorAll('.user-role-display');
          roleEls.forEach(el => {
            if (u.role === 'admin') {
              el.innerHTML = '<span class="badge badge-warning" style="font-size:0.68rem; padding: 1px 7px; margin-bottom: 3px; display:inline-block; font-weight:600;"><i class="fas fa-shield-alt"></i> ADMIN</span>';
            } else {
              el.innerHTML = '<span class="badge badge-info" style="font-size:0.68rem; padding: 1px 7px; margin-bottom: 3px; display:inline-block; font-weight:600;"><i class="fas fa-user"></i> USER</span>';
            }
          });
        }
      } catch (e) {
        // Ignore failure
      }
    }
  },

  showLoading(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = '<div class="text-center py-4"><div class="spinner mx-auto"></div></div>';
    }
  },
  
  showEmptyState(containerSelector, message) {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = `
        <div class="card text-center" style="padding: 3rem;">
          <i class="fas fa-folder-open mb-3" style="font-size: 3rem; color: var(--text-secondary);"></i>
          <h4>${message}</h4>
        </div>
      `;
    }
  }
};

// Initialize common stuff on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Remove global loader if exists
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
  
  // Load sidebar if container exists
  if (document.getElementById('sidebar-container')) {
    app.loadSidebar();
  }
});
