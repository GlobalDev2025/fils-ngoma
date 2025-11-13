// Initialisation d'EmailJS avec votre clé
(function() {
    console.log('Initialisation EmailJS avec la clé:', '_ZXoqWAuSvrItSXKP');
    emailjs.init("_ZXoqWAuSvrItSXKP");
    console.log('EmailJS initialisé');
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

// Fonction pour envoyer avec EmailJS
function sendEmailWithEmailJS(formData) {
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('formSpinner');
    const messageDiv = document.getElementById('formMessage');
    
    // Afficher le spinner et désactiver le bouton
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    messageDiv.style.display = 'none';
    
    const { name, email, subject, message } = formData;
    
    // Préparer les paramètres pour EmailJS
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'filsngoma475@gmail.com',
        reply_to: email,
        date: new Date().toLocaleString('fr-FR')
    };
    
    console.log('Tentative d\'envoi avec EmailJS:', templateParams);
    
    // Envoyer l'email via EmailJS
    return emailjs.send('service_k9kr4ed', 'template_5tmeqth', templateParams)
        .then(function(response) {
            console.log('SUCCESS EmailJS!', response);
            
            // Afficher le message de succès
            messageDiv.textContent = '✅ Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.';
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
            
            // Réinitialiser le formulaire
            document.getElementById('contactForm').reset();
            return true;
        }, function(error) {
            console.log('FAILED EmailJS...', error);
            return false;
        })
        .finally(function() {
            // Réactiver le bouton et cacher le spinner
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        });
}

// Solution de secours - Redirection mailto
function sendEmailFallback(formData) {
    const { name, email, subject, message } = formData;
    
    const body = `Nom: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
    const mailtoLink = `mailto:filsngoma475@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
    return true;
}

// Modifier la fonction d'envoi pour inclure la solution de secours
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('formSpinner');
    const messageDiv = document.getElementById('formMessage');
    
    // Récupérer les valeurs du formulaire
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value, 
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Validation des champs
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        messageDiv.textContent = 'Veuillez remplir tous les champs obligatoires.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        messageDiv.textContent = 'Veuillez entrer une adresse email valide.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Afficher le spinner et désactiver le bouton
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    messageDiv.style.display = 'none';
    
    console.log('Tentative d\'envoi du formulaire...');
    
    // Essayer d'abord EmailJS, puis solution de secours
    sendEmailWithEmailJS(formData)
        .then(success => {
            if (!success) {
                console.log('EmailJS a échoué, utilisation de la solution de secours...');
                // Afficher un message informatif
                messageDiv.textContent = 'Ouverture de votre client email... Veuillez envoyer le message pré-rempli.';
                messageDiv.className = 'form-message success';
                messageDiv.style.display = 'block';
                
                // Utiliser la solution de secours
                sendEmailFallback(formData);
                
                // Réinitialiser le formulaire après un délai
                setTimeout(() => {
                    document.getElementById('contactForm').reset();
                }, 2000);
            }
        })
        .catch(error => {
            console.log('Erreur lors de l\'envoi:', error);
            // En cas d'erreur, utiliser directement la solution de secours
            messageDiv.textContent = 'Ouverture de votre client email... Veuillez envoyer le message pré-rempli.';
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
            
            sendEmailFallback(formData);
            
            // Réinitialiser le formulaire après un délai
            setTimeout(() => {
                document.getElementById('contactForm').reset();
            }, 2000);
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
document.querySelectorAll('.timeline-item, .skill-category, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Test EmailJS au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== TEST EmailJS ===');
    console.log('Service ID: service_k9kr4ed');
    console.log('Template ID: template_5tmeqth');
    console.log('Public Key: _ZXoqWAuSvrItSXKP');
    console.log('EmailJS object:', emailjs);
    console.log('====================');
});