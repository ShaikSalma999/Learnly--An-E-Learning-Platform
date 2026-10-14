const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email) {
  const value = email.trim();
  if (!value) return 'Email is required.';
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.';
  return '';
}

export function validatePassword(password, minLength = 6) {
  if (!password) return 'Password is required.';
  if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
  return '';
}

export function validateName(name) {
  const value = name.trim();
  if (!value) return 'Full name is required.';
  if (value.length < 2) return 'Name must be at least 2 characters.';
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) return 'Name can only contain letters, spaces and . - \' characters.';
  return '';
}

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: password ? labels[score] : '' };
}
