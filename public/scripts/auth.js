document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const container = document.querySelector('.auth-container')
    container.classList.add('fade-out')

    setTimeout(() => {
        e.target.submit()
    }, 800)
})