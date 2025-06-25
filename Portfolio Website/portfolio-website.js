document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.querySelector('.theme-toggle');
    const body = document.body;

    const userTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = userTheme === 'dark' || (!userTheme && prefersDark);

    if (shouldUseDark) {
        body.classList.add('dark-theme');
        toggleBtn.innerHTML = '<iconify-icon icon="emojione:sun"></iconify-icon>';
    } else {
        toggleBtn.innerHTML = '<iconify-icon icon="emojione:crescent-moon"></iconify-icon>';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-theme');
        toggleBtn.innerHTML = isDark
            ? '<iconify-icon icon="emojione:sun"></iconify-icon>'
            : '<iconify-icon icon="emojione:crescent-moon"></iconify-icon>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    cards.forEach(card => observer.observe(card));
});