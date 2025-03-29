// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Initialize chat window
    if (chatWindow) {
        chatWindow.classList.add('hidden');
    }

    // Toggle chatbot
    if (chatbotToggle && chatWindow) {
        chatbotToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
            }
        });
    }

    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (chatWindow && !chatWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatWindow.classList.add('hidden');
        }
    });

    // Prevent closing when clicking inside chat window
    if (chatWindow) {
        chatWindow.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Send message
    if (sendButton && chatInput && chatMessages) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Add initial welcome message
    if (chatMessages) {
        addMessage("Hello! I'm your museum assistant. How can I help you today?", 'bot');
    }
});

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Get and add bot response
        const response = getBotResponse(message);
        setTimeout(() => addMessage(response, 'bot'), 500);
    }
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `p-3 rounded-lg mb-2 ${sender === 'user' ? 'bg-[#8B4513] text-white ml-auto' : 'bg-[#F5F5DC] text-[#8B4513]'} max-w-[80%]`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chatbot responses
const responses = {
    greeting: ["Hello!", "Hi there!", "Welcome to Heritage Museum!"],
    farewell: ["Goodbye!", "See you soon!", "Have a great day!"],
    museum_info: [
        "The Heritage Museum is open Monday-Friday 9:00 AM - 5:00 PM, and Saturday-Sunday 10:00 AM - 6:00 PM.",
        "We're located at 123 Museum Street, City, Country.",
        "You can reach us at (123) 456-7890."
    ],
    exhibitions: [
        "We currently have several exhibitions: Mughal Era Treasures, Ancient Indian Civilizations, and Temple Architecture.",
        "Our upcoming exhibitions include Indian Classical Music and Folk Art Collection."
    ],
    tickets: [
        "You can book tickets online through our website or at the museum counter.",
        "We offer various ticket types: General Admission, Guided Tour, and Special Exhibition tickets."
    ],
    default: ["I'm not sure about that. Could you please rephrase your question?", "I don't have information about that. Would you like to speak with a staff member?"]
};

function getBotResponse(message) {
    message = message.toLowerCase();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings)/)) {
        return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    // Check for farewells
    if (message.match(/^(bye|goodbye|see you|farewell)/)) {
        return responses.farewell[Math.floor(Math.random() * responses.farewell.length)];
    }
    
    // Check for museum information
    if (message.match(/^(hours|open|when|time|location|where|address|phone|contact)/)) {
        return responses.museum_info[Math.floor(Math.random() * responses.museum_info.length)];
    }
    
    // Check for exhibitions
    if (message.match(/^(exhibition|exhibit|show|display|collection|art|gallery)/)) {
        return responses.exhibitions[Math.floor(Math.random() * responses.exhibitions.length)];
    }
    
    // Check for tickets
    if (message.match(/^(ticket|book|reserve|price|cost|fee|admission)/)) {
        return responses.tickets[Math.floor(Math.random() * responses.tickets.length)];
    }
    
    // Default response
    return responses.default[Math.floor(Math.random() * responses.default.length)];
}

// Authentication functionality
function logout() {
    // Clear any stored authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    const userToken = localStorage.getItem('userToken');
    const loginLink = document.querySelector('a[href="login.html"]');
    const signupLink = document.querySelector('a[href="signup.html"]');
    
    if (userToken) {
        // User is logged in
        if (loginLink) loginLink.textContent = 'Logout';
        if (loginLink) loginLink.href = '#';
        if (loginLink) loginLink.onclick = logout;
        if (signupLink) signupLink.style.display = 'none';
    } else {
        // User is not logged in
        if (loginLink) loginLink.textContent = 'Login';
        if (loginLink) loginLink.href = 'login.html';
        if (loginLink) loginLink.onclick = null;
        if (signupLink) signupLink.style.display = 'inline';
    }
}

// Initialize authentication check
document.addEventListener('DOMContentLoaded', checkAuth);

// Payment form handling
const paymentForm = document.getElementById('paymentForm');
const paymentMethodButtons = document.querySelectorAll('#paymentForm button[type="button"]');

let selectedPaymentMethod = null;

paymentMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
        paymentMethodButtons.forEach(btn => btn.classList.remove('border-[#8B4513]'));
        button.classList.add('border-[#8B4513]');
        selectedPaymentMethod = button.querySelector('img').alt;
    });
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    // Here you would typically integrate with a payment gateway
    alert('Payment processing would happen here in production');
});

// Enhanced booking form handling
const bookingForm = document.getElementById('bookingForm');
const entryTypeSelect = bookingForm.querySelector('select');
const dateInput = bookingForm.querySelector('input[type="date"]');
const timeSelect = bookingForm.querySelector('select:last-of-type');
const visitorsInput = bookingForm.querySelector('input[type="number"]');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Calculate total price
function calculateTotal() {
    const entryType = entryTypeSelect.value;
    const numVisitors = parseInt(visitorsInput.value) || 0;
    const basePrice = entryType === 'museum' ? 15 : 25;
    const total = basePrice * numVisitors;
    
    // Update order summary in payment section
    const orderSummary = document.querySelector('#payment .space-y-2');
    if (orderSummary) {
        orderSummary.innerHTML = `
            <div class="flex justify-between">
                <span>${entryType === 'museum' ? 'Museum Entry' : 'Special Exhibition'} (${numVisitors})</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="border-t pt-2 mt-2">
                <div class="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
}

// Add event listeners for price calculation
entryTypeSelect.addEventListener('change', calculateTotal);
visitorsInput.addEventListener('input', calculateTotal);

// Form validation
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        entryType: entryTypeSelect.value,
        date: dateInput.value,
        time: timeSelect.value,
        visitors: visitorsInput.value
    };

    // Validate form
    if (!formData.date || !formData.time || !formData.visitors) {
        alert('Please fill in all fields');
        return;
    }

    // Scroll to payment section
    document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
});

// Initialize price calculation
calculateTotal();

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Exhibition card hover effect
document.querySelectorAll('.exhibition-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Form input validation
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.classList.add('border-red-500');
            input.classList.remove('border-[#DEB887]');
        } else {
            input.classList.remove('border-red-500');
            input.classList.add('border-[#DEB887]');
        }
    });
});

// Card number formatting
const cardInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
if (cardInput) {
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });
}

// Date input validation
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a future date');
            dateInput.value = '';
        }
    });
}

// Time slot availability check
if (timeSelect) {
    timeSelect.addEventListener('change', () => {
        const selectedTime = timeSelect.value;
        const selectedDate = dateInput.value;
        
        if (selectedDate && selectedTime) {
            // Simulate checking availability
            const isAvailable = Math.random() > 0.5;
            if (!isAvailable) {
                alert('This time slot is no longer available. Please select another time.');
                timeSelect.value = '';
            }
        }
    });
}

// Payment method selection animation
const paymentButtons = document.querySelectorAll('.payment-method-button');
paymentButtons.forEach(button => {
    button.addEventListener('click', () => {
        paymentButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

// Add loading animation for form submission
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="animate-spin">⌛</span> Processing...';
            
            // Simulate form processing
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Complete Payment';
            }, 2000);
        }
    });
});

// Login form handling
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll simulate a successful login
    if (email && password) {
        // Store authentication data
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userData', JSON.stringify({ email }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Initialize payment method selection
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethodButtons = document.querySelectorAll('.payment-method-button');
    
    paymentMethodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            paymentMethodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    });
}); 