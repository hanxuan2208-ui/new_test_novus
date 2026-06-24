import { getAuthState, login, logout } from './auth.js';
import { createAccount } from './onboarding.js';

// Initialize Pendo with current auth state
const auth = getAuthState();
pendo.initialize({
  visitor: auth ? auth.visitor : { id: '' },
  account: auth ? auth.account : {}
});

// --- Router ---

function navigate(path) {
  history.pushState(null, '', path);
  render();
  pendo.pageLoad();
}

window.addEventListener('popstate', function () {
  render();
  pendo.pageLoad();
});

document.addEventListener('click', function (e) {
  const link = e.target.closest('a[data-link]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

// --- Page Renderers ---

function renderNav() {
  const auth = getAuthState();
  const nav = document.getElementById('nav');
  if (auth) {
    nav.innerHTML =
      '<a href="/" data-link>Home</a>' +
      '<a href="/dashboard" data-link>Dashboard</a>' +
      '<button id="logout-btn">Logout</button>';
    nav.querySelector('#logout-btn').addEventListener('click', function () {
      logout();
      navigate('/login');
    });
  } else {
    nav.innerHTML =
      '<a href="/" data-link>Home</a>' +
      '<a href="/login" data-link>Login</a>';
  }
}

function renderHome(container) {
  const auth = getAuthState();
  container.innerHTML =
    '<h1>Welcome to new_test_novus</h1>' +
    (auth
      ? '<p>Logged in as ' + auth.visitor.email + '</p>' +
        '<a href="/dashboard" data-link>Go to Dashboard</a>'
      : '<p>Get started by logging in or creating an account.</p>' +
        '<a href="/login" data-link>Login</a>');
}

function renderLogin(container) {
  if (getAuthState()) {
    navigate('/dashboard');
    return;
  }

  container.innerHTML =
    '<h1>Login</h1>' +
    '<form id="login-form">' +
      '<label for="email">Email</label>' +
      '<input type="email" id="email" name="email" required />' +
      '<label for="password">Password</label>' +
      '<input type="password" id="password" name="password" required />' +
      '<button type="submit">Login</button>' +
    '</form>' +
    '<hr />' +
    '<h2>Create Account</h2>' +
    '<form id="signup-form">' +
      '<label for="signup-name">Name</label>' +
      '<input type="text" id="signup-name" name="name" required />' +
      '<label for="signup-email">Email</label>' +
      '<input type="email" id="signup-email" name="email" required />' +
      '<label for="signup-plan">Plan</label>' +
      '<select id="signup-plan" name="plan">' +
        '<option value="free">Free</option>' +
        '<option value="pro">Pro</option>' +
      '</select>' +
      '<button type="submit">Create Account</button>' +
    '</form>';

  container.querySelector('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = container.querySelector('#email').value;
    var password = container.querySelector('#password').value;
    if (login(email, password)) {
      navigate('/dashboard');
    }
  });

  container.querySelector('#signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = container.querySelector('#signup-name').value;
    var email = container.querySelector('#signup-email').value;
    var plan = container.querySelector('#signup-plan').value;
    var result = createAccount(name, email, plan);
    if (result.success) {
      login(email, 'created');
      navigate('/dashboard');
    }
  });
}

function renderDashboard(container) {
  var auth = getAuthState();
  if (!auth) {
    navigate('/login');
    return;
  }
  container.innerHTML =
    '<h1>Dashboard</h1>' +
    '<p>Welcome back, ' + auth.visitor.email + '</p>' +
    '<div class="card">' +
      '<h2>Account</h2>' +
      '<p>Account ID: ' + auth.account.id + '</p>' +
    '</div>';
}

function renderNotFound(container) {
  container.innerHTML = '<h1>404 — Page Not Found</h1><a href="/" data-link>Go Home</a>';
}

// --- Main Render ---

function render() {
  var path = window.location.pathname;
  var container = document.getElementById('app');

  if (path === '/') {
    renderHome(container);
  } else if (path === '/login') {
    renderLogin(container);
  } else if (path.indexOf('/dashboard') === 0) {
    renderDashboard(container);
  } else {
    renderNotFound(container);
  }

  renderNav();
}

render();
