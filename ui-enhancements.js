// UI Enhancement Script - Psychology-based interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading states to buttons
    function addLoadingState(button, text = 'Loading...') {
        const originalText = button.textContent;
        button.textContent = text;
        button.disabled = true;
        button.classList.add('loading');
        
        return function removeLoading() {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        };
    }
    
    // Add success feedback
    function showSuccess(element, message = 'Success!') {
        element.classList.add('success');
        const originalText = element.textContent;
        element.textContent = message;
        
        setTimeout(() => {
            element.classList.remove('success');
            element.textContent = originalText;
        }, 2000);
    }
    
    // Add error feedback
    function showError(element, message = 'Error occurred') {
        element.classList.add('error');
        const originalText = element.textContent;
        element.textContent = message;
        
        setTimeout(() => {
            element.classList.remove('error');
            element.textContent = originalText;
        }, 3000);
    }
    
    // Enhance form interactions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add focus animations
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.post');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards for scroll animations
    document.querySelectorAll('.post').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add progress indicator for forms
    function updateFormProgress(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        const filled = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const progress = (filled / inputs.length) * 100;
        
        let progressBar = form.querySelector('.form-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = '<div class="form-progress-bar"></div>';
            form.insertBefore(progressBar, form.firstChild);
        }
        
        const bar = progressBar.querySelector('.form-progress-bar');
        bar.style.width = `${progress}%`;
    }
    
    // Monitor form progress
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => updateFormProgress(form));
            input.addEventListener('change', () => updateFormProgress(form));
        });
        updateFormProgress(form);
    });
    
    // Add toast notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Expose functions globally
    window.UIEnhancements = {
        addLoadingState,
        showSuccess,
        showError,
        showToast
    };
});

// Add CSS for enhancements
const enhancementStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.form-progress {
    width: 100%;
    height: 4px;
    background-color: #e2e8f0;
    border-radius: 2px;
    margin-bottom: 1rem;
    overflow: hidden;
}

.form-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #10b981);
    border-radius: 2px;
    transition: width 0.3s ease;
    width: 0%;
}

.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.show {
    transform: translateX(0);
}

.toast-info {
    background: #2563eb;
}

.toast-success {
    background: #10b981;
}

.toast-error {
    background: #ef4444;
}

.toast-warning {
    background: #f59e0b;
}

.focused {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

.has-value {
    background-color: #f0f9ff;
}

button {
    position: relative;
    overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
    .ripple {
        animation: none;
    }
    
    .toast {
        transition: none;
    }
    
    .focused {
        transform: none;
    }
}
`;

// Inject enhancement styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancementStyles;
document.head.appendChild(styleSheet);