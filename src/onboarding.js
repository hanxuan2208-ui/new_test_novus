export function createAccount(name, email, plan) {
  const accountId = 'acct-' + Date.now();
  const success = !!(name && email);

  pendo.track('Account Created', {
    accountId: success ? accountId : null,
    plan: plan || 'free',
    source: 'signup',
    success: success
  });

  return { success, accountId };
}
