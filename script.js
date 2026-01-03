// Custom cursor tracking
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('body::before');
    // Use CSS variables to update cursor position
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});

// Add CSS for cursor position tracking
const style = document.createElement('style');
style.textContent = `
    body::before {
        left: var(--mouse-x, 50%);
        top: var(--mouse-y, 50%);
        transform: translate(-50%, -50%);
    }
`;
document.head.appendChild(style);

// Screen transition function
function transitionToScreen(fromScreenId, toScreenId) {
    const fromScreen = document.getElementById(fromScreenId);
    const toScreen = document.getElementById(toScreenId);

    // Add comic book zoom effect during transition
    const crtContainer = document.querySelector('.crt-container');
    crtContainer.style.animation = 'comicZoom 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    setTimeout(() => {
        fromScreen.classList.remove('active');

        setTimeout(() => {
            toScreen.classList.add('active');
            crtContainer.style.animation = 'panelPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 100);
    }, 200);
}

// Add comic book transition animation
const comicTransitionStyle = document.createElement('style');
comicTransitionStyle.textContent = `
    @keyframes comicZoom {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(0.95) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(comicTransitionStyle);

// Opening screen - Start game button
const startOption = document.querySelector('.start-option');
if (startOption) {
    startOption.addEventListener('click', () => {
        // Play click sound effect (you can add audio later)
        transitionToScreen('opening-screen', 'home-screen');
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        const openingScreen = document.getElementById('opening-screen');
        if (openingScreen.classList.contains('active') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            transitionToScreen('opening-screen', 'home-screen');
        }
    });
}

// Home screen menu items
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const menuType = item.getAttribute('data-menu');

        // Add click feedback
        item.style.animation = 'menuClick 0.2s ease-out';
        setTimeout(() => {
            item.style.animation = '';
        }, 200);

        // Handle different menu actions
        switch(menuType) {
            case 'character':
                console.log('Character selection clicked');
                // Add your character selection logic here
                break;
            case 'gamemode':
                console.log('Game mode clicked');
                transitionToScreen('home-screen', 'gamemode-screen');
                break;
            case 'start':
                console.log('Start game clicked');
                // Add your start game logic here
                break;
        }
    });

    // Add hover sound trigger (you can add audio later)
    item.addEventListener('mouseenter', () => {
        // Trigger hover sound
    });
});

// Add menu click animation
const menuClickStyle = document.createElement('style');
menuClickStyle.textContent = `
    @keyframes menuClick {
        0% { transform: translateX(10px) scale(1); }
        50% { transform: translateX(15px) scale(0.98); }
        100% { transform: translateX(10px) scale(1); }
    }
`;
document.head.appendChild(menuClickStyle);

// Comic book effects removed - keeping clean comic aesthetic

// Keyboard navigation for menu
let currentMenuIndex = 0;
const homeMenuItems = Array.from(document.querySelectorAll('.menu-item'));

document.addEventListener('keydown', (e) => {
    const homeScreen = document.getElementById('home-screen');
    if (!homeScreen.classList.contains('active')) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex + 1) % homeMenuItems.length;
        highlightMenuItem(currentMenuIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex - 1 + homeMenuItems.length) % homeMenuItems.length;
        highlightMenuItem(currentMenuIndex);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        homeMenuItems[currentMenuIndex].click();
    }
});

function highlightMenuItem(index) {
    homeMenuItems.forEach((item, i) => {
        if (i === index) {
            item.style.borderLeftWidth = '12px';
            item.style.transform = 'translateX(10px)';
            item.style.boxShadow = '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan)';
        } else {
            item.style.borderLeftWidth = '6px';
            item.style.transform = 'translateX(0)';
            item.style.boxShadow = 'none';
        }
    });
}

// Initialize first menu item highlight
if (homeMenuItems.length > 0) {
    highlightMenuItem(0);
}

// Add boot-up text effect on load
window.addEventListener('load', () => {
    console.log('%c SYSTEM INITIALIZING...', 'color: #00fff9; font-family: monospace; font-size: 16px;');
    console.log('%c LOADING UNRIVALABLE...', 'color: #ff00ff; font-family: monospace; font-size: 16px;');
    console.log('%c READY', 'color: #39ff14; font-family: monospace; font-size: 16px;');
});

// Back button functionality
const backButtons = document.querySelectorAll('.back-button');
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetScreen = button.getAttribute('data-back');
        const currentScreen = button.closest('.screen').id;
        transitionToScreen(currentScreen, targetScreen);
    });
});

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let selectedGameMode = null;

const gameModeNames = {
    'deathmatch': 'Dan Rhon Deathmatch',
    'chexico': 'Charge on Chexico',
    'turfwar': 'Tessarune Turf War',
    'squirt': 'Squirt!',
    'hoedown': 'Duo Hoedown',
    'campaign': 'Campaign',
    'story': 'Story Mode'
};

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    currentSlideIndex = index;
}

// Previous button
document.getElementById('carousel-prev').addEventListener('click', () => {
    let newIndex = currentSlideIndex - 1;
    if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    showSlide(newIndex);
});

// Next button
document.getElementById('carousel-next').addEventListener('click', () => {
    let newIndex = currentSlideIndex + 1;
    if (newIndex >= slides.length) {
        newIndex = 0;
    }
    showSlide(newIndex);
});

// Indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
    });
});

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    const gamemodeScreen = document.getElementById('gamemode-screen');
    if (!gamemodeScreen.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        document.getElementById('carousel-prev').click();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        document.getElementById('carousel-next').click();
    }
});

// Select mode buttons
const selectButtons = document.querySelectorAll('.select-mode-btn');
selectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const slide = e.target.closest('.carousel-slide');
        const mode = slide.getAttribute('data-mode');
        selectedGameMode = mode;

        console.log(`Selected game mode: ${mode}`);

        // Update the home screen to show selected mode
        const selectedDisplay = document.getElementById('selected-gamemode');
        selectedDisplay.textContent = gameModeNames[mode];
        selectedDisplay.style.animation = 'selectedPulse 0.5s ease-out';
        setTimeout(() => {
            selectedDisplay.style.animation = '';
        }, 500);

        // Return to home screen
        transitionToScreen('gamemode-screen', 'home-screen');
    });
});

// Add selected pulse animation
const selectedPulseStyle = document.createElement('style');
selectedPulseStyle.textContent = `
    @keyframes selectedPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); color: var(--neon-pink); text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(selectedPulseStyle);
