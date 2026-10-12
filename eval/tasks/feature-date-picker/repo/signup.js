// Client-side checks for the signup form. The server re-validates everything.
const form = document.getElementById('signup-form');

function showError(field, message) {
  const el = document.getElementById(`${field}-error`);
  el.textContent = message;
  el.hidden = !message;
  document.getElementById(field).setAttribute('aria-invalid', message ? 'true' : 'false');
}

const checks = {
  name: (v) => (v.trim() ? '' : 'Please enter your name.'),
  email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Please enter a valid email address.'),
  password: (v) => (v.length >= 8 ? '' : 'Password must be at least 8 characters.'),
};

form.addEventListener('submit', (event) => {
  let ok = true;
  for (const [field, check] of Object.entries(checks)) {
    const message = check(form.elements[field].value);
    showError(field, message);
    if (message) ok = false;
  }
  if (!ok) event.preventDefault();
});
