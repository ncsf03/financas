document.body.addEventListener('click', (e) =>{
    if (e.target.classList.contains('btn-transacao'))
        document.addEventListener('DOMContentLoaded', () => {
            const saldoCard = document.querySelector('.saldo-card')
            if (saldoCard) {
                saldoCard.classList.add('animate__animated', 'animate__pulse')
            }
        })
})