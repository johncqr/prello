var PORT = 3000;
var HOST = `http://localhost:${PORT}`;

var $emailInput = $('#email-input');

$('#reset-submit').click(function () {
    if ($emailInput.val() !== '') {
        $.ajax({
            url: `${HOST}/forgot`,
            data: {
                email: $emailInput.val(),
            },
            type: 'POST',
        });
    } else {
        alert('Please input an email.');
    }
});
