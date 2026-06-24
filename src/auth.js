const AUTH_KEY = 'app_auth';

export function getAuthState() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function login(email, password) {
  const success = !!(email && password);

  if (success) {
    const accountDomain = email.split('@')[1] || 'default';
    const state = {
      visitor: { id: email, email: email },
      account: { id: 'acct-' + accountDomain, name: accountDomain }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));

    pendo.identify({
      visitor: state.visitor,
      account: state.account
    });
  }

  pendo.track('Login Completed', {
    method: 'email',
    success: success
  });

  return success;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
