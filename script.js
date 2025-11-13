// Initialisation d'EmailJS avec votre clé
(function() {
    emailjs.init("_ZXoqWAuSvrItSXKP");
})();

// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTop > 300) {
        scrollToTopBtn.classList.add('active');
    } else {
        scrollToTopBtn.classList.remove('active');
    }
});

// Scroll to top functionality
document.querySelector('.scroll-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Téléchargement du CV
document.getElementById('downloadCV').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Créer un lien de téléchargement pour le CV
    const link = document.createElement('a');
    link.href = 'assets/documents/CV_NGOMA_Fils.pdf';
    link.download = 'CV_NGOMA_Fils.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Message de confirmation
    alert('Votre CV est en cours de téléchargement!');
});

// Formulaire de contact avec EmailJS
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('formSpinner');
    const messageDiv = document.getElementById('formMessage');
    
    // Récupérer les valeurs du formulaire
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validation des champs
    if (!name || !email || !subject || !message) {
        messageDiv.textContent = 'Veuillez remplir tous les champs obligatoires.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageDiv.textContent = 'Veuillez entrer une adresse email valide.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Afficher le spinner et désactiver le bouton
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    messageDiv.style.display = 'none';
    
    // Préparer les paramètres pour EmailJS
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: `Portfolio: ${subject}`,
        message: message,
        to_email: 'filsngoma475@gmail.com',
        date: new Date().toLocaleString('fr-FR')
    };
    
    console.log('Envoi du message en cours...', templateParams);
    
    // Envoyer l'email via EmailJS
    emailjs.send('service_k9kr4ed', 'template_5tmeqth', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Afficher le message de succès
            messageDiv.textContent = '✅ Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.';
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
            
            // Réinitialiser le formulaire
            document.getElementById('contactForm').reset();
        }, function(error) {
            console.log('FAILED...', error);
            
            // Message d'erreur détaillé
            let errorMessage = 'Erreur lors de l\'envoi du message. ';
            
            if (error.text) {
                if (error.text.includes('User')) {
                    errorMessage += 'Problème d\'authentification EmailJS. ';
                } else if (error.text.includes('Template')) {
                    errorMessage += 'Template EmailJS introuvable. ';
                }
            }
            
            errorMessage += 'Veuillez réessayer ou me contacter directement à filsngoma475@gmail.com';
            
            messageDiv.textContent = errorMessage;
            messageDiv.className = 'form-message error';
            messageDiv.style.display = 'block';
        })
        .finally(function() {
            // Réactiver le bouton et cacher le spinner
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        });
});

// Animation des éléments au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.timeline-item, .skill-category, .about-text, .about-image, .resource-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Vérification que EmailJS est chargé
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS non chargé! Vérifiez le script dans le HTML.');
    } else {
        console.log('EmailJS chargé avec succès');
    }
});