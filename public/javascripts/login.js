function onRegistrationSubmit (e) {
    var password = document.querySelector('#password');
    var confirmPassword = document.querySelector('#password-confirm');
    if (password.value !== confirmPassword.value) {
        e.preventDefault();
        alert('Your passwords do not match!')
    }
}

document.querySelector('#form-registration').addEventListener('submit', onRegistrationSubmit);