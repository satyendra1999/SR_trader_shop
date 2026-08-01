// ===== CONFIG =====
const API_URL = window.CONFIG?.API_URL || 'http://localhost:3000/api';

// ===== DOM ELEMENTS =====
const form = document.getElementById('queryForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const responseDiv = document.getElementById('responseMessage');

// ===== CHARACTER COUNT =====
messageInput.addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('charCount').textContent = `${count} / 500`;
    
    if (count > 450) {
        document.getElementById('charCount').style.color = '#e74c3c';
    } else {
        document.getElementById('charCount').style.color = '#999';
    }
});

// ===== VALIDATION =====
function validateField(input, errorId) {
    const errorEl = document.getElementById(errorId);
    const value = input.value.trim();
    
    if (!value) {
        errorEl.textContent = 'This field is required';
        errorEl.classList.add('visible');
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        errorEl.textContent = 'Enter a valid email';
        errorEl.classList.add('visible');
        return false;
    }
    
    errorEl.classList.remove('visible');
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Real-time validation
nameInput.addEventListener('blur', () => validateField(nameInput, 'nameError'));
emailInput.addEventListener('blur', () => validateField(emailInput, 'emailError'));
messageInput.addEventListener('blur', () => validateField(messageInput, 'messageError'));

// ===== FORM SUBMIT =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate
    const isValid = validateField(nameInput, 'nameError') &&
                   validateField(emailInput, 'emailError') &&
                   validateField(messageInput, 'messageError');
    
    if (!isValid) return;
    
    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    responseDiv.style.display = 'none';
    
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim() || 'N/A',
        subject: subjectInput.value,
        message: messageInput.value.trim()
    };
    
    try {
        const response = await fetch(`${API_URL}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResponse('✅ Your message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            document.getElementById('charCount').textContent = '0 / 500';
        } else {
            showResponse('❌ ' + data.message, 'error');
        }
    } catch (error) {
        showResponse('❌ Network error. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
});

function showResponse(message, type) {
    responseDiv.textContent = message;
    responseDiv.className = type;
    responseDiv.style.display = 'block';
    
    setTimeout(() => {
        responseDiv.style.display = 'none';
    }, 5000);
}

// ===== MOBILE NAV =====
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});