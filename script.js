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
// SAFE START BUTTON LOGIC
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Searching for Start Button...");
    
    const startOption = document.querySelector('.start-option');
    
    if (startOption) {
        console.log("Start Button Found. Attaching listener.");
        
        startOption.addEventListener('click', (e) => {
            console.log("Start Button Clicked!");
            e.preventDefault(); // Stop any weird default behaviors
            transitionToScreen('opening-screen', 'home-screen');
        });

        // Add keyboard support (Enter/Space)
        document.addEventListener('keydown', (e) => {
            const openingScreen = document.getElementById('opening-screen');
            if (openingScreen && openingScreen.classList.contains('active')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log("Key Press Detected");
                    e.preventDefault();
                    transitionToScreen('opening-screen', 'home-screen');
                }
            }
        });
    } else {
        console.error("CRITICAL ERROR: .start-option element not found in HTML!");
    }
});

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
                transitionToScreen('home-screen', 'character-screen');
                break;
            case 'gamemode':
                console.log('Game mode clicked');
                transitionToScreen('home-screen', 'gamemode-screen');
                break;
            case 'start':
                console.log('Start game clicked');
                startGame();
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

// Randomize button
const randomizeBtn = document.getElementById('randomize-btn');
if (randomizeBtn) {
    randomizeBtn.addEventListener('click', () => {
        randomSelection();
    });
}

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

        // Check if the mode is disabled
        if (slide.getAttribute('data-disabled') === 'true') {
            console.log('This mode is not available yet');
            return;
        }

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

// Hero Carousel System
let currentHeroIndex = 0;
let heroSlides = [];
let selectedHero = null;

// Class color mapping
const classColors = {
    'Destroyer': { primary: '#00BFFF', secondary: '#00FFFF' },
    'Defender': { primary: '#FF3366', secondary: '#FF8833' },
    'Saboteur': { primary: '#AA66FF', secondary: '#FF00FF' },
    'Supporter': { primary: '#00FF88', secondary: '#FFD700' },
    'Controller': { primary: '#FFD700', secondary: '#FF8833' },
    'Hawktalker': { primary: '#FF1493', secondary: '#FF69B4' }
};

// Embedded heroes data - loaded from heroes_abilities.json
const heroesData = {
  "metadata": {
    "total_heroes": 46,
    "total_classes": 6,
    "description": "Structured ability data for all Unrivalable heroes"
  },
  "classes": [
    {
      "name": "Destroyer",
      "icon": "destroyer.png",
      "hero_count": 9,
      "heroes": [
        {
          "name": "Mr Unemployable",
          "image": "mr-unemployable.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "What goes forth",
              "description": "Throws random objects from his inventory at enemies. If he misses, they stay on the ground"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Must come back",
              "description": "When triggered, all items thrown zip back to him"
            },
            "ability_2": {
              "name": "Big Ol Boomerang",
              "description": "Throws a big ol boomerang that doesn't come back"
            },
            "super": {
              "name": "Vape Juice Storm",
              "description": "Rapidly chucks balls of radioactive vape juice around himself while simultaneously retracting them, creating a whirlwind of vape juice"
            }
          }
        },
        {
          "name": "James Madison",
          "image": "james-madison.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Well Regulated Militia",
              "description": "Fires a burst from his assault rifle"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Bear Strike",
              "description": "James Madison unleashed a feral strike with his bear arms, dealing massive damage up close"
            },
            "ability_2": {
              "name": "Amend",
              "description": "James Madison signs off on his bill, marking an enemy for amendment. If their HP drops to a low enough percentage they are immediately killed"
            },
            "super": {
              "name": "Double Jeopardy",
              "description": "James Madison grabs the nearest enemy and puts them in the game show Jeopardy. If they win once, he puts them in again and shoots them. If they lose they die"
            }
          }
        },
        {
          "name": "Porthole",
          "image": "porthole.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Porthole throw",
              "description": "Throws a porthole forward"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "A Hole new world",
              "description": "Porthole drops a porthole on the ground, slipping through it and popping back out 3 meters behind"
            },
            "ability_2": {
              "name": "Portastic Port-mine",
              "description": "Porthole drops a Porthole on the ground. The porthole is invisible to enemies, and slows them on contact (3 uses)"
            },
            "super": {
              "name": "Underwater Genie",
              "description": "Porthole summons Kneckakeckafallapulu, the underwater genie. He grants porthole one of three wishes, lasting for 20 seconds\nTrue Glass Form: Porthole's shots reveal enemies and deal double damage\nTrue Metal Form: Porthole's shots explode and deal area damage\nTrue Porthole Form: Porthole's shots bounce between enemies"
            }
          }
        },
        {
          "name": "Bitey Whiteys",
          "image": "bitey-whiteys.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Fightey Whiteys",
              "description": "Throws random circus items from his coat, including a juggling pin, tricycle, cannonball, or ⅗ of a clown."
            },
            "passive": {
              "name": "Venomous Rage",
              "description": "Does more damage the closer to death, or immediately after taking damage from a snake themed attack"
            },
            "ability_1": {
              "name": "Bitey Fightey",
              "description": "Bite in a wide area, stunning enemies caught and covering them in saliva"
            },
            "ability_2": {
              "name": "Whitey Righty",
              "description": "Any minority character gets constricted for 5 seconds, taking damage"
            },
            "super": {
              "name": "Hide and go snake",
              "description": "8 snakes spawn around Bitey Whiteys, when he finds them, they bite him, and increase his attack damage and lower cooldowns for 15 seconds. The snake bites do small damage"
            }
          }
        },
        {
          "name": "Iron Pan",
          "image": "iron-pan.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Fry Up",
              "description": "Deliver a mighty uppercut with both pans"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Mighty Magnet",
              "description": "Iron Pan pulls an enemy towards him, dealing small damage"
            },
            "ability_2": {
              "name": "Iron Spy",
              "description": "Iron Pan drops a pan turret on the ground that flings rapid fire bacon at visible enemies"
            },
            "super": {
              "name": "Royal Steel",
              "description": "Grab a humongous pan and slam it down in front of you 3 times, dealing area damage that scales with each hit"
            }
          }
        },
        {
          "name": "The Triplets",
          "image": "the-triplets.png",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Flap, Tackle, and Glop",
              "description": "Footrun flaps his arms, Jetplace tackles forward and Junkrat shoots some fiery glop outta his crotch"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Switcherooski",
              "description": "Switches to the next Triplet"
            },
            "ability_2": {
              "name": "Character Development",
              "description": "Footrun dashes forward, becoming invisible for a few seconds (2 uses). Jetplace uses his portals to teleport behind an enemy. Junkrat fires some larger missiles outta his crotch."
            },
            "super": {
              "name": "Into the Jetplace!",
              "description": "The triplets unite, joining hands and summoning a giant jetpack. They fly around the map dropping rockets outta his crotch and destruction."
            }
          }
        },
        {
          "name": "Tickle Monster",
          "image": "tickle-monster.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Tickle",
              "description": "Tickle"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "High 8",
              "description": "Tickle Monster absolutely slaps somebody twice, first with the first five and then with the second 3"
            },
            "ability_2": {
              "name": "Enhanced Peeling",
              "description": "Can remove negative effects from himself and his teammates for a small amount of time"
            },
            "super": {
              "name": "Tickle Train",
              "description": "Everybody in the area must board a train, specifically a tickle one, and gets violently tickled"
            }
          }
        },
        {
          "name": "Shoulder Blade",
          "image": "shoulder-blade.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Clavi-kill",
              "description": "Puts forth both shoulders one after another for a 2 hit melee combo. Matcha is gained with a hit"
            },
            "passive": {
              "name": "Matcha Power",
              "description": "The more matcha Shoulder Blade has, the more damage he does and takes reduced damage"
            },
            "ability_1": {
              "name": "Rotator Cuff",
              "description": "Spin in a circle that you can control, damaging enemies if you run into them for 10 seconds, gaining matcha."
            },
            "ability_2": {
              "name": "MAAAA CHAAAA",
              "description": "Shoulder blade does a yell and drinks matcha, consuming what his matcha meter is at for health, can overheal, but only lasts 8 seconds"
            },
            "super": {
              "name": "Shishoulder Kabob",
              "description": "Shoulder Blade dons a Nike Tek and shiesty, then dives at a targeted player, shouldering them all throughout the air, dealing damage and splash damage when they hit the ground"
            }
          }
        },
        {
          "name": "Bee's Knees",
          "image": "bees-knees.jpg",
          "class": "Destroyer",
          "abilities": {
            "main_attack": {
              "name": "Knee Combo",
              "description": "Kicks in a wide range, knees forward"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Flying Bee Drop",
              "description": "Jumps in the air and slams down with his knees forward, stinging enemies"
            },
            "ability_2": {
              "name": "Float like a Butterfly",
              "description": "Send a gust of air forward, creating an area of zero-gravity to trap enemies in"
            },
            "super": {
              "name": "Sting like a Knee",
              "description": "Launches rapid-fire stingers from his knees that poison enemies"
            }
          }
        }
      ]
    },
    {
      "name": "Defender",
      "icon": "defender.png",
      "hero_count": 9,
      "heroes": [
        {
          "name": "Handfoot",
          "image": "hand-foot.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Fantastic Fist-Feet Flurry",
              "description": "A 4-hit combo where he punches and kicks"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Hands become feet",
              "description": "Switches around his hands and feet, becoming more than just a man (also increases attack damage)."
            },
            "ability_2": {
              "name": "You'll never know",
              "description": "Handfoot switches his hands and feet so fast that he absorbs projectiles"
            },
            "super": {
              "name": "Flick'a the Wrist",
              "description": "Handfoot enters flowstate, whirling hands and feet so fast while moving forward. He becomes an unstoppable juggernaut of damage and health"
            }
          }
        },
        {
          "name": "Floss",
          "image": "floss.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Who Spiked the Punch?",
              "description": "Floss punches, spikily"
            },
            "passive": {
              "name": "Flossback",
              "description": "Enemies take 1/32nd of all damage they inflict on floss via projectiles"
            },
            "ability_1": {
              "name": "Absorption",
              "description": "For the next 10 seconds, Floss takes 1/3rd of damage from projectiles"
            },
            "ability_2": {
              "name": "Tease and Joke",
              "description": "Floss gets demoralized by the other team for sucking, drawing their attention and firepower to him"
            },
            "super": {
              "name": "Big Spike Thing",
              "description": "The Great Gatsby shoots Floss in the chest with a big spike thing. But then Floss shoots it back super fast out of him and it explodes"
            }
          }
        },
        {
          "name": "Man Guy",
          "image": "man-guy.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Man Punch",
              "description": "Man Guy punches with his long arm like a ma"
            },
            "passive": {
              "name": "Manliness",
              "description": "Man Guy gains increased max health whenever he takes damage, it resets when he dies"
            },
            "ability_1": {
              "name": "Self Harm",
              "description": "Man Guy deals damage to himself, increasing his attack"
            },
            "ability_2": {
              "name": "Super Bones",
              "description": "Man Guy boosts his bones, taking less damage for the next three secs"
            },
            "super": {
              "name": "Guy Kick",
              "description": "Man Guy does a big kick,l that breaks his leg if he hits it he can do it again with more damage"
            }
          }
        },
        {
          "name": "Chair Beard",
          "image": "chair-beard.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "SLAMΜΟ",
              "description": "Chair Beard slammos down with his chair beard, slightly knocking enemies back"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Sit down and rest",
              "description": "Chair Beard sits down, relaxes, and the positive vibes stop enemies from entering"
            },
            "ability_2": {
              "name": "Whack Whack Whack",
              "description": "Chair Beard whacks 3 times, and the 3rd hit sends enemies flying"
            },
            "super": {
              "name": "Anything can be a chair",
              "description": "Chair Beard covers himself in his beard, effectively turning himself into a chair. All enemies in the radius sit on him and then get launched off at Mach 5"
            }
          }
        },
        {
          "name": "Ultraviolet",
          "image": "ultraviolet.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Ultraviolet Umbrella",
              "description": "Ultraviolet stabs with his umbrella, then opens it creating a small shield for 1 sec"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Lavender Lash",
              "description": "Ultraviolet blinds the nearest enemy with his purpleness, blinding them"
            },
            "ability_2": {
              "name": "Mount the Indigoat!",
              "description": "Ultraviolet mounts the indigoat, gaining increased health and speed for 5 secs"
            },
            "super": {
              "name": "Purpleness Explosion",
              "description": "Ultraviolet shines his purpleness, gaining a shield and taunting all nearby enemies into attacking him"
            }
          }
        },
        {
          "name": "Guy Yacht",
          "image": "guy-yacht.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Squirt Gun",
              "description": "Guy Yacht fires high pressure water from his squirt gun"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Bomboclat",
              "description": "Guy Yacht flexes his cheeks, taking 80% less damage from behind for a 5 seconds"
            },
            "ability_2": {
              "name": "Eyes up here",
              "description": "Guy Yacht launches into the air and lands on his butt, buffing the defense of allies he lands around"
            },
            "super": {
              "name": "Fantastic Plastic",
              "description": "Using the plastic in his veins, Guy Yacht hardens his entire body, taking overwhelmingly less damage from all sources"
            }
          }
        },
        {
          "name": "Yeast",
          "image": "yeast.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Swole Wheat",
              "description": "Yeast backhands both ways with the back of his hands"
            },
            "passive": {
              "name": "Yeast",
              "description": "Gains bread passively, or faster by dealing damage. Consuming bread with ALT increases damage and density"
            },
            "ability_1": {
              "name": "Open Sesame",
              "description": "Yeast throws a handful of sesame seeds in a short, wide range, stunning enemies"
            },
            "ability_2": {
              "name": "RISE",
              "description": "Increases bread gained from damage for 8 seconds"
            },
            "super": {
              "name": "Gluten Tolerance",
              "description": "Become giant and bready for 30 seconds. Increases max health and knockback resistance. Can only use Swole Wheat, but it does more damage"
            }
          }
        },
        {
          "name": "Captain Trumpet",
          "image": "captain-trumpet.jpg",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Clawsini Gatini",
              "description": "Captain trumpet scratches twice with cat claws"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Shellala Shellalo",
              "description": "Captain Trumpet gains a shield for 5 secs"
            },
            "ability_2": {
              "name": "Rameo Chargeo",
              "description": "Captain trumpet dashes forward with his ram horns"
            },
            "super": {
              "name": "Trumpets Sounding",
              "description": "Captain trumpet Gains a health boost and a random animal buff:\n-Bunnini - Super jump\n-Peacocko - Taunt at full health\n-Sovereign Snakearms- Main Attack poisons"
            }
          }
        },
        {
          "name": "Gym Shark",
          "image": "gym-shark.png",
          "class": "Defender",
          "abilities": {
            "main_attack": {
              "name": "Barbell strikenado",
              "description": "Gym shark swings in a circle attacking enemies with his barbell"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Bulgarian tail squatnado",
              "description": "Gym shark swings with his tail, all enemies that get hit move as if they are in water for 3 secs"
            },
            "ability_2": {
              "name": "Sharknado",
              "description": "Gym shark gets a space sharknado around him, he takes less damage and damages any enemies standing too close"
            },
            "super": {
              "name": "ROIDNADO",
              "description": "Swims under ground and eats one person, killing them"
            }
          }
        }
      ]
    },
    {
      "name": "Saboteur",
      "icon": "saboteur.png",
      "hero_count": 9,
      "heroes": [
        {
          "name": "Captain Crunch",
          "image": "captain-crunch.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Get you by the Knife",
              "description": "Captain Crunch Stabs enemies with his knife"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Oops all berries",
              "description": "Captain Crunch spills berries on the ground, slowing enemies around him"
            },
            "ability_2": {
              "name": "Crunch Surprise",
              "description": "Captain crunch hides in a bush, and his next knife has a dash and does extra damage"
            },
            "super": {
              "name": "Take you to his special island",
              "description": "Captain crunch Takes himself and the nearest enemy to his special island for 10 secs, where he has increased stats"
            }
          }
        },
        {
          "name": "Jonnakiss",
          "image": "jonnakiss.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Grass Throw",
              "description": "Jonnakiss throws grass, dealing more damage the closer the enemy is"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Sharp Grass",
              "description": "Jonnakiss sharpens his grass so that it does max damage at all distances for the next three throws"
            },
            "ability_2": {
              "name": "Thundercloud mode",
              "description": "Jonnakiss quickly becomes a cloud then immediately shoots down in a lightning bolt, dealing massive damage"
            },
            "super": {
              "name": "Eat the grass!",
              "description": "Jonnakiss eats his grass, turning him into a invincible cloud for 15 seconds, he comes down on the ground as it snows slowing enemies in his area"
            }
          }
        },
        {
          "name": "Displeased Avian",
          "image": "displeased-avian.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "CAW CAWWW",
              "description": "A rapid, short range peck with infinite ammo"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "WAAAA HEEY",
              "description": "Red flings himself to a designated area with his slingshot, stunning enemies on land"
            },
            "ability_2": {
              "name": "WOOOIA UUU UU UY",
              "description": "Red slices in a wide berth with his wings, doing 50% of the max health of the squishiest enemy caught."
            },
            "super": {
              "name": "AAAAAIIIIIIAAA",
              "description": "Red perfectly mimics the sound of a bird, frightening Big Pig and sending him on a rampage through the map"
            }
          }
        },
        {
          "name": "Voodude",
          "image": "voodude.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Dood Shood",
              "description": "Voodude shoods his handgun, dealing small damage and marking with a voodoo mark on headshot"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Shank then Crank (feat. Spaceknife)",
              "description": "Voodude dashes forward, and shanks the first enemy he hits with Spaceknife, and marking them with a voodoo mark which makes them take damage after 3 seconds that can be increased by attacking him. (3 uses)"
            },
            "ability_2": {
              "name": "Dood Arrangement",
              "description": "Voodude can arrange his dood into 5 different positions, each one with a different buff. He then throws the dude, teleporting to it on contact and in the position you choose."
            },
            "super": {
              "name": "If you ain't voo, then you ain't doo",
              "description": "Voodude imbues his dood with voo, then throws him, doing splash damage on contact, killing anyone with a voodoo mark or marking those who aren't marked yet."
            }
          }
        },
        {
          "name": "MU†E-ÅNT",
          "image": "mute-ant.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Ant-Rings",
              "description": "Mute-Ant throws one of his ant-rings a short distance"
            },
            "passive": {
              "name": "Mute",
              "description": "Mute-Ant can't communicate with teammates"
            },
            "ability_1": {
              "name": "Ant-Bot",
              "description": "Ant-Bot scans the area around him, revealing hidden objects and zapping enemies"
            },
            "ability_2": {
              "name": "Ant-friend",
              "description": "(In ant-form) Mute-Ant gets carried around by his insect friend; Señor butterfly, allowing him to fly for 8 secs"
            },
            "super": {
              "name": "Ant-Man",
              "description": "Mute-ant speaks for 10 seconds transforming him into an ant that is so tiny it is invisible"
            }
          }
        },
        {
          "name": "Contortoise",
          "image": "contortoise.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Tort for Four &",
              "description": "Contortoise does a quick 4-hit combo, but strikes with unusual body part."
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Sneakcret Scuttle",
              "description": "Contortoise drops to all fours and scuttles forward sneakcretly, gaining movement speed. This ability has no cooldown."
            },
            "ability_2": {
              "name": "Clack, Smack, Rattle",
              "description": "Contortoise does all the aforementioned actions with his weird ahh joints, stunning the nearest enemy and delivering a smack for small damage."
            },
            "super": {
              "name": "Be Weird and Bend A Lot",
              "description": "Contortoise bends a lot in a wide area, jumping from enemy to enemy in the zone, grappling and dealing damage to them."
            }
          }
        },
        {
          "name": "Machete Man",
          "image": "machete-man.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Machete",
              "description": "Machete Man slashes with his machete"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Machete Throw",
              "description": "Machete man throws his machete then backflips to get a new one"
            },
            "ability_2": {
              "name": "Dementia Machete Backflip",
              "description": "Machete man does a backflip and has 50 chance of dealing a ton of damage to himself or an enemy"
            },
            "super": {
              "name": "Old Guy Backflip",
              "description": "Machete man does a backflip, gaining an extra Mach e, extra damage and extra speed"
            }
          }
        },
        {
          "name": "Grup Scrooge",
          "image": "grup-scrooge.png",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "mmm…Stick",
              "description": "Swings forward then up with his stick for a two-hit combo. Fills Scrooge meter faster"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Grupnotize",
              "description": "Grup Scrooge raises his staff in the air to fake out enemies. They waste a random ability"
            },
            "ability_2": {
              "name": "Centriscrooge",
              "description": "Grup Scrooge spins around rapidly and deals damage, draining his Scrooge meter."
            },
            "super": {
              "name": "A Minute A Day Keeps the Doctor Away",
              "description": "Grup Scrooge places a marker anywhere on the map. In exactly one minute, a portal opens from wherever he is to there."
            }
          }
        },
        {
          "name": "Captain Christingle",
          "image": "captain-christingle.jpg",
          "class": "Saboteur",
          "abilities": {
            "main_attack": {
              "name": "Candy Spear",
              "description": "Thrusts a sharpened candy cane forward, with long melee range and pierce"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "The Dwindling Popularity of Wax Museums",
              "description": "Launches a flaming Christingle, igniting enemies on hit and applying area burn damage"
            },
            "ability_2": {
              "name": "The Importance of Dentists",
              "description": "Captain Christingle switches his candy canes for toothpicks, allowing him to throw up to 4 for less damage."
            },
            "super": {
              "name": "The Fashion Industry",
              "description": "Captain Christingle binds all enemies in a target location, forcing them together and rooting them"
            }
          }
        }
      ]
    },
    {
      "name": "Supporter",
      "icon": "supporter.png",
      "hero_count": 9,
      "heroes": [
        {
          "name": "Burger King",
          "image": "burger-king.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Double Spatula Surprise",
              "description": "Burger King makes burgers, LT to make funky burgers for teammates, RT to make evil burgers for enemies."
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "The Great",
              "description": "Burger King makes a big burger, providing cover for teammates and can be consumed for health."
            },
            "ability_2": {
              "name": "The Gatsby",
              "description": "Burger King draws a spatula circle, creating a burger zone for teammates to gain increased attack in."
            },
            "super": {
              "name": "The Great and The Gatsby",
              "description": "Burger King Greats a Gatsby Burger, turning any teammate into the Great Gatsby for 1 minute. While the Great Gatsby, teammates have much more health and damage."
            }
          }
        },
        {
          "name": "Defrilibatorator",
          "image": "defrilibatorator.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Shock Therapy",
              "description": "DFB shoots a constant beam of lightning from his hand, sucking health from enemies"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Defribrilate",
              "description": "DFB shoots a little lightning out, which does minimal damage and cancels enemies abilities for 5 seconds"
            },
            "ability_2": {
              "name": "Refribrilate",
              "description": "DFB shocks a Wednesday teammate, giving them a shield, raising their attack damage, and healing them for 5 seconds (3 uses)"
            },
            "super": {
              "name": "If it's Wednesday, they will come",
              "description": "Place down an area of pure Wednesday, reviving any teammate who most recently died, and reviving any teammate who dies within the zone. The zone exists for 30 seconds"
            }
          }
        },
        {
          "name": "Brain Freeze",
          "image": "brain-freeze.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "I'm Not Having Fun",
              "description": "Brainfreeze, shocked at the prospect of not fun, swings out with a one-handed punch, gaining Fun on hit."
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Use the Bomb",
              "description": "Costs 2 Fun. Brainfreeze finally uses the bomb he always carries around, dealing small splash damage."
            },
            "ability_2": {
              "name": "You Fly When I'm Having Fun",
              "description": "Costs 1 Fun. Brainfreeze can levitate a teammate, healing them and raising them to any height for 5 seconds."
            },
            "super": {
              "name": "Time Flies When Your Having Fun",
              "description": "Brainfreeze takes a hit of straight Fun, causing himself to enter a state of bliss, summoning Time Flies to tell him and his teammates the time in game and in real life for 30 seconds"
            }
          }
        },
        {
          "name": "Speedo",
          "image": "speedo.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Frog Bomb",
              "description": "Speedo lobs a negatively charged bullfrog that explodes on hit. The shot becomes more horizontal the longer its held down"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Fresh Pair",
              "description": "Speedo dons a speedo, increasing all nearby teammate's speed for 5 seconds. (Significantly more if they're a bullfrog)"
            },
            "ability_2": {
              "name": "Dredge You Glad I Put a Bog There",
              "description": "Speedo places a portable bog down, allowing teammates to dredge through, but not enemies"
            },
            "super": {
              "name": "Bullfrogs Unite!",
              "description": "Speedo sends forth a tsunami of super fast bullfrogs, dealing damage to any enemy and giving bonus health to any teammate they pass through."
            }
          }
        },
        {
          "name": "Didgeridon't",
          "image": "digeridon't.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Didgeridon't Come Near",
              "description": "Didgeridon't swings his Didgeridon't in a wide arc, causing fall damage on hit."
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Didgeridon't Mess Around",
              "description": "Didgeridon't stretches his arms, increasing super charge rate for 5 seconds."
            },
            "ability_2": {
              "name": "Digerididn't and Digeriwon't",
              "description": "Didgeridon't summons the ghosts of Digeripast and the ghost of digerifuture to perform a line dance. They are solid and can block attacks."
            },
            "super": {
              "name": "Didgeridon't Take Fall Damage",
              "description": "Didgeridon't raises his Didgeridon't above his head, and for 15 seconds his teammates don't take fall damage."
            }
          }
        },
        {
          "name": "Corn Maiden",
          "image": "corn-maiden.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "North, East, South, West",
              "description": "Launch a cardinal that splits on hit, shooting 4 cardinals in the 4 cardinal directions. Heals teammates and damages enemies"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Translucify",
              "description": "The Corn Maiden touches a teammate, turning them kinda translucent and giving them healing over time"
            },
            "ability_2": {
              "name": "Opacify",
              "description": "The Corn Maiden touches an enemy, making them twice as opaque and increasing their hitbox for 5 seconds"
            },
            "super": {
              "name": "Cornpast, Cornpresent, Cornfuture",
              "description": "The Corn Maiden attaches a translucent cardinal to all visible teammates, applying constant healing over time until the cardinals are destroyed"
            }
          }
        },
        {
          "name": "DishwasHER",
          "image": "dishwasher.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Womanly Plate Throw",
              "description": "DishwasHER throws a plate in a female-like manner"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Cass HERole",
              "description": "DishwasHER drops a casserole that heals her teammates"
            },
            "ability_2": {
              "name": "Stealth Mode",
              "description": "DishwasHER goes into stealth mode, getting melee whisk weapons and changing her outfit which does nothing"
            },
            "super": {
              "name": "Do the Laundry",
              "description": "DishwasHER removes all negative effects from her teammates and heals them significantly"
            }
          }
        },
        {
          "name": "PowerPoint",
          "image": "powerpoint.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Laser Taser Blaser Face",
              "description": "Power point shoots a laser at an enemies face. If the enemy is wearing a blaser, it does double damage"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Minor Blind",
              "description": "PowerPoint temporarily blinds one enemy, leaving a 'blind spot' where they can't see for 5 seconds"
            },
            "ability_2": {
              "name": "3rd D vision",
              "description": "PowerPoint sees through the first and the second D's, and him and his teammates can see enemies wherever they are on the map"
            },
            "super": {
              "name": "Super Distract",
              "description": "Power point summons a random point on the map, and all other characers are sucked towards that point and can only see near that point"
            }
          }
        },
        {
          "name": "Shan't Dance",
          "image": "shan't-dance.jpg",
          "class": "Supporter",
          "abilities": {
            "main_attack": {
              "name": "Autissles",
              "description": "Shan't fires mini-missiles from his wheelchair"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Wheelchair Tow",
              "description": "Shan't attaches his wheelchair to another teammate, significantly boosting their movement speed"
            },
            "ability_2": {
              "name": "Wheel Steel",
              "description": "Shan't shoots a wheel off of his wheelchair, providing cover for teammates behind them (2 uses)"
            },
            "super": {
              "name": "Motivational JUMP",
              "description": "Shan't, after charging all game, performs the biggest jump you've seen any guy do before. This incredible morale boost gives all teammates in the area incredible jump height, regeneration, and healing over time"
            }
          }
        }
      ]
    },
    {
      "name": "Controller",
      "icon": "controller.png",
      "hero_count": 7,
      "heroes": [
        {
          "name": "Snow Angel",
          "image": "snow-angel.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Double Snowball",
              "description": "Snow Angel throws two snowballs, dealing extra damage if they both hit"
            },
            "passive": {
              "name": "Cold Aura",
              "description": "Snow Angel slows down all enemies that are too close to him, due to his creepy and cold hearted nature"
            },
            "ability_1": {
              "name": "SnowBlade Beyblade",
              "description": "Snow Angel spins around, freezing enemies with his icy wings"
            },
            "ability_2": {
              "name": "Snow Angel Effect",
              "description": "Snow Angel rolls a giant snowball in front of him, it gets bigger and does more damage as it rolls"
            },
            "super": {
              "name": "Under the Snow",
              "description": "Snow Angel dives into the snow and can fly under it for 6 secs, during this time he is immune and everyone standing above him gets increased attack damage"
            }
          }
        },
        {
          "name": "Faceplant",
          "image": "faceplant.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Shovel Slash",
              "description": "Faceplant attacks with shovel, dealing heavy melee damage and launching weaker vines out in front of him"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Face full of Plant",
              "description": "Faceplant Excretes a large amount of poisonous pollen from his face"
            },
            "ability_2": {
              "name": "Plant full of Face",
              "description": "Faceplant creates an area of plants who encourage his teammates, giving bonus attack and speed"
            },
            "super": {
              "name": "Plant full of Plant",
              "description": "Faceplant creates an area that wraps enemies up vines, stunning them"
            }
          }
        },
        {
          "name": "Grom",
          "image": "grom.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Bud Go Boom!",
              "description": "Grom throws his walkie-talkie over obstacles at a long range that explodes into four piercing projectiles in a cross pattern."
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Watchtower",
              "description": "Upon activation, Grom drops a turret that allows him and allies to see enemies inside bushes in its 10-tile radius."
            },
            "ability_2": {
              "name": "Radio Check",
              "description": "Activating this Gadget allows Grom's next attack to fire three walkie-talkies in quick succession."
            },
            "super": {
              "name": "Grom Bomb",
              "description": "Grom throws a giant, longer-ranged bomb from his back over obstacles that explodes into four piercing projectiles in a cross pattern, similarly to his main attack."
            }
          }
        },
        {
          "name": "Jeanne Gris",
          "image": "jeanne-gris.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Baguette",
              "description": "She uses her baguette to hit"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Hucked Mime",
              "description": "Jeanne Gris hucks a mime over walls and buildings"
            },
            "ability_2": {
              "name": "Invisible Wall",
              "description": "Jeanne Gris' mime makes a wall that protects her for a short time"
            },
            "super": {
              "name": "Horde-a-mimes",
              "description": "Jeanne Gris controls a horde of mimes and tramples anyone in her path"
            }
          }
        },
        {
          "name": "Winter WonderGirl",
          "image": "winter-wondergirl.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Super Snowglober",
              "description": "Winter Wondergirl throws a snow globe, which breaks and pulls enemies in"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Shake it up",
              "description": "Winter Wondergirl makes it snow around her, freezing enemies"
            },
            "ability_2": {
              "name": "Rain down the sun fog",
              "description": "Winter Wondergirl breaks a snowglobe with a lot of fog, causing a smoke bomb"
            },
            "super": {
              "name": "Wonderlate the multisphere",
              "description": "Winter Wondergirl builds a giant snow globe, any enemies in it take a ton of damage and are slowed"
            }
          }
        },
        {
          "name": "Smurtle Gurltle Cheesecake Woman",
          "image": "smurtle-gurltle-cheesecake-woman.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Krazy Karate Kicks",
              "description": "SGCW kicks with a three kick combo"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Super Ultra Tornado Spin",
              "description": "Ninja Mode - SGCW does a stunning spin kick \nTurtle Mode - SGCW spins around in her turtle shell and is invincible throughout"
            },
            "ability_2": {
              "name": "Mega Tsunami Cheesecake",
              "description": "Ninja Mode - SGCW dashes forward spilling slowing cheesecake behind her\nTurtle Mode - SGCW consumes her cheesecake to gain health and movement speed"
            },
            "super": {
              "name": "Supersaiyan Ultra Cheesecake Weapon Ninja Gurl Explosion!",
              "description": "SGCW switches to the other mode. Ninja Mode has low health and high speed. Turtle mode has low speed high health. SGCW gets a attack boost after switching"
            }
          }
        },
        {
          "name": "Belt Tungus",
          "image": "belt-tungus.jpg",
          "class": "Controller",
          "abilities": {
            "main_attack": {
              "name": "Taste the belt",
              "description": "Belt Tungus flings his belt out of his mouth in front of him"
            },
            "passive": {
              "name": "",
              "description": ""
            },
            "ability_1": {
              "name": "Oil Spill",
              "description": "Does an oopsie and spill oil all over behind him. Enemies can't walk well due to the frictionless surface"
            },
            "ability_2": {
              "name": "Rev it",
              "description": "Bet Tungus revs his engines, dashing forward and stunning enemies"
            },
            "super": {
              "name": "Carb",
              "description": "Belt Tungus adds a B to his head, becoming a carbohydrate and making up to 3 visible enemies fat and slow. They have to walk off the effect to get rid of it"
            }
          }
        }
      ]
    },
    {
      "name": "Hawktalker",
      "icon": "hawktalker.png",
      "hero_count": 2,
      "heroes": [
        {
          "name": "Moonhawk",
          "image": "moon-hawk.jpg",
          "class": "Hawktalker",
          "abilities": {
            "main_attack": {
              "name": "Hawk Spawn",
              "description": "Moonhawk spawns a hawk outta his forearm"
            },
            "passive": {
              "name": "Ability 4",
              "description": "Question 1) If a train is departing a station at 6 miles per hour, its distance is 35 miles away, and the coefficient of friction is 0.68, will the passengers enjoy the ride?"
            },
            "ability_1": {
              "name": "2nd ability",
              "description": "This is Moonhawk's 2nd ability, don't get them confused"
            },
            "ability_2": {
              "name": "3rd Place Ability: 🥉",
              "description": "This ability came in 3rd place, and got a bronze medal"
            },
            "super": {
              "name": "Moonhawk resets the game",
              "description": "All characters watch as the moon becomes a waxing gibbous, entering them all into a cutscene of changing moon phases while hundreds of hawks fly the coop, resetting Moonhawk's cooldowns and unmuting him from voice chat"
            }
          }
        },
        {
          "name": "They",
          "image": "they.jpg",
          "class": "Hawktalker",
          "abilities": {
            "main_attack": {
              "name": "Drop a cow",
              "description": "They had the opportunity to drop a cow once in his life, but he didn't take it, and now he has crippling regrets"
            },
            "passive": {
              "name": "Morals",
              "description": "No cheating, respectful"
            },
            "ability_1": {
              "name": "Be very very wary of this ability",
              "description": "They is too wary of this ability and can't use it."
            },
            "ability_2": {
              "name": "Bi-Polar",
              "description": "Uh Oh! Looks like someone said They! They gains A random personality that includes: Doctor, Female Doctor, Lumberjack, Tree, Female Tree, Botanist, or The Onceler."
            },
            "super": {
              "name": "Them",
              "description": "IMAGE:images/TheySuper.png"
            }
          }
        }
      ]
    }
  ]
};

// Helper function to check if hero has any abilities
function heroHasAbilities(hero) {
    if (!hero.abilities) return false;

    // Handle string format (old format)
    if (typeof hero.abilities === 'string') {
        return hero.abilities.trim().length > 0;
    }

    // Handle object format (new format)
    if (typeof hero.abilities === 'object') {
        // Check if any ability has a name or description
        const hasMainAttack = hero.abilities.main_attack && (hero.abilities.main_attack.name || hero.abilities.main_attack.description);
        const hasPassive = hero.abilities.passive && (hero.abilities.passive.name || hero.abilities.passive.description);
        const hasAbility1 = hero.abilities.ability_1 && (hero.abilities.ability_1.name || hero.abilities.ability_1.description);
        const hasAbility2 = hero.abilities.ability_2 && (hero.abilities.ability_2.name || hero.abilities.ability_2.description);
        const hasSuper = hero.abilities.super && (hero.abilities.super.name || hero.abilities.super.description);

        return hasMainAttack || hasPassive || hasAbility1 || hasAbility2 || hasSuper;
    }

    return false;
}

// Helper function to check if hero is available for selection
function heroIsAvailable(hero) {
    // Captain Christingle is seasonal and unavailable
    if (hero.name === 'Captain Christingle') {
        return false;
    }

    // Heroes without abilities are unavailable
    if (!heroHasAbilities(hero)) {
        return false;
    }

    return true;
}

function buildHeroCarousel() {
    const carouselContent = document.getElementById('hero-carousel-content');
    const indicatorsContainer = document.getElementById('hero-carousel-indicators');

    if (!heroesData || !carouselContent) return;

    // Clear existing content
    carouselContent.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    heroSlides = [];

    let slideIndex = 0;

    // Create one slide per class (with grid of heroes)
    heroesData.classes.forEach(heroClass => {
        if (heroClass.hero_count === 0) return; // Skip classes with no heroes

        const className = heroClass.name;
        const classIcon = heroClass.icon;
        const colors = classColors[className];

        // Create slide for this class
        const slide = document.createElement('div');
        slide.className = 'carousel-slide' + (slideIndex === 0 ? ' active' : '');
        slide.setAttribute('data-class', className);

        // Build hero grid HTML
        let heroGridHTML = '';
        heroClass.heroes.forEach(hero => {
            const hasAbilities = heroHasAbilities(hero);
            const isCaptainChristingle = hero.name === 'Captain Christingle';
            // Don't disable Captain Christingle even though he has abilities (he's seasonal)
            const disabledClass = (hasAbilities || isCaptainChristingle) ? '' : ' disabled';
            heroGridHTML += `
                <div class="hero-card${disabledClass}" data-hero="${hero.name}" data-class="${className}">
                    <div class="hero-card-image">
                        <img src="images/heroes-thumbnails/${hero.image}" alt="${hero.name}">
                    </div>
                    <div class="hero-card-name">${hero.name}</div>
                </div>
            `;
        });

        slide.innerHTML = `
            <div class="class-header" style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});">
                <img src="images/classes/${classIcon}" alt="${className}" class="class-icon">
                <h2 class="class-name">${className.toUpperCase()}</h2>
            </div>
            <div class="hero-grid">
                ${heroGridHTML}
            </div>
        `;

        carouselContent.appendChild(slide);
        heroSlides.push(slide);

        // Create indicator for this class
        const indicator = document.createElement('span');
        indicator.className = 'indicator' + (slideIndex === 0 ? ' active' : '');
        indicator.setAttribute('data-index', slideIndex);
        indicator.style.borderColor = colors.primary;
        if (slideIndex === 0) {
            indicator.style.background = colors.primary;
        }
        indicatorsContainer.appendChild(indicator);

        slideIndex++;
    });

    // Add event listeners for hero card selection
    const heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal for disabled heroes (unless it's Captain Christingle)
            const heroName = card.getAttribute('data-hero');

            if (card.classList.contains('disabled') && heroName !== 'Captain Christingle') {
                return; // Do nothing for disabled heroes
            }

            const className = card.getAttribute('data-class');

            // Find hero data
            let heroData = null;
            heroesData.classes.forEach(c => {
                if (c.name === className) {
                    c.heroes.forEach(h => {
                        if (h.name === heroName) {
                            heroData = h;
                        }
                    });
                }
            });

            if (heroData) {
                openHeroModal(heroData, className);
            }
        });
    });

    // Add event listeners for navigation
    setupHeroCarouselNavigation();
}

function formatAbilities(abilities) {
    // Handle both old string format and new structured format
    if (typeof abilities === 'string') {
        // Old format - parse string
        const abilityList = abilities.split(/(?=Main Attack:|Passive:|Ability 1:|Ability 2:|Super:)/);
        const abilityColors = {
            'Main Attack': 'ability-blue',
            'Passive': 'ability-purple',
            'Ability 1': 'ability-green',
            'Ability 2': 'ability-green',
            'Super': 'ability-yellow'
        };

        let html = '';
        abilityList.forEach(ability => {
            if (ability.trim()) {
                const match = ability.match(/^(Main Attack|Passive|Ability \d|Super):\s*([^\n]+)\n?(.+)?/s);
                if (match) {
                    const type = match[1];
                    const name = match[2].trim();
                    const description = match[3] ? match[3].trim() : '';

                    if (type === 'Passive' && !name) {
                        return;
                    }

                    const colorClass = abilityColors[type] || '';

                    // Check if description is an image reference
                    let descriptionHtml = '';
                    if (description.startsWith('IMAGE:')) {
                        const imagePath = description.replace('IMAGE:', '');
                        descriptionHtml = `<img src="${imagePath}" alt="${name}" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 8px;">`;
                    } else {
                        descriptionHtml = description;
                    }

                    html += `
                        <div class="ability-item">
                            <div class="ability-name ${colorClass}">${name}</div>
                            <div class="ability-desc">${descriptionHtml}</div>
                        </div>
                    `;
                }
            }
        });
        return html;
    }

    // New structured format
    const abilityColors = {
        'main_attack': 'ability-blue',
        'passive': 'ability-purple',
        'ability_1': 'ability-green',
        'ability_2': 'ability-green',
        'super': 'ability-yellow'
    };

    const abilityLabels = {
        'main_attack': 'Main Attack',
        'passive': 'Passive',
        'ability_1': 'Ability 1',
        'ability_2': 'Ability 2',
        'super': 'Super'
    };

    let html = '';

    // Process each ability in order
    ['main_attack', 'passive', 'ability_1', 'ability_2', 'super'].forEach(key => {
        if (abilities[key] && abilities[key].name) {
            const ability = abilities[key];
            const colorClass = abilityColors[key];
            const label = abilityLabels[key];

            // Check if description is an image reference
            let descriptionHtml = '';
            if (ability.description.startsWith('IMAGE:')) {
                const imagePath = ability.description.replace('IMAGE:', '');
                descriptionHtml = `<img src="${imagePath}" alt="${ability.name}" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 8px;">`;
            } else {
                descriptionHtml = ability.description;
            }

            html += `
                <div class="ability-item">
                    <div class="ability-name ${colorClass}">${ability.name}</div>
                    <div class="ability-desc">${descriptionHtml}</div>
                </div>
            `;
        }
    });

    return html;
}

function setupHeroCarouselNavigation() {
    const prevButton = document.getElementById('hero-carousel-prev');
    const nextButton = document.getElementById('hero-carousel-next');
    const indicators = document.querySelectorAll('#hero-carousel-indicators .indicator');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            let newIndex = currentHeroIndex - 1;
            if (newIndex < 0) {
                newIndex = heroSlides.length - 1;
            }
            showHeroSlide(newIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            let newIndex = currentHeroIndex + 1;
            if (newIndex >= heroSlides.length) {
                newIndex = 0;
            }
            showHeroSlide(newIndex);
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showHeroSlide(index);
        });
    });

    // Keyboard navigation for hero carousel
    document.addEventListener('keydown', (e) => {
        const characterScreen = document.getElementById('character-screen');
        if (!characterScreen || !characterScreen.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextButton.click();
        }
    });
}

function showHeroSlide(index) {
    const indicators = document.querySelectorAll('#hero-carousel-indicators .indicator');

    // Remove active class from all slides and indicators
    heroSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.style.background = 'rgba(0, 191, 255, 0.3)';
    });

    // Add active class to current slide and indicator
    heroSlides[index].classList.add('active');
    const heroClass = heroSlides[index].getAttribute('data-class');
    const colors = classColors[heroClass];

    indicators[index].classList.add('active');
    indicators[index].style.background = colors.primary;

    currentHeroIndex = index;
}

// Hero Details Modal Logic
function openHeroModal(hero, className) {
    const modal = document.getElementById('character-details-modal');
    const modalName = document.getElementById('modal-hero-name');
    const modalClass = document.getElementById('modal-hero-class');
    const modalImage = document.getElementById('modal-hero-image');
    const modalAbilities = document.getElementById('modal-hero-abilities');
    const selectBtn = document.getElementById('modal-select-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // Populate data
    modalName.textContent = hero.name.toUpperCase();
    modalClass.textContent = className.toUpperCase();

    // Set class badge color
    const colors = classColors[className];
    modalClass.style.borderColor = colors.primary;
    modalClass.style.color = colors.secondary;

    modalImage.src = `images/heroes/${hero.image}`;
    modalImage.alt = hero.name;

    // Format abilities using the existing helper function
    modalAbilities.innerHTML = formatAbilities(hero.abilities);

    // Check if this is Captain Christingle
    const isCaptainChristingle = hero.name === 'Captain Christingle';

    // Show modal
    modal.classList.add('active');

    // Clean up old listeners to prevent duplicates
    const newSelectBtn = selectBtn.cloneNode(true);
    selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Handle Captain Christingle seasonal restriction
    if (isCaptainChristingle) {
        newSelectBtn.disabled = true;
        newSelectBtn.classList.add('disabled');
        newSelectBtn.textContent = 'UNAVAILABLE';
        newSelectBtn.style.cursor = 'not-allowed';
    } else {
        newSelectBtn.disabled = false;
        newSelectBtn.classList.remove('disabled');
        newSelectBtn.textContent = 'SELECT';
        newSelectBtn.style.cursor = 'pointer';
    }

    // Add new listeners
    newSelectBtn.addEventListener('click', () => {
        if (isCaptainChristingle) {
            return; // Do nothing if it's Captain Christingle
        }

        selectedHero = { name: hero.name, class: className };
        console.log(`Selected hero via modal: ${hero.name} (${className})`);

        // Update the home screen
        const selectedDisplay = document.getElementById('selected-character');
        selectedDisplay.textContent = hero.name;
        selectedDisplay.style.animation = 'selectedPulse 0.5s ease-out';
        setTimeout(() => {
            selectedDisplay.style.animation = '';
        }, 500);

        // Hide modal and transition
        modal.classList.remove('active');
        transitionToScreen('character-screen', 'home-screen');
    });

    newCancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('character-details-modal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }
});

// Build carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeroCarousel);
} else {
    buildHeroCarousel();
}

// Loading Screen Hints
const loadingHints = [
    "A helmet won't protect you from the Christmas pterodactyls, but a pure Christmas heart might.",
    "You know what they says…",
    "Thug Cows are more likely to attack when you're alone",
    "Nanobots are the key to everything.",
    "Opening doors earns you funktard points",
    "We love you Dan Rhon",
    "Space Sharks are violent and relentless creatures",
    "Der Kinderlumpers' gonna getcha",
    "Shorby eats raw fear for brunch",
    "See Dr. Acula if you need healing",
    "The Great Gatsby loves burgers",
    "You can hide from Botany Beth in the dumpsters",
    "Winter Wondergirl starts with less voters in campaign mode",
    "Careful next time you're at a spelling bee. There could be a nuke under it",
    "Cornelius Crime must be Stopped.",
    "Brain Freeze can eat clowns to regain health",
    "The Y-guys have special team up abilities",
    "WAAAA HEEYA!!",
    "To Rapt or Not to rapt",
    "make sure to keep your mouth closed to ward off unwanted ginks",
    "Your lucky he's benevolent",
    "Belt Tungus is the champion of Lickionary",
    "Blubber? I barely know her",
    "If your being rivaled your doing something wrong",
    "Watch out, you never know if Gink 50 truly is at 50 ginks"
];

// Random Selection Function
function randomSelection() {
    // Get all available heroes (from all classes with heroes)
    const allHeroes = [];
    heroesData.classes.forEach(heroClass => {
        if (heroClass.hero_count > 0) {
            heroClass.heroes.forEach(hero => {
                // Only include heroes that are available for selection
                if (heroIsAvailable(hero)) {
                    allHeroes.push({
                        hero: hero,
                        className: heroClass.name
                    });
                }
            });
        }
    });

    // Pick random hero
    const randomHeroIndex = Math.floor(Math.random() * allHeroes.length);
    const randomHeroData = allHeroes[randomHeroIndex];

    selectedHero = {
        name: randomHeroData.hero.name,
        class: randomHeroData.className
    };

    // Update display
    const selectedCharDisplay = document.getElementById('selected-character');
    selectedCharDisplay.textContent = selectedHero.name;
    selectedCharDisplay.style.animation = 'selectedPulse 0.5s ease-out';
    setTimeout(() => {
        selectedCharDisplay.style.animation = '';
    }, 500);

    // Pick random game mode
    const gameModes = ['deathmatch', 'chexico', 'turfwar', 'squirt', 'hoedown', 'campaign', 'story'];
    const randomModeIndex = Math.floor(Math.random() * gameModes.length);
    selectedGameMode = gameModes[randomModeIndex];

    // Update display
    const selectedModeDisplay = document.getElementById('selected-gamemode');
    selectedModeDisplay.textContent = gameModeNames[selectedGameMode];
    selectedModeDisplay.style.animation = 'selectedPulse 0.5s ease-out';
    setTimeout(() => {
        selectedModeDisplay.style.animation = '';
    }, 500);

    console.log(`Random selection: ${selectedHero.name} (${selectedHero.class}) - ${gameModeNames[selectedGameMode]}`);
}

// Game mode team configurations
const gameModeTeams = {
    'deathmatch': { allied: 6, enemy: 6 },
    'chexico': { allied: 6, enemy: 6 },
    'turfwar': { allied: 6, enemy: 6 },
    'squirt': { allied: 4, enemy: 4 },
    'hoedown': { allied: 1, enemy: 1 },
    'campaign': { allied: 5, enemy: 0 }, // Free for all
    'story': { allied: 4, enemy: 0 } // Co-op
};

// Random player names
const playerNames = [
    'xXShadowKillerXx', 'ProGamer123', 'NoobMaster', 'SnipeKing', 'TankBuster',
    'HealBot3000', 'RushB', 'CampingExpert', 'LagLord', 'AFKWarrior',
    'ButtonMasher', 'RageQuitter', 'TeamKiller', 'LootGoblin', 'SpawnCamper',
    'TryHard2000', 'CasualPlayer', 'FirstTimer', 'VeteranGamer', 'RandomHero',
    'BotPlayer', 'EZMode', 'HardcorePro', 'CheeseStrat', 'MetaSlave'
];

async function startGame() {
    if (!selectedHero) {
        alert("Please select a hero first!");
        const charItem = document.querySelector('[data-menu="character"]');
        charItem.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { charItem.style.animation = ''; }, 500);
        return;
    }

    if (!selectedGameMode) {
        alert("Please select a game mode first!");
        const modeItem = document.querySelector('[data-menu="gamemode"]');
        modeItem.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { modeItem.style.animation = ''; }, 500);
        return;
    }

    // Get Game Mode Image
    const gameModeSlide = document.querySelector(`.carousel-slide[data-mode="${selectedGameMode}"]`);
    const gameModeImgSrc = gameModeSlide.querySelector('.carousel-image img').src;

    // Transition to Loading Screen
    transitionToScreen('home-screen', 'loading-screen');

    // Setup Loading Screen
    const loadingBg = document.getElementById('loading-bg');
    const lobbyStatus = document.getElementById('lobby-status');
    const teamsContainer = document.getElementById('teams-container');
    const ffaContainer = document.getElementById('ffa-container');
    const alliedPlayersContainer = document.getElementById('allied-players');
    const enemyPlayersContainer = document.getElementById('enemy-players');
    const ffaPlayersContainer = document.getElementById('ffa-players');
    const hintText = document.getElementById('hint-text');

    loadingBg.style.backgroundImage = `url('${gameModeImgSrc}')`;

    // Display random hint
    const randomHintIndex = Math.floor(Math.random() * loadingHints.length);
    hintText.textContent = loadingHints[randomHintIndex];

    // Get player's selected hero data
    let playerHeroObj = null;
    heroesData.classes.forEach(c => {
        c.heroes.forEach(h => {
            if (h.name === selectedHero.name) {
                playerHeroObj = h;
            }
        });
    });

    // Clear previous lobby
    alliedPlayersContainer.innerHTML = '';
    enemyPlayersContainer.innerHTML = '';
    ffaPlayersContainer.innerHTML = '';
    lobbyStatus.textContent = 'WAITING FOR PLAYERS...';

    // Get team sizes for this game mode
    const teamConfig = gameModeTeams[selectedGameMode] || { allied: 6, enemy: 6 };

    // Check if this is a free-for-all mode (campaign or story)
    const isFreeForAll = selectedGameMode === 'campaign' || selectedGameMode === 'story';

    // Get player's class colors and icon
    const playerClassColors = classColors[selectedHero.class];
    let playerClassIcon = '';
    heroesData.classes.forEach(c => {
        if (c.name === selectedHero.class) {
            playerClassIcon = c.icon;
        }
    });

    if (isFreeForAll) {
        // Show FFA container, hide teams container
        teamsContainer.style.display = 'none';
        ffaContainer.style.display = 'flex';

        // Add Player 1 at the top
        const player1Slot = document.createElement('div');
        player1Slot.className = 'player-slot highlight';
        player1Slot.style.background = `linear-gradient(135deg, ${playerClassColors.primary}50, ${playerClassColors.secondary}50)`;
        player1Slot.style.borderColor = playerClassColors.primary;
        player1Slot.innerHTML = `
            <img src="images/classes/${playerClassIcon}" alt="${selectedHero.class}" class="player-class-icon">
            <img src="images/heroes-thumbnails/${playerHeroObj.image}" alt="${selectedHero.name}" class="player-thumbnail">
            <div class="player-name">Player 1</div>
        `;
        ffaPlayersContainer.appendChild(player1Slot);
    } else {
        // Show teams container, hide FFA container
        teamsContainer.style.display = 'flex';
        ffaContainer.style.display = 'none';

        // Add Player 1 at the top of allied team
        const player1Slot = document.createElement('div');
        player1Slot.className = 'player-slot highlight';
        player1Slot.style.background = `linear-gradient(135deg, ${playerClassColors.primary}50, ${playerClassColors.secondary}50)`;
        player1Slot.style.borderColor = playerClassColors.primary;
        player1Slot.innerHTML = `
            <img src="images/classes/${playerClassIcon}" alt="${selectedHero.class}" class="player-class-icon">
            <img src="images/heroes-thumbnails/${playerHeroObj.image}" alt="${selectedHero.name}" class="player-thumbnail">
            <div class="player-name">Player 1</div>
        `;
        alliedPlayersContainer.appendChild(player1Slot);
    }

    const totalPlayers = isFreeForAll ? (teamConfig.allied - 1) : ((teamConfig.allied - 1) + teamConfig.enemy);

    // Get all available heroes with their names, classes, and class icons (only those that are selectable)
    const allHeroes = [];
    heroesData.classes.forEach(c => {
        c.heroes.forEach(h => {
            // Only include heroes that are available for selection
            if (heroIsAvailable(h)) {
                allHeroes.push({ name: h.name, image: h.image, heroClass: c.name, classIcon: c.icon });
            }
        });
    });

    // Shuffle player names
    const shuffledNames = [...playerNames].sort(() => Math.random() - 0.5);

    // Function to add a player
    let playersAdded = 0;

    if (isFreeForAll) {
        // Free-for-all mode: all players visible with unique heroes
        const usedFFAHeroes = [playerHeroObj.image]; // Start with player's hero
        const ffaHeroes = []; // Store all FFA hero names for death messages

        function addFFAPlayer() {
            // Get a unique hero not already used
            const availableHeroes = allHeroes.filter(h => !usedFFAHeroes.includes(h.image));
            const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
            usedFFAHeroes.push(randomHero.image);
            ffaHeroes.push(randomHero.name);

            const playerName = shuffledNames[playersAdded % shuffledNames.length];
            const heroClassColors = classColors[randomHero.heroClass];

            const slot = document.createElement('div');
            slot.className = 'player-slot';
            slot.style.background = `linear-gradient(135deg, ${heroClassColors.primary}50, ${heroClassColors.secondary}50)`;
            slot.style.borderColor = heroClassColors.primary;
            slot.innerHTML = `
                <img src="images/classes/${randomHero.classIcon}" alt="${randomHero.heroClass}" class="player-class-icon">
                <img src="images/heroes-thumbnails/${randomHero.image}" alt="Player" class="player-thumbnail">
                <div class="player-name">${playerName}</div>
            `;

            ffaPlayersContainer.appendChild(slot);
            playersAdded++;

            // Check if all players have joined
            if (playersAdded >= totalPlayers) {
                // For FFA: player team is just the player, everyone else is enemy
                window.currentPlayerTeam = [playerHeroObj.name];
                window.currentEnemyTeam = ffaHeroes.filter(name => name !== playerHeroObj.name);

                setTimeout(() => {
                    startCountdown();
                }, 500);
            } else {
                // Schedule next player (1-3 seconds)
                const delay = 1000 + Math.random() * 2000;
                setTimeout(addFFAPlayer, delay);
            }
        }

        // Start adding FFA players
        addFFAPlayer();
    } else {
        // Team-based mode
        const usedHeroes = [playerHeroObj.image]; // Track all heroes used across both teams
        const alliedTeamHeroes = [playerHeroObj.name]; // Store allied hero names (start with player)
        const enemyTeamHeroes = []; // Store enemy hero names for death messages

        let alliedPlayersAdded = 0;
        let enemyPlayersAdded = 0;

        function addPlayer() {
            // Randomly choose which team to add to (if both teams still need players)
            const alliedNeeded = (teamConfig.allied - 1) - alliedPlayersAdded;
            const enemyNeeded = teamConfig.enemy - enemyPlayersAdded;

            let isAllied;
            if (alliedNeeded > 0 && enemyNeeded > 0) {
                // Both teams need players - randomly choose
                isAllied = Math.random() < 0.5;
            } else if (alliedNeeded > 0) {
                // Only allied needs players
                isAllied = true;
            } else {
                // Only enemy needs players
                isAllied = false;
            }

            const container = isAllied ? alliedPlayersContainer : enemyPlayersContainer;
            const playerIndex = alliedPlayersAdded + enemyPlayersAdded;

            const slot = document.createElement('div');
            slot.className = isAllied ? 'player-slot' : 'player-slot enemy animate';

            if (isAllied) {
                // Allied player - get a unique hero not already used in the game
                const availableHeroes = allHeroes.filter(h => !usedHeroes.includes(h.image));
                const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
                usedHeroes.push(randomHero.image);
                alliedTeamHeroes.push(randomHero.name); // Store name for battle simulation

                const playerName = shuffledNames[playerIndex % shuffledNames.length];
                const heroClassColors = classColors[randomHero.heroClass];

                slot.style.background = `linear-gradient(135deg, ${heroClassColors.primary}50, ${heroClassColors.secondary}50)`;
                slot.style.borderColor = heroClassColors.primary;
                slot.innerHTML = `
                    <img src="images/classes/${randomHero.classIcon}" alt="${randomHero.heroClass}" class="player-class-icon">
                    <img src="images/heroes-thumbnails/${randomHero.image}" alt="Player" class="player-thumbnail">
                    <div class="player-name">${playerName}</div>
                `;
                alliedPlayersAdded++;
            } else {
                // Enemy player - get a unique hero not already used in the game
                const availableHeroes = allHeroes.filter(h => !usedHeroes.includes(h.image));
                const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
                usedHeroes.push(randomHero.image);
                enemyTeamHeroes.push(randomHero.name); // Store name for death messages

                const playerName = shuffledNames[playerIndex % shuffledNames.length];
                const heroClassColors = classColors[randomHero.heroClass];

                slot.style.background = `linear-gradient(135deg, ${heroClassColors.primary}50, ${heroClassColors.secondary}50)`;
                slot.style.borderColor = heroClassColors.primary;
                slot.innerHTML = `
                    <img src="images/classes/${randomHero.classIcon}" alt="${randomHero.heroClass}" class="player-class-icon">
                    <div class="player-name">${playerName}</div>
                    <div class="player-question">?</div>
                `;
                enemyPlayersAdded++;
            }

            container.appendChild(slot);

            // Check if all players have joined
            if ((alliedPlayersAdded + enemyPlayersAdded) >= totalPlayers) {
                // Store both teams globally for battle simulation
                window.currentPlayerTeam = alliedTeamHeroes;
                window.currentEnemyTeam = enemyTeamHeroes;

                setTimeout(() => {
                    startCountdown();
                }, 500);
            } else {
                // Schedule next player (1-3 seconds)
                const delay = 1000 + Math.random() * 2000;
                setTimeout(addPlayer, delay);
            }
        }

        // Start adding team players
        addPlayer();
    }

    // Countdown function
    function startCountdown() {
        lobbyStatus.textContent = 'ALL PLAYERS READY!';

        let count = 3;
        const countdownInterval = setInterval(() => {
            if (count > 0) {
                lobbyStatus.textContent = count.toString();
                count--;
            } else {
                clearInterval(countdownInterval);
                lobbyStatus.textContent = 'FIGHT!';
                setTimeout(async () => {
                    if (selectedGameMode === 'deathmatch') {
                        transitionToScreen('loading-screen', 'gameplay-screen');
                        setTimeout(() => startDeathmatch(), 500);
                    } else if (selectedGameMode === 'squirt') {
                        transitionToScreen('loading-screen', 'gameplay-screen');
                        setTimeout(() => startSquirt(), 500);
                    } else if (selectedGameMode === 'turfwar') {
                        transitionToScreen('loading-screen', 'gameplay-screen');
                        setTimeout(() => startTurfWar(), 500);
                    } else {
                        await showGameOver();
                    }
                }, 1000);
            }
        }, 1000);
    }
}

// Get the class of a hero by name
function getHeroClass(heroName) {
    for (const heroClass of heroesData.classes) {
        for (const hero of heroClass.heroes) {
            if (hero.name === heroName) {
                return heroClass.name;
            }
        }
    }
    return null;
}

// Calculate win probability based on class matchup
function getClassAdvantage(attackerClass, defenderClass) {
    // Class advantage chain:
    // Destroyer > Defender > Saboteur > Supporter > Controller > Destroyer
    // Hawktalker has 10% chance against everyone

    if (attackerClass === 'Hawktalker') return 0.10;
    if (defenderClass === 'Hawktalker') return 0.90;

    const advantages = {
        'Destroyer': 'Defender',
        'Defender': 'Saboteur',
        'Saboteur': 'Supporter',
        'Supporter': 'Controller',
        'Controller': 'Destroyer'
    };

    // Check if attacker has advantage
    if (advantages[attackerClass] === defenderClass) {
        return 0.80; // 80% chance for advantaged class
    }

    // Check if defender has advantage
    if (advantages[defenderClass] === attackerClass) {
        return 0.20; // 20% chance if at disadvantage
    }

    // No advantage - 50/50
    return 0.50;
}

// Simulate an entire 5v5 match and return chronological death events
function simulateMatch(playerTeam, enemyTeam, deathMessages) {
    const deaths = [];
    const alive = {
        player: [...playerTeam],
        enemy: [...enemyTeam]
    };

    // Continue until one team is eliminated
    while (alive.player.length > 0 && alive.enemy.length > 0) {
        // Pick one random fighter from each team for a duel
        const playerFighter = alive.player[Math.floor(Math.random() * alive.player.length)];
        const enemyFighter = alive.enemy[Math.floor(Math.random() * alive.enemy.length)];

        // Get their classes
        const playerClass = getHeroClass(playerFighter);
        const enemyClass = getHeroClass(enemyFighter);

        // Calculate probability that player fighter wins
        const playerWinChance = getClassAdvantage(playerClass, enemyClass);

        // Determine winner based on probability
        const playerWins = Math.random() < playerWinChance;

        // Set attacker and victim based on who won
        let attacker, victim, attackerTeam, victimTeam;
        if (playerWins) {
            attacker = playerFighter;
            victim = enemyFighter;
            attackerTeam = 'player';
            victimTeam = 'enemy';
        } else {
            attacker = enemyFighter;
            victim = playerFighter;
            attackerTeam = 'enemy';
            victimTeam = 'player';
        }

        // Get a random ability/death message for this killer
        let ability = null;
        let message = null;

        if (deathMessages[attacker]) {
            const abilities = Object.keys(deathMessages[attacker]);
            if (abilities.length > 0) {
                ability = abilities[Math.floor(Math.random() * abilities.length)];
                message = deathMessages[attacker][ability];
            }
        }

        // If no death message, create a generic one
        if (!message) {
            ability = "Unknown Attack";
            message = `${attacker} killed ${victim}. No witty message available.`;
        }

        // Record the death
        deaths.push({
            killer: attacker,
            victim: victim,
            ability: ability,
            message: message,
            killerTeam: attackerTeam,
            victimTeam: victimTeam
        });

        // Remove victim from alive list
        if (victimTeam === 'player') {
            alive.player = alive.player.filter(name => name !== victim);
        } else {
            alive.enemy = alive.enemy.filter(name => name !== victim);
        }
    }

    // Determine winner
    const playerWon = alive.player.length > 0;

    return { deaths, playerWon, survivors: playerWon ? alive.player : alive.enemy };
}

async function showGameOver() {
    transitionToScreen('loading-screen', 'game-over-screen');

    const deathMessageEl = document.getElementById('death-message');
    const killerContainer = document.getElementById('killer-container');
    const battleLog = document.getElementById('battle-log');
    const teamScoreEl = document.getElementById('team-score');

    deathMessageEl.textContent = "SIMULATING MATCH...";
    killerContainer.style.display = 'none';
    if (battleLog) battleLog.innerHTML = '';
    if (teamScoreEl) teamScoreEl.textContent = '';

    try {
        const response = await fetch('death_messages.json');
        if (!response.ok) throw new Error('Failed to load death messages');
        const deathMessages = await response.json();

        // Get teams (stored during loading screen)
        const playerTeam = window.currentPlayerTeam || [];
        const enemyTeam = window.currentEnemyTeam || [];

        if (playerTeam.length === 0 || enemyTeam.length === 0) {
            deathMessageEl.textContent = "Error: Teams not loaded properly.";
            return;
        }

        // Simulate the entire match
        const { deaths, playerWon, survivors } = simulateMatch(playerTeam, enemyTeam, deathMessages);

        // Show initial state
        deathMessageEl.textContent = "THE BATTLE BEGINS...";
        if (teamScoreEl) {
            teamScoreEl.textContent = `PLAYER TEAM: ${playerTeam.length} | ENEMY TEAM: ${enemyTeam.length}`;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Dramatically reveal each death in sequence
        let playerAlive = playerTeam.length;
        let enemyAlive = enemyTeam.length;

        for (let i = 0; i < deaths.length; i++) {
            const death = deaths[i];

            // Update alive counters
            if (death.victimTeam === 'player') {
                playerAlive--;
            } else {
                enemyAlive--;
            }

            // Update score
            if (teamScoreEl) {
                teamScoreEl.textContent = `PLAYER TEAM: ${playerAlive} | ENEMY TEAM: ${enemyAlive}`;
            }

            // Show death message
            deathMessageEl.textContent = death.message;

            // Show killer image
            let killerHeroObj = null;
            heroesData.classes.forEach(c => {
                c.heroes.forEach(h => {
                    if (h.name === death.killer) {
                        killerHeroObj = h;
                    }
                });
            });

            if (killerHeroObj) {
                const killerImage = document.getElementById('killer-image');
                const killerNameDisplay = document.getElementById('killer-name');
                killerImage.src = `images/heroes-thumbnails/${killerHeroObj.image}`;
                killerNameDisplay.textContent = death.killer;
                killerContainer.style.display = 'flex';
            }

            // Add to battle log if it exists
            if (battleLog) {
                const logEntry = document.createElement('div');
                logEntry.className = 'battle-log-entry';
                logEntry.innerHTML = `
                    <span class="death-number">#${i + 1}</span>
                    <span class="victim ${death.victimTeam}">${death.victim}</span>
                    <span class="killed-by">killed by</span>
                    <span class="killer ${death.killerTeam}">${death.killer}</span>
                `;
                battleLog.appendChild(logEntry);

                // Scroll to bottom
                battleLog.scrollTop = battleLog.scrollHeight;
            }

            // Pause between deaths (shorter for later deaths to build momentum)
            const delay = Math.max(1000, 2500 - (i * 100));
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Show final result
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (playerWon) {
            deathMessageEl.textContent = `🎉 VICTORY! ${survivors.join(', ')} survived!`;
            killerContainer.style.display = 'none';
        } else {
            deathMessageEl.textContent = `💀 DEFEAT! The enemy team claims victory.`;
            killerContainer.style.display = 'none';
        }

    } catch (error) {
        console.error("Error in match simulation:", error);
        deathMessageEl.textContent = "Error simulating match. Please try again.";
    }
}

// Restart Button Logic
document.getElementById('restart-btn').addEventListener('click', () => {
    transitionToScreen('game-over-screen', 'home-screen');
    // Optional: Reset selections or keep them? Keeping them is usually friendlier.
});

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== DAN RHON DEATHMATCH GAMEPLAY =====

// Global state for deathmatch
let deathmatchState = {
    playerKills: 0,
    enemyKills: 0,
    playerStats: {}, // { heroName: { kills, deaths, isAlive, team, heroData } }
    isRunning: false,
    killHistory: []
};

// Start Dan Rhon Deathmatch
function startDeathmatch() {
    console.log('Starting Dan Rhon Deathmatch!');

    // Reset state
    deathmatchState = {
        playerKills: 0,
        enemyKills: 0,
        playerStats: {},
        isRunning: true,
        killHistory: []
    };

    // Initialize player stats for all players
    initializePlayerStats();

    // Ensure grids are in deathmatch mode (2x3)
    const playerGrid = document.getElementById('player-team-grid');
    const enemyGrid = document.getElementById('enemy-team-grid');
    playerGrid.classList.remove('squirt-mode');
    enemyGrid.classList.remove('squirt-mode');

    // Populate team grids
    populateTeamGrid('player-team-grid', window.currentPlayerTeam, 'player');
    populateTeamGrid('enemy-team-grid', window.currentEnemyTeam, 'enemy');

    // Show kill counter, hide others
    document.getElementById('kill-counter-bar').style.display = 'flex';
    document.getElementById('barrel-position-bar').style.display = 'none';
    document.getElementById('turf-war-bar').style.display = 'none';
    document.getElementById('capture-overlay').classList.add('hidden');

    // Reset kill counter
    document.getElementById('player-score').textContent = '0';
    document.getElementById('enemy-score').textContent = '0';
    document.getElementById('player-kills-display').innerHTML = '';
    document.getElementById('enemy-kills-display').innerHTML = '';

    // Hide kill feed and victory overlay
    document.getElementById('kill-feed').classList.remove('active');
    document.getElementById('victory-overlay').classList.add('hidden');

    // Start kill simulation after a brief delay
    setTimeout(() => {
        if (deathmatchState.isRunning) {
            simulateNextKill();
        }
    }, 1500);
}

// Initialize stats for all players
function initializePlayerStats() {
    // Initialize player team
    window.currentPlayerTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        deathmatchState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'player',
            heroData: heroData
        };
    });

    // Initialize enemy team
    window.currentEnemyTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        deathmatchState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'enemy',
            heroData: heroData
        };
    });
}

// Find hero object by name
function findHeroByName(heroName) {
    for (const heroClass of heroesData.classes) {
        for (const hero of heroClass.heroes) {
            if (hero.name === heroName) {
                return hero;
            }
        }
    }
    return null;
}

// Populate team grid with player cards
function populateTeamGrid(gridId, teamHeroes, teamType) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    teamHeroes.forEach((heroName, index) => {
        const heroData = findHeroByName(heroName);
        if (!heroData) return;

        const card = document.createElement('div');
        card.className = 'player-card';
        card.setAttribute('data-hero', heroName);
        card.setAttribute('data-team', teamType);

        const thumb = document.createElement('img');
        thumb.className = 'player-card-thumb';
        thumb.src = `images/heroes-thumbnails/${heroData.image}`;
        thumb.alt = heroName;

        const name = document.createElement('div');
        name.className = 'player-card-name';
        name.textContent = heroName;

        card.appendChild(thumb);
        card.appendChild(name);
        grid.appendChild(card);
    });
}

// Simulate next kill
function simulateNextKill() {
    if (!deathmatchState.isRunning) return;

    // Random delay 1-3 seconds
    const delay = 1000 + Math.random() * 2000;

    setTimeout(() => {
        // Get alive players from each team
        const alivePlayers = Object.keys(deathmatchState.playerStats).filter(
            name => deathmatchState.playerStats[name].team === 'player' && deathmatchState.playerStats[name].isAlive
        );
        const aliveEnemies = Object.keys(deathmatchState.playerStats).filter(
            name => deathmatchState.playerStats[name].team === 'enemy' && deathmatchState.playerStats[name].isAlive
        );

        if (alivePlayers.length === 0 || aliveEnemies.length === 0) {
            console.log('No alive players on one team, skipping kill');
            setTimeout(() => simulateNextKill(), 500);
            return;
        }

        // Pick random fighters
        const playerFighter = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        const enemyFighter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

        const playerHero = deathmatchState.playerStats[playerFighter].heroData;
        const enemyHero = deathmatchState.playerStats[enemyFighter].heroData;

        // Determine winner using class advantage
        const playerWinChance = getClassAdvantage(playerHero.class, enemyHero.class);
        const playerWins = Math.random() < playerWinChance;

        const killer = playerWins ? playerFighter : enemyFighter;
        const victim = playerWins ? enemyFighter : playerFighter;
        const killerTeam = playerWins ? 'player' : 'enemy';
        const victimTeam = playerWins ? 'enemy' : 'player';

        // Get random death message
        const killerHero = deathmatchState.playerStats[killer].heroData;
        const victimHero = deathmatchState.playerStats[victim].heroData;
        const deathEvent = getRandomDeathMessage(killerHero, victimHero);

        // Update stats
        deathmatchState.playerStats[killer].kills++;
        deathmatchState.playerStats[victim].deaths++;
        deathmatchState.playerStats[victim].isAlive = false;

        // Update kill counter
        if (killerTeam === 'player') {
            deathmatchState.playerKills++;
        } else {
            deathmatchState.enemyKills++;
        }

        // Record kill event
        deathmatchState.killHistory.push({
            killer,
            victim,
            killerTeam,
            victimTeam,
            ability: deathEvent.ability,
            message: deathEvent.message,
            timestamp: Date.now()
        });

        // Show kill in feed
        displayKillFeed(killerHero, victimHero, deathEvent);

        // Mark victim as dead
        markPlayerDead(victim);

        // Update kill counter display
        updateKillCounter(killerTeam, victimHero);

        // Update score
        document.getElementById('player-score').textContent = deathmatchState.playerKills;
        document.getElementById('enemy-score').textContent = deathmatchState.enemyKills;

        // Respawn after 2 seconds
        setTimeout(() => {
            respawnPlayer(victim);

            // Check victory condition
            if (deathmatchState.playerKills >= 10 || deathmatchState.enemyKills >= 10) {
                deathmatchState.isRunning = false;
                setTimeout(() => showVictoryScreen(), 2000);
            } else {
                // Continue simulation
                simulateNextKill();
            }
        }, 2000);
    }, delay);
}

// Display kill feed
function displayKillFeed(killerHero, victimHero, deathEvent) {
    const killFeed = document.getElementById('kill-feed');
    const killerImg = document.getElementById('feed-killer-img');
    const victimImg = document.getElementById('feed-victim-img');
    const abilityEl = document.getElementById('feed-ability');
    const messageEl = document.getElementById('feed-message');

    killerImg.src = `images/heroes-thumbnails/${killerHero.image}`;
    victimImg.src = `images/heroes-thumbnails/${victimHero.image}`;
    abilityEl.textContent = deathEvent.ability;
    messageEl.textContent = deathEvent.message;

    // Show feed
    killFeed.classList.add('active');

    // Hide after 3 seconds
    setTimeout(() => {
        killFeed.classList.remove('active');
    }, 3000);
}

// Mark player as dead
function markPlayerDead(heroName) {
    const card = document.querySelector(`.player-card[data-hero="${heroName}"]`);
    if (card) {
        card.classList.add('dead');
    }
}

// Respawn player
function respawnPlayer(heroName) {
    deathmatchState.playerStats[heroName].isAlive = true;
    const card = document.querySelector(`.player-card[data-hero="${heroName}"]`);
    if (card) {
        card.classList.remove('dead');
    }
}

// Update kill counter with thumbnail
function updateKillCounter(killerTeam, victimHero) {
    const displayId = killerTeam === 'player' ? 'player-kills-display' : 'enemy-kills-display';
    const display = document.getElementById(displayId);

    const killThumb = document.createElement('img');
    killThumb.className = 'kill-thumb';
    killThumb.src = `images/heroes-thumbnails/${victimHero.image}`;
    killThumb.alt = 'Kill';

    display.appendChild(killThumb);
}

// Get random death message
function getRandomDeathMessage(killerHero, victimHero) {
    const killerAbilities = killerHero.abilities;

    // Build array of all abilities
    const abilities = [];
    if (killerAbilities.main_attack && killerAbilities.main_attack.name) {
        abilities.push({
            name: killerAbilities.main_attack.name,
            description: killerAbilities.main_attack.description
        });
    }
    if (killerAbilities.ability_1 && killerAbilities.ability_1.name) {
        abilities.push({
            name: killerAbilities.ability_1.name,
            description: killerAbilities.ability_1.description
        });
    }
    if (killerAbilities.ability_2 && killerAbilities.ability_2.name) {
        abilities.push({
            name: killerAbilities.ability_2.name,
            description: killerAbilities.ability_2.description
        });
    }
    if (killerAbilities.super && killerAbilities.super.name) {
        abilities.push({
            name: killerAbilities.super.name,
            description: killerAbilities.super.description
        });
    }

    // Pick random ability
    const ability = abilities.length > 0
        ? abilities[Math.floor(Math.random() * abilities.length)]
        : { name: 'Attack', description: 'A devastating blow!' };

    return {
        ability: ability.name,
        message: ability.description
    };
}

// Show victory screen
function showVictoryScreen() {
    const winningTeam = deathmatchState.playerKills >= 10 ? 'player' : 'enemy';
    const victoryOverlay = document.getElementById('victory-overlay');
    const victoryTitle = document.getElementById('victory-title');

    // Set title
    victoryTitle.textContent = winningTeam === 'player' ? 'YOUR TEAM WINS!' : 'ENEMY TEAM WINS!';

    // Populate stats tables
    populateStatsTable('player-stats-table', window.currentPlayerTeam);
    populateStatsTable('enemy-stats-table', window.currentEnemyTeam);

    // Determine and display star player
    const starPlayer = determineStarPlayer();
    displayStarPlayer(starPlayer);

    // Show overlay
    victoryOverlay.classList.remove('hidden');
}

// Populate stats table
function populateStatsTable(tableId, teamHeroes) {
    const container = document.getElementById(tableId);
    const table = document.createElement('div');
    table.className = 'stats-table';

    teamHeroes.forEach(heroName => {
        const stats = deathmatchState.playerStats[heroName];
        const row = document.createElement('div');
        row.className = 'stat-row';

        const name = document.createElement('div');
        name.className = 'stat-name';
        name.textContent = heroName;

        const values = document.createElement('div');
        values.className = 'stat-values';
        values.textContent = `${stats.kills}K / ${stats.deaths}D`;

        row.appendChild(name);
        row.appendChild(values);
        table.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

// Determine star player
function determineStarPlayer() {
    const allPlayers = Object.keys(deathmatchState.playerStats);
    let starPlayer = null;
    let bestRatio = -1;
    let mostKills = -1;

    allPlayers.forEach(heroName => {
        const stats = deathmatchState.playerStats[heroName];
        const kd = stats.kills / Math.max(stats.deaths, 1);

        if (kd > bestRatio || (kd === bestRatio && stats.kills > mostKills)) {
            bestRatio = kd;
            mostKills = stats.kills;
            starPlayer = heroName;
        }
    });

    return starPlayer;
}

// Display star player
function displayStarPlayer(starPlayerName) {
    const stats = deathmatchState.playerStats[starPlayerName];
    const heroData = stats.heroData;

    document.getElementById('star-player-img').src = `images/heroes-thumbnails/${heroData.image}`;
    document.getElementById('star-player-name').textContent = starPlayerName;

    const kdRatio = (stats.kills / Math.max(stats.deaths, 1)).toFixed(2);
    document.getElementById('star-player-stats').textContent = `${stats.kills} Kills / ${stats.deaths} Deaths (${kdRatio} K/D)`;
}

// Return to menu button
document.getElementById('return-to-menu-btn').addEventListener('click', () => {
    deathmatchState.isRunning = false;

    // Clear Squirt intervals
    if (squirtState.timerInterval) clearInterval(squirtState.timerInterval);
    if (squirtState.barrelInterval) clearInterval(squirtState.barrelInterval);
    squirtState.isRunning = false;

    // Clear Turf War intervals
    if (turfWarState) {
        turfWarState.isRunning = false;
        if (turfWarState.timerInterval) clearInterval(turfWarState.timerInterval);
        if (turfWarState.turfInterval) clearInterval(turfWarState.turfInterval);
        if (turfWarState.stealInterval) clearInterval(turfWarState.stealInterval);
        if (turfWarState.killInterval) clearInterval(turfWarState.killInterval);
    }

    transitionToScreen('gameplay-screen', 'home-screen');
});

// ===== SQUIRT MODE GAMEPLAY =====

// Global state for squirt mode
let squirtState = {
    barrelPosition: 50,
    timeRemaining: 120,
    playerStats: {},
    isRunning: false,
    timerInterval: null,
    barrelInterval: null
};

// Start Squirt Mode
function startSquirt() {
    console.log('Starting Squirt Mode!');

    // Reset state
    squirtState = {
        barrelPosition: 50,
        timeRemaining: 120,
        playerStats: {},
        isRunning: true,
        timerInterval: null,
        barrelInterval: null
    };

    // Show barrel bar, hide others
    document.getElementById('barrel-position-bar').style.display = 'flex';
    document.getElementById('kill-counter-bar').style.display = 'none';
    document.getElementById('turf-war-bar').style.display = 'none';
    document.getElementById('capture-overlay').classList.add('hidden');

    // Initialize player stats (reuse from deathmatch but with squirtState)
    window.currentPlayerTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        squirtState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'player',
            heroData: heroData
        };
    });

    window.currentEnemyTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        squirtState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'enemy',
            heroData: heroData
        };
    });

    // Populate 2x2 grids
    const playerGrid = document.getElementById('player-team-grid');
    const enemyGrid = document.getElementById('enemy-team-grid');
    playerGrid.classList.add('squirt-mode');
    enemyGrid.classList.add('squirt-mode');
    playerGrid.classList.remove('deathmatch-mode');
    enemyGrid.classList.remove('deathmatch-mode');

    populateTeamGrid('player-team-grid', window.currentPlayerTeam, 'player');
    populateTeamGrid('enemy-team-grid', window.currentEnemyTeam, 'enemy');

    // Reset barrel and timer
    document.getElementById('timer-display').textContent = '2:00';
    document.getElementById('timer-display').classList.remove('warning');
    document.getElementById('barrel-icon').style.left = '50%';

    // Hide kill feed and victory overlay
    document.getElementById('kill-feed').classList.remove('active');
    document.getElementById('victory-overlay').classList.add('hidden');

    // Start timer
    startSquirtTimer();

    // Start barrel movement
    startBarrelMovement();

    // Start kill simulation
    setTimeout(() => {
        if (squirtState.isRunning) {
            simulateNextSquirtKill();
        }
    }, 1500);
}

// Start squirt timer (5x real time speed)
function startSquirtTimer() {
    squirtState.timerInterval = setInterval(() => {
        squirtState.timeRemaining -= 1;

        const minutes = Math.floor(squirtState.timeRemaining / 60);
        const seconds = squirtState.timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById('timer-display');
        timerEl.textContent = display;

        // Warning color at 30 seconds
        if (squirtState.timeRemaining <= 30 && !timerEl.classList.contains('warning')) {
            timerEl.classList.add('warning');
        }

        // Time's up
        if (squirtState.timeRemaining <= 0) {
            clearInterval(squirtState.timerInterval);
            squirtState.isRunning = false;
            endSquirtGame('timeout');
        }
    }, 200); // 200ms real time = 1 second game time (5x speed)
}

// Start barrel movement
function startBarrelMovement() {
    squirtState.barrelInterval = setInterval(() => {
        if (!squirtState.isRunning) {
            clearInterval(squirtState.barrelInterval);
            return;
        }

        // Count alive players
        const alivePlayers = Object.values(squirtState.playerStats)
            .filter(s => s.team === 'player' && s.isAlive).length;
        const aliveEnemies = Object.values(squirtState.playerStats)
            .filter(s => s.team === 'enemy' && s.isAlive).length;

        const pushingForce = alivePlayers - aliveEnemies;

        // Base rate: 0.5% per second per player advantage
        // Accelerate as time runs out
        const timeMultiplier = 1 + (1 - squirtState.timeRemaining / 120);
        const baseRate = 0.5;
        const movementRate = baseRate * timeMultiplier;

        // Negative force pushes toward 100% (enemy wins)
        // Positive force pushes toward 0% (player wins)
        const movement = -pushingForce * movementRate * 0.1; // 0.1s update interval

        squirtState.barrelPosition += movement;
        squirtState.barrelPosition = Math.max(0, Math.min(100, squirtState.barrelPosition));

        // Update visual
        const barrelIcon = document.getElementById('barrel-icon');
        barrelIcon.style.left = `${squirtState.barrelPosition}%`;

        // Check victory
        if (squirtState.barrelPosition <= 0) {
            squirtState.isRunning = false;
            clearInterval(squirtState.barrelInterval);
            clearInterval(squirtState.timerInterval);
            endSquirtGame('barrel-player');
        } else if (squirtState.barrelPosition >= 100) {
            squirtState.isRunning = false;
            clearInterval(squirtState.barrelInterval);
            clearInterval(squirtState.timerInterval);
            endSquirtGame('barrel-enemy');
        }
    }, 100);
}

// Simulate squirt battles (runs every 5-10 game seconds)
function simulateNextSquirtKill() {
    if (!squirtState.isRunning) return;

    // 5-10 game seconds = 1000-2000ms real time (at 5x speed)
    const delay = 1000 + Math.random() * 1000;

    setTimeout(() => {
        // Get alive players from each team
        const alivePlayers = Object.keys(squirtState.playerStats).filter(
            name => squirtState.playerStats[name].team === 'player' && squirtState.playerStats[name].isAlive
        );
        const aliveEnemies = Object.keys(squirtState.playerStats).filter(
            name => squirtState.playerStats[name].team === 'enemy' && squirtState.playerStats[name].isAlive
        );

        if (alivePlayers.length === 0 || aliveEnemies.length === 0) {
            setTimeout(() => simulateNextSquirtKill(), 500);
            return;
        }

        // Pick random fighters
        const playerFighter = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        const enemyFighter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

        const playerHero = squirtState.playerStats[playerFighter].heroData;
        const enemyHero = squirtState.playerStats[enemyFighter].heroData;

        // Determine winner using class advantage
        const playerWinChance = getClassAdvantage(playerHero.class, enemyHero.class);
        const playerWins = Math.random() < playerWinChance;

        const killer = playerWins ? playerFighter : enemyFighter;
        const victim = playerWins ? enemyFighter : playerFighter;

        const killerHero = squirtState.playerStats[killer].heroData;
        const victimHero = squirtState.playerStats[victim].heroData;
        const deathEvent = getRandomDeathMessage(killerHero, victimHero);

        // Update stats
        squirtState.playerStats[killer].kills++;
        squirtState.playerStats[victim].deaths++;
        squirtState.playerStats[victim].isAlive = false;

        // Show kill in feed
        displayKillFeed(killerHero, victimHero, deathEvent);

        // Mark victim as dead
        markPlayerDead(victim);

        // Respawn after 10 game seconds (2 seconds real time)
        setTimeout(() => {
            if (squirtState.isRunning) {
                respawnPlayer(victim);
                squirtState.playerStats[victim].isAlive = true;
            }
        }, 2000);

        // Trigger next battle loop immediately (don't wait for respawn)
        if (squirtState.isRunning) {
            simulateNextSquirtKill();
        }
    }, delay);
}

// End squirt game
function endSquirtGame(reason) {
    if (squirtState.timerInterval) clearInterval(squirtState.timerInterval);
    if (squirtState.barrelInterval) clearInterval(squirtState.barrelInterval);

    let winningTeam;
    if (reason === 'barrel-player') {
        winningTeam = 'player';
    } else if (reason === 'barrel-enemy') {
        winningTeam = 'enemy';
    } else if (reason === 'timeout') {
        winningTeam = squirtState.barrelPosition < 50 ? 'player' : 'enemy';
    }

    setTimeout(() => showSquirtVictory(winningTeam), 2000);
}

// Show squirt victory screen (reuse victory overlay)
function showSquirtVictory(winningTeam) {
    const victoryOverlay = document.getElementById('victory-overlay');
    const victoryTitle = document.getElementById('victory-title');

    // Set title
    victoryTitle.textContent = winningTeam === 'player' ? 'YOUR TEAM WINS!' : 'ENEMY TEAM WINS!';

    // Populate stats tables
    populateSquirtStatsTable('player-stats-table', window.currentPlayerTeam);
    populateSquirtStatsTable('enemy-stats-table', window.currentEnemyTeam);

    // Determine and display star player
    const starPlayer = determineSquirtStarPlayer();
    displaySquirtStarPlayer(starPlayer);

    // Show overlay
    victoryOverlay.classList.remove('hidden');
}

// Populate squirt stats table
function populateSquirtStatsTable(tableId, teamHeroes) {
    const container = document.getElementById(tableId);
    const table = document.createElement('div');
    table.className = 'stats-table';

    teamHeroes.forEach(heroName => {
        const stats = squirtState.playerStats[heroName];
        const row = document.createElement('div');
        row.className = 'stat-row';

        const name = document.createElement('div');
        name.className = 'stat-name';
        name.textContent = heroName;

        const values = document.createElement('div');
        values.className = 'stat-values';
        values.textContent = `${stats.kills}K / ${stats.deaths}D`;

        row.appendChild(name);
        row.appendChild(values);
        table.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

// Determine squirt star player
function determineSquirtStarPlayer() {
    const allPlayers = Object.keys(squirtState.playerStats);
    let starPlayer = null;
    let bestRatio = -1;
    let mostKills = -1;

    allPlayers.forEach(heroName => {
        const stats = squirtState.playerStats[heroName];
        const kd = stats.kills / Math.max(stats.deaths, 1);

        if (kd > bestRatio || (kd === bestRatio && stats.kills > mostKills)) {
            bestRatio = kd;
            mostKills = stats.kills;
            starPlayer = heroName;
        }
    });

    return starPlayer;
}

// Display squirt star player
function displaySquirtStarPlayer(starPlayerName) {
    const stats = squirtState.playerStats[starPlayerName];
    const heroData = stats.heroData;

    document.getElementById('star-player-img').src = `images/heroes-thumbnails/${heroData.image}`;
    document.getElementById('star-player-name').textContent = starPlayerName;

    const kdRatio = (stats.kills / Math.max(stats.deaths, 1)).toFixed(2);
    document.getElementById('star-player-stats').textContent = `${stats.kills} Kills / ${stats.deaths} Deaths (${kdRatio} K/D)`;
}

// ===== TESSARUNE TURF WAR GAMEPLAY =====

// Global state for turf war
let turfWarState = {
    playerTurf: 50, // Percentage
    timeRemaining: 120, // Seconds
    playerStats: {},
    isRunning: false,
    timerInterval: null,
    turfInterval: null,
    stealInterval: null,
    killInterval: null
};

// Start Turf War Mode
function startTurfWar() {
    console.log('Starting Tessarune Turf War!');

    // Reset state
    turfWarState = {
        playerTurf: 50,
        timeRemaining: 120,
        playerStats: {},
        isRunning: true,
        timerInterval: null,
        turfInterval: null,
        stealInterval: null,
        killInterval: null
    };

    // Show turf war bar, hide others
    document.getElementById('turf-war-bar').style.display = 'flex';
    document.getElementById('kill-counter-bar').style.display = 'none';
    document.getElementById('barrel-position-bar').style.display = 'none';
    document.getElementById('capture-overlay').classList.add('hidden');

    // Initialize player stats
    initializeTurfWarStats();

    // Ensure grids are in standard mode (2x3)
    const playerGrid = document.getElementById('player-team-grid');
    const enemyGrid = document.getElementById('enemy-team-grid');
    playerGrid.classList.remove('squirt-mode');
    enemyGrid.classList.remove('squirt-mode');

    // Populate team grids
    populateTeamGrid('player-team-grid', window.currentPlayerTeam, 'player');
    populateTeamGrid('enemy-team-grid', window.currentEnemyTeam, 'enemy');

    // Reset display
    updateTurfDisplay();
    document.getElementById('turf-timer').textContent = '2:00';
    document.getElementById('turf-timer').classList.remove('warning');

    // Hide kill feed and victory overlay
    document.getElementById('kill-feed').classList.remove('active');
    document.getElementById('victory-overlay').classList.add('hidden');

    // Start systems
    startTurfWarTimer();
    startTurfSimulation();
    startTessaruneStealCheck();

    // Start kill simulation
    setTimeout(() => {
        if (turfWarState.isRunning) {
            simulateNextTurfWarKill();
        }
    }, 1500);
}

function initializeTurfWarStats() {
    // Initialize player team
    window.currentPlayerTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        turfWarState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'player',
            heroData: heroData
        };
    });

    // Initialize enemy team
    window.currentEnemyTeam.forEach(heroName => {
        const heroData = findHeroByName(heroName);
        turfWarState.playerStats[heroName] = {
            kills: 0,
            deaths: 0,
            isAlive: true,
            team: 'enemy',
            heroData: heroData
        };
    });
}

// Timer: 2x faster than real time
function startTurfWarTimer() {
    turfWarState.timerInterval = setInterval(() => {
        if (!turfWarState.isRunning) return;

        turfWarState.timeRemaining -= 1;

        const minutes = Math.floor(turfWarState.timeRemaining / 60);
        const seconds = turfWarState.timeRemaining % 60;

        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const timerEl = document.getElementById('turf-timer');
        timerEl.textContent = display;

        if (turfWarState.timeRemaining <= 30 && !timerEl.classList.contains('warning')) {
            timerEl.classList.add('warning');
        }

        if (turfWarState.timeRemaining <= 0) {
            endTurfWar('timeout');
        }
    }, 500); // 500ms real time = 1 second game time (2x speed)
}

// Simulate turf shifting back and forth
function startTurfSimulation() {
    turfWarState.turfInterval = setInterval(() => {
        if (!turfWarState.isRunning) return;

        // Random small shift (-2% to +2%)
        const shift = (Math.random() * 4) - 2;

        // Bias towards team with more alive players
        const alivePlayers = Object.values(turfWarState.playerStats)
            .filter(s => s.team === 'player' && s.isAlive).length;
        const aliveEnemies = Object.values(turfWarState.playerStats)
            .filter(s => s.team === 'enemy' && s.isAlive).length;

        const advantage = alivePlayers - aliveEnemies;
        const bias = advantage * 0.5; // 0.5% per player advantage

        turfWarState.playerTurf += (shift + bias);

        // Clamp (but don't end game here unless 100/0, handled in update)
        turfWarState.playerTurf = Math.max(0.1, Math.min(99.9, turfWarState.playerTurf));

        updateTurfDisplay();
    }, 2000);
}

function updateTurfDisplay() {
    // Round for display
    const pTurf = Math.round(turfWarState.playerTurf);
    const eTurf = 100 - pTurf;

    document.getElementById('player-turf-percent').textContent = `${pTurf}%`;
    document.getElementById('enemy-turf-percent').textContent = `${eTurf}%`;

    document.getElementById('player-turf-fill').style.width = `${pTurf}%`;
    document.getElementById('enemy-turf-fill').style.width = `${eTurf}%`;
}

// Tessarune Steal Mechanic
function startTessaruneStealCheck() {
    // Check every 5 seconds real time (equivalent to 10 seconds game time)
    turfWarState.stealInterval = setInterval(() => {
        if (!turfWarState.isRunning) return;

        // Calculate chance based on time remaining (120s total)
        // 0-30s elapsed (120-90 left): 0.5%
        // 30-60s elapsed (90-60 left): 1%
        // 60-90s elapsed (60-30 left): 3%
        // 90-120s elapsed (30-0 left): 6%

        let chance = 0.005;
        if (turfWarState.timeRemaining <= 90) chance = 0.01;
        if (turfWarState.timeRemaining <= 60) chance = 0.03;
        if (turfWarState.timeRemaining <= 30) chance = 0.06;

        // Get all alive players from both teams
        const allAlivePlayers = Object.keys(turfWarState.playerStats).filter(
            name => turfWarState.playerStats[name].isAlive
        );

        // Give each alive player a chance to steal
        for (const heroName of allAlivePlayers) {
            if (Math.random() < chance) {
                // Success!
                const team = turfWarState.playerStats[heroName].team;

                // Show message via kill feed as well
                const msg = team === 'player'
                    ? `${heroName} STOLE THE TESSARUNE!`
                    : `${heroName} STOLE THE RESSATUNE!`;

                const killFeed = document.getElementById('kill-feed');
                const killerImg = document.getElementById('feed-killer-img');
                const victimImg = document.getElementById('feed-victim-img');
                const abilityEl = document.getElementById('feed-ability');
                const messageEl = document.getElementById('feed-message');

                const heroData = turfWarState.playerStats[heroName].heroData;
                killerImg.src = `images/heroes-thumbnails/${heroData.image}`;
                victimImg.style.opacity = '0';

                abilityEl.textContent = "GAME WINNING STEAL!";
                messageEl.textContent = msg;

                killFeed.classList.add('active');

                // End game logic
                setTimeout(() => {
                    endTurfWar(team === 'player' ? 'steal-player' : 'steal-enemy', heroName);
                }, 1000);

                return;
            }
        }

    }, 5000); // 5000ms = 5s real time = 10s game time
}

// Simulate Battles (runs every 8-10 game seconds)
function simulateNextTurfWarKill() {
    if (!turfWarState.isRunning) return;

    // 8-10 game seconds = 4000-5000ms real time (at 2x speed)
    const delay = 4000 + Math.random() * 1000;

    setTimeout(() => {
        try {
            resolveTurfWarBattle();
        } catch (error) {
            console.error("Error in turf war battle:", error);
        }

        // Trigger next battle loop
        if (turfWarState.isRunning) {
            simulateNextTurfWarKill();
        }
    }, delay);
}

function resolveTurfWarBattle() {
    // Get alive players
    const alivePlayers = Object.keys(turfWarState.playerStats).filter(
        name => turfWarState.playerStats[name].team === 'player' && turfWarState.playerStats[name].isAlive
    );
    const aliveEnemies = Object.keys(turfWarState.playerStats).filter(
        name => turfWarState.playerStats[name].team === 'enemy' && turfWarState.playerStats[name].isAlive
    );

    if (alivePlayers.length === 0 || aliveEnemies.length === 0) {
        return;
    }

    // Pick fighters
    const playerFighter = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    const enemyFighter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

    const playerHero = turfWarState.playerStats[playerFighter].heroData;
    const enemyHero = turfWarState.playerStats[enemyFighter].heroData;

    // Determine winner
    const playerWinChance = getClassAdvantage(playerHero.class, enemyHero.class);
    const playerWins = Math.random() < playerWinChance;

    const killer = playerWins ? playerFighter : enemyFighter;
    const victim = playerWins ? enemyFighter : playerFighter;
    const killerTeam = playerWins ? 'player' : 'enemy';

    const killerHero = turfWarState.playerStats[killer].heroData;
    const victimHero = turfWarState.playerStats[victim].heroData;
    const deathEvent = getRandomDeathMessage(killerHero, victimHero);

    // Update stats
    turfWarState.playerStats[killer].kills++;
    turfWarState.playerStats[victim].deaths++;
    turfWarState.playerStats[victim].isAlive = false;

    // TURF WAR MECHANIC: Killer's team gains 5% turf
    if (killerTeam === 'player') {
        turfWarState.playerTurf += 5;
    } else {
        turfWarState.playerTurf -= 5;
    }
    updateTurfDisplay();

    // Show kill in feed
    // Restore victim image opacity if it was hidden by steal event
    document.getElementById('feed-victim-img').style.opacity = '1';
    displayKillFeed(killerHero, victimHero, deathEvent);

    // Mark victim as dead
    markPlayerDead(victim);

    // Check for 100% win condition
    if (turfWarState.playerTurf >= 100) {
        endTurfWar('turf-player');
        return;
    } else if (turfWarState.playerTurf <= 0) {
        endTurfWar('turf-enemy');
        return;
    }

    // Respawn after 10 game seconds (5 seconds real time)
    setTimeout(() => {
        if (turfWarState.isRunning) {
            respawnTurfWarPlayer(victim);
            turfWarState.playerStats[victim].isAlive = true;
        }
    }, 5000);
}

function endTurfWar(reason, stealerName) {
    if (!turfWarState.isRunning) return;

    turfWarState.isRunning = false;
    clearInterval(turfWarState.timerInterval);
    clearInterval(turfWarState.turfInterval);
    clearInterval(turfWarState.stealInterval);

    let winningTeam = 'player'; // default
    let victoryTitle = "";

    if (reason === 'timeout') {
        if (turfWarState.playerTurf > 50) {
            winningTeam = 'player';
            victoryTitle = "TIME UP! YOU CONTROL MORE TURF!";
        } else if (turfWarState.playerTurf < 50) {
            winningTeam = 'enemy';
            victoryTitle = "TIME UP! ENEMY CONTROLS MORE TURF!";
        } else {
            // Draw? Randomize or give to player
            winningTeam = 'player';
            victoryTitle = "TIME UP! IT'S A DRAW (YOU WIN!)";
        }
    } else if (reason === 'turf-player') {
        winningTeam = 'player';
        victoryTitle = "TOTAL DOMINATION! YOU CONTROL ALL TURF!";
    } else if (reason === 'turf-enemy') {
        winningTeam = 'enemy';
        victoryTitle = "DEFEAT! ENEMY CONTROLS ALL TURF!";
    } else if (reason === 'steal-player') {
        winningTeam = 'player';
        victoryTitle = `${stealerName} STOLE THE TESSARUNE!`;
    } else if (reason === 'steal-enemy') {
        winningTeam = 'enemy';
        victoryTitle = `${stealerName} STOLE THE RESSATUNE!`;
    }

    let delay = 1000;

    // If it was a steal, show the capture overlay first
    if (reason === 'steal-player' || reason === 'steal-enemy') {
        showCaptureOverlay(stealerName);
        delay = 4000;
    }

    setTimeout(() => {
        hideCaptureOverlay();
        showTurfWarVictory(winningTeam, victoryTitle);
    }, delay);
}

function showTurfWarVictory(winningTeam, titleText) {
    const victoryOverlay = document.getElementById('victory-overlay');
    const victoryTitle = document.getElementById('victory-title');

    victoryTitle.textContent = titleText || (winningTeam === 'player' ? 'YOUR TEAM WINS!' : 'ENEMY TEAM WINS!');

    // Populate stats tables
    populateTurfWarStatsTable('player-stats-table', window.currentPlayerTeam);
    populateTurfWarStatsTable('enemy-stats-table', window.currentEnemyTeam);

    // Star player
    displayTurfWarStarPlayer();

    victoryOverlay.classList.remove('hidden');
}

function displayTurfWarStarPlayer() {
    const allPlayers = Object.keys(turfWarState.playerStats);
    let starPlayer = null;
    let bestRatio = -1;
    let mostKills = -1;

    allPlayers.forEach(heroName => {
        const stats = turfWarState.playerStats[heroName];
        const kd = stats.kills / Math.max(stats.deaths, 1);

        if (kd > bestRatio || (kd === bestRatio && stats.kills > mostKills)) {
            bestRatio = kd;
            mostKills = stats.kills;
            starPlayer = heroName;
        }
    });

    if (starPlayer) {
        const stats = turfWarState.playerStats[starPlayer];
        const heroData = stats.heroData;

        document.getElementById('star-player-img').src = `images/heroes-thumbnails/${heroData.image}`;
        document.getElementById('star-player-name').textContent = starPlayer;

        const kdRatio = (stats.kills / Math.max(stats.deaths, 1)).toFixed(2);
        document.getElementById('star-player-stats').textContent = `${stats.kills} Kills / ${stats.deaths} Deaths (${kdRatio} K/D)`;
    }
}

// Populate stats table for Turf War
function populateTurfWarStatsTable(tableId, teamHeroes) {
    const container = document.getElementById(tableId);
    const table = document.createElement('div');
    table.className = 'stats-table';

    teamHeroes.forEach(heroName => {
        const stats = turfWarState.playerStats[heroName];
        const row = document.createElement('div');
        row.className = 'stat-row';

        const name = document.createElement('div');
        name.className = 'stat-name';
        name.textContent = heroName;

        const values = document.createElement('div');
        values.className = 'stat-values';
        values.textContent = `${stats.kills}K / ${stats.deaths}D`;

        row.appendChild(name);
        row.appendChild(values);
        table.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

// Respawn player visual only (for Turf War)
function respawnTurfWarPlayer(heroName) {
    const card = document.querySelector(`.player-card[data-hero="${heroName}"]`);
    if (card) {
        card.classList.remove('dead');
    }
}

// Show/Hide Capture Overlay
function showCaptureOverlay(heroName) {
    const overlay = document.getElementById('capture-overlay');
    const nameEl = document.getElementById('capture-hero-name');
    nameEl.textContent = heroName;
    overlay.classList.remove('hidden');
}

function hideCaptureOverlay() {
    const overlay = document.getElementById('capture-overlay');
    overlay.classList.add('hidden');
}
