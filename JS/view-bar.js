document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav__links');

    menuIcon.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});