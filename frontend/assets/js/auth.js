const auth = {
  getToken() {
    return localStorage.getItem('token');
  },
  
  setToken(token) {
    localStorage.setItem('token', token);
  },
  
  isLoggedIn() {
    return !!this.getToken();
  },
  
  checkAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '../pages/login.html';
    }
  },
  
  checkGuest() {
    if (this.isLoggedIn()) {
      window.location.href = '../pages/home.html';
    }
  },
  
  logout() {
    localStorage.removeItem('token');
    window.location.href = '../index.html';
  },

  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  },

  getUser() {
    const token = this.getToken();
    if (!token) return null;
    return this.parseJwt(token);
  }
};
