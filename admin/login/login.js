// Get form element
const form = document.getElementById('login-form');

// Add event listener to form submit
form.addEventListener('submit', function (event) {
  event.preventDefault(); // prevent form from submitting

  // Check if username and password are valid
  if (isValidUsernameAndPassword()) {
    window.location.href = '../dashboard/dashboard.html'; // redirect to dashboard page if inputs are valid
  } else {
    alert('Invalid username or password.'); // show error message if inputs are invalid
  }
});

// Validate username and password
function isValidUsernameAndPassword() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  // Check if username and password match
  return usernameInput.value === 'admin' && passwordInput.value === 'admin';
}