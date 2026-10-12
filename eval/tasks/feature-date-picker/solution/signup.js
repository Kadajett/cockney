// Client-side checks for the signup form. The server re-validates everything.
const form = document.getElementById('signup-form');

function showError(field, message) {
  const el = document.getElementById(`${field}-error`);
  el.textContent = message;
  el.hidden = !message;
  document.getElementById(field).setAttribute('aria-invalid', message ? 'true' : 'false');
}

// Latest date of birth (YYYY-MM-DD, local time) for someone who is at least 13 today.
function latestDobFor13() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 13);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

form.elements.dob.max = latestDobFor13();

const checks = {
  name: (v) => (v.trim() ? '' : 'Please enter your name.'),
  email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Please enter a valid email address.'),
  dob: (v) => (!v ? 'Please enter your date of birth.' : v > latestDobFor13() ? 'You must be at least 13 to sign up.' : ''),
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
