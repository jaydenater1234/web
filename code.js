document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickMeButton');
    const message = document.getElementById('message');
    button.addEventListener('click', function() {
        message.textContent = 'im jayden im learning how to code ';
    });
});

