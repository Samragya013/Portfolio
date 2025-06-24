// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
    });
});

// Theme Toggle Functionality
const themeToggleBtn = document.querySelector('#theme-toggle-btn');

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    setTheme(currentTheme);
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

// Chatbot Functionality
const chatBubble = document.querySelector('.chat-bubble');
const chatbotOverlay = document.querySelector('.chatbot-overlay');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('#chatbot-input');
const chatbotSend = document.querySelector('#chatbot-send');
const chatbotMessages = document.querySelector('#chatbot-messages');
const fullName = 'Samragya Banerjee';
const GEMINI_API_KEY = 'AIzaSyAwRuPZugg8kpZ4ELNBjB4AGlqPeZCW7to'; // Replace with your actual Gemini API key
const myDescription = document.querySelector('#my-description').textContent;

let isInitialMessageShown = false;
chatBubble.addEventListener('click', () => {
    chatbotOverlay.classList.toggle('active');
    if (!isInitialMessageShown) {
        const initialMessage = document.createElement('div');
        initialMessage.classList.add('message', 'ai-message');
        initialMessage.innerHTML = `<p>Hi, I am ${fullName}, what do you want to know about me?</p>`;
        chatbotMessages.appendChild(initialMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        isInitialMessageShown = true;
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotOverlay.classList.remove('active');
});

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const messageText = chatbotInput.value.trim();
    if (!messageText) return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.innerHTML = `<p>${messageText}</p>`;
    chatbotMessages.appendChild(userMessage);
    chatbotInput.value = '';

    const typingMessage = document.createElement('div');
    typingMessage.classList.add('message', 'typing-message');
    typingMessage.innerHTML = `
        <span>Typing</span>
        <div class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatbotMessages.appendChild(typingMessage);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        chatbotMessages.removeChild(typingMessage);
        showDummyResponse();
        return;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `User_message: ${messageText}. Reply naturally to the usermessage and if required then answer based on: ${myDescription} or just simply give friendly reply. And reply in a way that ${fullName} is himself talking. Reply in short sentences.`
                        }]
                    }]
                })
            }
        );

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn’t process that. Try again?';
        chatbotMessages.removeChild(typingMessage);

        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'ai-message');
        aiMessage.innerHTML = `<p>${aiResponse}</p>`;
        chatbotMessages.appendChild(aiMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    } catch (error) {
        console.error('Error fetching Gemini API:', error);
        chatbotMessages.removeChild(typingMessage);
        showDummyResponse();
    }
}

function showDummyResponse() {
    setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'ai-message');
        aiMessage.innerHTML = `<p>Hey, thanks for asking! I'm working on getting smarter, but for now, I can tell you I'm passionate about data analysis. What else do you want to know?</p>`;
        chatbotMessages.appendChild(aiMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);
}

// Project Card Logic
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const link = card.getAttribute('data-link');
        if (link) {
            window.open(link, '_blank');
        }
    });
});