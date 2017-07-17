var password = document.querySelector('#password');
var confirmPassword = document.querySelector('#password-confirm');

function onChangeSubmit (e) {
    if (password.value !== confirmPassword.value) {
        e.preventDefault();
        alert('Your passwords do not match!')
    }
}

document.querySelector('#form-change-password').addEventListener('submit', onChangeSubmit);