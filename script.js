/* ==========================================================================
   INICIALIZAÇÃO
   - Configuração inicial e carregamento do DOM
========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================================================
       1. ANIMAÇÃO DO CÍRCULO DE PROGRESSO
       - Observa e anima os círculos de progresso das skills
    ========================================================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.progress-circle').forEach((circle) => {
        observer.observe(circle);
    });

    /* ==========================================================================
       2. ANIMAÇÃO DA SEÇÃO DE SKILLS
       - Observa e anima a seção inteira de habilidades
    ========================================================================== */
    const skillsSection = document.querySelector('.skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsSection.classList.add('animate');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.7
    });

    skillsObserver.observe(skillsSection);

    /* ==========================================================================
       3. ANIMAÇÕES DE SCROLL
       - Efeitos fade e scale ao rolar a página
    ========================================================================== */
    const scrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right, .scale-up').forEach((el) => {
        scrollAnimationObserver.observe(el);
    });

    /* ==========================================================================
       5. EFEITO DE BRILHO NA FOTO
       - Brilho que segue o cursor do mouse
    ========================================================================== */
    document.querySelector('.foto-container').addEventListener('mousemove', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        e.target.style.setProperty('--mouse-x', `${x}%`);
        e.target.style.setProperty('--mouse-y', `${y}%`);
    });

    /* ==========================================================================
       6. NAVEGAÇÃO SUAVE
       - Scroll suave para links do menu
    ========================================================================== */
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 