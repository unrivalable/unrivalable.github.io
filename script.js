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
    'Destroyer': { primary: '#FF3366', secondary: '#FF8833' },
    'Defender': { primary: '#00BFFF', secondary: '#00FFFF' },
    'Saboteur': { primary: '#AA66FF', secondary: '#FF00FF' },
    'Supporter': { primary: '#00FF88', secondary: '#FFD700' },
    'Controller': { primary: '#FFD700', secondary: '#FF8833' },
    'Hawktalker': { primary: '#00FFFF', secondary: '#AA66FF' }
};

// Embedded heroes data
const heroesData = {
  "metadata": {
    "total_slides": 52,
    "total_classes": 6,
    "total_heroes": 45,
    "complete_heroes": 27,
    "incomplete_heroes": 18,
    "completion_rate": "60.0%"
  },
  "classes": [
    {
      "name": "Destroyer",
      "icon": "destroyer.png",
      "hero_count": 5,
      "heroes": [
        {
          "name": "Mr Unemployable",
          "image": "mr-unemployable.jpg",
          "abilities": "Main Attack: What goes forth\nThrows random objects from his inventory at enemies. If he misses, they stay on the ground\nAbility 1: Must come back\nWhen triggered, all items thrown zip back to him\nAbility 2: Big Ol Boomerang\nThrows a big ol boomerang that doesn't come back\nSuper: Vape Juice Storm\nRapidly chucks balls of radioactive vape juice around himself while simultaneously retracting them, creating a whirlwind of vape juice",
          "slide": 3
        },
        {
          "name": "Porthole",
          "image": "porthole.jpg",
          "abilities": "Main Attack: Porthole throw\nThrows a porthole forward\nAbility 1: A Hole new world\nPorthole drops a porthole on the ground, slipping through it and popping back out 3 meters behind\nAbility 2: Portastic Port-mine\nPorthole drops a Porthole on the ground. The porthole is invisible to enemies, and slows them on contact (3 uses)\nSuper: Underwater Genie\nPorthole summons Kneckakeckafallapulu, the underwater genie. He grants porthole one of three wishes, lasting for 20 seconds\nTrue Glass Form: Porthole's shots reveal enemies and deal double damage\nTrue Metal Form: Porthole's shots explode and deal area damage\nTrue Porthole Form: Porthole's shots bounce between enemies",
          "slide": 5
        },
        {
          "name": "The Triplets",
          "image": "the-triplets.png",
          "abilities": "Main Attack: Flap, Tackle, and Glop\nFootrun flaps his arms, Jetplace tackles forward and Junkrat shoots some fiery glop outta his crotch\nAbility 1: Switcherooski\nSwitches to the next Triplet\nAbility 2: Character Development\nFootrun dashes forward, becoming invisible for a few seconds (2 uses). Jetplace uses his portals to teleport behind an enemy. Junkrat fires some larger missiles outta his crotch.\nSuper: Into the Jetplace!\nThe triplets unite, joining hands and summoning a giant jetpack. They fly around the map dropping rockets outta his crotch and destruction.",
          "slide": 8
        },
        {
          "name": "Tickle Monster",
          "image": "tickle-monster.jpg",
          "abilities": "Main Attack: Tickle\nTickle\nAbility 1: High 8\nTickle Monster absolutely slaps somebody twice, first with the first five and then with the second 3\nAbility 2: Enhanced Peeling\nCan remove negative effects from himself and his teammates for a small amount of time\nSuper: ",
          "slide": 9
        },
        {
          "name": "Bee's Knees",
          "image": "bees-knees.jpg",
          "abilities": "Main Attack: Knee Combo\nKicks in a wide range, knees forward\nAbility 1: Flying Bee Drop\nJumps in the air and slams down with his knees forward, stinging enemies\nAbility 2: Float like a Butterfly\nSend a gust of air forward, creating an area of zero-gravity to trap enemies in\nSuper: Sting like a Knee\nLaunches rapid-fire stingers from his knees that poison enemies",
          "slide": 11
        }
      ]
    },
    {
      "name": "Defender",
      "icon": "defender.png",
      "hero_count": 7,
      "heroes": [
        {
          "name": "Handfoot",
          "image": "hand-foot.jpg",
          "abilities": "Main Attack: Fantastic Fist-Feet Flurry\nA 4-hit combo where he punches and kicks\nAbility 1: Hands become feet\nSwitches around his hands and feet, becoming more than just a man (also increases attack damage).\nAbility 2: You'll never know\nHandfoot switches his hands and feet so fast that he absorbs projectiles\nSuper: Flick'a the Wrist\nHandfoot enters flowstate, whirling hands and feet so fast while moving forward. He becomes an unstoppable juggernaut of damage and health",
          "slide": 13
        },
        {
          "name": "Floss",
          "image": "floss.jpg",
          "abilities": "Main Attack: Who Spiked the Punch?\nFloss punches, spikily\nAbility 1: Absorption\nFor the next 10 seconds, Floss takes 1/3rd of damage from projectiles\nAbility 2: Tease and Joke\nFloss gets demoralized by the other team for sucking, drawing their attention and firepower to him\nSuper: Big Spike Thing\nThe Great Gatsby shoots Floss in the chest with a big spike thing. But then Floss shoots it back super fast out of him and it explodes",
          "slide": 14
        },
        {
          "name": "Man Guy",
          "image": "man-guy.jpg",
          "abilities": "Main Attack: Man Punch\nMan Guy punches with his long arm like a ma\nAbility 1: Self Harm\nMan Guy deals damage to himself, increasing his attack\nAbility 2: Super Bones\nMan Guy boosts his bones, taking less damage for the next three secs\nSuper: Guy Kick\nMan Guy does a big kick,l that breaks his leg if he hits it he can do it again with more damage",
          "slide": 15
        },
        {
          "name": "Ultraviolet",
          "image": "ultraviolet.jpg",
          "abilities": "Main Attack: Ultraviolet Umbrella \nUltraviolet stabs with his umbrella, then opens it creating a small shield for 1 sec\nAbility 1: Lavender Lash\nUltraviolet blinds the nearest enemy with his purpleness, blinding them\nAbility 2: Mount the Indigoat!\nUltraviolet mounts the indigoat, gaining increased health and speed for 5 secs\nSuper: Purpleness Explosion\nUltraviolet shines his purpleness, gaining a shield and taunting all nearby enemies into attacking him",
          "slide": 17
        },
        {
          "name": "Guy Yacht",
          "image": "guy-yacht.jpg",
          "abilities": "Main Attack: Squirt Gun\nGuy Yacht fires high pressure water from his squirt gun \nAbility 1: Bomboclat\nGuy Yacht flexes his cheeks, taking 80% less damage from behind for a 5 seconds\nAbility 2: Eyes up here\nGuy Yacht launches into the air and lands on his butt, buffing the defense of allies he lands around\nSuper: Fantastic Plastic\nUsing the plastic in his veins, Guy Yacht hardens his entire body, taking overwhelmingly less damage from all sources",
          "slide": 18
        },
        {
          "name": "Captain Trumpet",
          "image": "captain-trumpet.jpg",
          "abilities": "Main Attack: Clawsini Gatini\nCaptain trumpet scratches twice with cat claws\nAbility 1: Shellala Shellalo\nCaptain Trumpet gains a shield for 5 secs\nAbility 2: Rameo Chargeo\nCaptain trumpet dashes  forward with his ram horns\nSuper: Trumpets Sounding\nCaptain trumpet Gains a health boost and a random animal buff:\n-Bunnini - Super jump\n-Peacocko - Taunt at full health\n-Sovereign Snakearms- Main Attack poisons",
          "slide": 20
        },
        {
          "name": "Gym Shark",
          "image": "gym-shark.png",
          "abilities": "Main Attack: Barbell strikenado\nAbility 1:Bulgarian tail squatnado\nAbility 2: Sharknado\nSuper: ROIDNADO\nSwims under ground and eats one person",
          "slide": 21
        }
      ]
    },
    {
      "name": "Saboteur",
      "icon": "saboteur.png",
      "hero_count": 5,
      "heroes": [
        {
          "name": "Captain Crunch",
          "image": "captain-crunch.jpg",
          "abilities": "Main Attack: Get you by the Knife\nCaptain Crunch Stabs enemies with his knife\nAbility 1: Oops all berries\nCaptain Crunch spills berries on the ground, slowing enemies around him\nAbility 2: Crunch Surprise\nCaptain crunch hides in a bush, and his next knife has a dash and does extra damage \nSuper: Take you to his special island\nCaptain crunch Takes himself and the nearest enemy to his special island for 10 secs, where he has increased stats",
          "slide": 23
        },
        {
          "name": "Jonnakiss",
          "image": "jonnakiss.jpg",
          "abilities": "Main Attack: Grass Throw\nJonnakiss throws grass, dealing more damage the closer the enemy is\nAbility 1: Sharp Grass\nJonnakiss sharpens his grass so that it does max damage at all distances for the next three throws\nAbility 2: Thundercloud mode\nJonnakiss quickly becomes a cloud then immediately shoots down in a lightning bolt, dealing massive damage\nSuper: Eat the grass!\nJonnakiss eats his grass, turning him into a invincible cloud for 15 seconds, he comes down on the ground as it snows slowing enemies in his area",
          "slide": 24
        },
        {
          "name": "Displeased Avian",
          "image": "displeased -avian.jpg",
          "abilities": "Main Attack: CAW CAWWW\nA rapid, short range peck with infinite ammo\nAbility 1: WAAAA HEEY\nRed flings himself to a designated area with his slingshot, stunning enemies on land\nAbility 2: WOOOIA UUU UU UY\nRed slices in a wide berth with his wings, doing 50% of the max health of the squishiest enemy caught.\nSuper: AAAAAIIIIIIAAA\nRed perfectly mimics the sound of a bird, frightening Big Pig and sending him on a rampage through the map",
          "slide": 25
        },
        {
          "name": "MU†E-ÅNT",
          "image": "mute-ant.jpg",
          "abilities": "Main Attack: Ant-Rings\nMute-Ant throws one of his ant-rings a short distance \nAbility 1: Ant-Bot\nAnt-Bot scans the area around him, revealing hidden objects and zapping enemies\nAbility 2: Ant-friend\n(In ant-form) Mute-Ant gets carried around by his insect friend; Señor butterfly, allowing him to fly for 8 secs\nSuper: Ant-Man\nMute-ant speaks for 10 seconds transforming him into an ant that is so tiny it is invisible",
          "slide": 27
        },
        {
          "name": "Machete Man",
          "image": "machete-man.jpg",
          "abilities": "Main Attack: Machete\nMachete Man slashes with his machete\nAbility 1: Machete Throw\nMachete man throws his machete then backflips to get a new one\nAbility 2: Dementia Machete Backflip\nMachete man does a backflip and has 50 chance of dealing a ton of damage to himself or an enemy\nSuper:  Old Guy Backflip\nMachete man does a backflip, gaining an extra Mach e, extra damage and extra speed",
          "slide": 29
        }
      ]
    },
    {
      "name": "Supporter",
      "icon": "supporter.png",
      "hero_count": 6,
      "heroes": [
        {
          "name": "Burger King",
          "image": "burger-king.jpg",
          "abilities": "Main Attack: Double Spatula Surprise\nBurger King makes burgers, LT to make funky burgers for teammates, RT to make evil burgers for enemies.\nAbility 1: The Great\nBurger King makes a big burger, providing cover for teammates and can be consumed for health.\nAbility 2: The Gatsby\nBurger King draws a spatula circle, creating a burger zone for teammates to gain increased attack in.\nSuper: The Great and The Gatsby\nBurger King Greats a Gatsby Burger, turning any teammate into the Great Gatsby for 1 minute. While the Great Gatsby, teammates have much more health and damage.",
          "slide": 33
        },
        {
          "name": "Brain Freeze",
          "image": "brain-freeze.jpg",
          "abilities": "Main Attack: I'm Not Having Fun\nBrainfreeze, shocked at the prospect of not fun, swings out with a one-handed punch, gaining Fun on hit. \nAbility 1: Use the Bomb (costs 2 Fun)\nBrainfreeze finally uses the bomb he always carries around, dealing small splash damage.\nAbility 2: You Fly When I'm Having Fun (costs 1 Fun) \nBrainfreeze can levitate a teammate, healing them and raising them to any height for 5 seconds.\nSuper: Time Flies When Your Having Fun\nBrainfreeze takes a hit of straight Fun, causing himself to enter a state of bliss, summoning Time Flies to tell him and his teammates the time in game and in real life for 30 seconds",
          "slide": 35
        },
        {
          "name": "Didgeridon't",
          "image": "digeridon't.jpg",
          "abilities": "Main Attack: Didgeridon't Come Near\nDidgeridon't swings his Didgeridon't in a wide arc, causing fall damage on hit.\nAbility 1: Didgeridon't Mess Around\nDidgeridon't stretches his arms, increasing super charge rate for 5 seconds.\nAbility 2: Digerididn't and Digeriwon't\nDidgeridon't summons the ghosts of Digeripast and the ghost of digerifuture to perform a line dance. They are solid and can block attacks.\nSuper: Didgeridon't Take Fall Damage\nDidgeridon't raises his Didgeridon't above his head, and for 15 seconds his teammates don't take fall damage.",
          "slide": 37
        },
        {
          "name": "DishwasHER",
          "image": "dishwasher.jpg",
          "abilities": "Main Attack: Womanly Plate Throw\nDishwasHER throws a plate in a female-like manner\nAbility 1: CassHERole \nDishwasHER drops a casserole that heals her teammates \nAbility 2: Stealth Mode\nDishwasHER goes into stealth mode, getting melee whisk weapons and changing her outfit which does nothing \nSuper: Do the Laundry\nDishwasHER removes all negative effects from her teammates and heals them significantly",
          "slide": 39
        },
        {
          "name": "PowerPoint",
          "image": "powerpoint.jpg",
          "abilities": "Main Attack: Laser Taser Blaser Face\nPower point shoots a laser at an enemies face. If the enemy is wearing a blaser, it does double damage\nAbility 1: Minor Blind\nPowerPoint temporarily blinds one enemy, leaving a \"blind spot\" where they can't see for 5 seconds\nAbility 2: 3rd D vision\nPowerPoint sees through the first and the second D's, and him and his teammates can see enemies wherever they are on the map\nSuper: Super Distract\nPower point summons a random point on the map, and all other characers are sucked towards that point and can",
          "slide": 40
        },
        {
          "name": "Shan't Dance",
          "image": "shan't-dance.jpg",
          "abilities": "Main Attack: Autissles\nShan't fires mini-missiles from his wheelchair\nAbility 1: Wheelchair Tow\nShan't attaches his wheelchair to another teammate, significantly boosting their movement speed\nAbility 2: Wheel Steel\nShan't shoots a wheel off of his wheelchair, providing cover for teammates behind them (2 uses)\nSuper: Motivational JUMP\nShan't, after charging all game, performs the biggest jump you've seen any guy do before. This incredible morale boost gives all teammates in the area incredible jump height, regeneration, and healing over time",
          "slide": 41
        }
      ]
    },
    {
      "name": "Controller",
      "icon": "controller.png",
      "hero_count": 4,
      "heroes": [
        {
          "name": "Faceplant",
          "image": "faceplant.jpg",
          "abilities": "Main Attack: Shovel Slash\nFaceplant attacks with shovel, dealing heavy melee damage and launching weaker vines out in front of him\nAbility 1:  Face full of Plant\nFaceplant Excretes a large amount of poisonous pollen from his face\nAbility 2: Plant full of Face \nFaceplant creates an area of plants who encourage his teammates, giving bonus attack and speed \nSuper: Plant full of Plant\nFaceplant creates an area that wraps enemies up vines, stunning them",
          "slide": 44
        },
        {
          "name": "Grom",
          "image": "grom.jpg",
          "abilities": "Main Attack: Bud Go Boom!\nGrom throws his walkie-talkie over obstacles at a long range that explodes into four piercing projectiles in a cross pattern.\nAbility 1: Watchtower\nUpon activation, Grom drops a turret that allows him and allies to see enemies inside bushes in its 10-tile radius.\nAbility 2: Radio Check\nActivating this Gadget allows Grom's next attack to fire three walkie-talkies in quick succession.\nSuper: Grom Bomb\nGrom throws a giant, longer-ranged bomb from his back over obstacles that explodes into four piercing projectiles in a cross pattern, similarly to his main attack.",
          "slide": 45
        },
        {
          "name": "Winter WonderGirl",
          "image": "winter-wondergirl.jpg",
          "abilities": "Main Attack: Super Snowglober\nWinter Wondergirl throws a snow globe, which breaks and pulls enemies in\nAbility 1: Shake it up\nWinter Wondergirl makes it snow around her, freezing enemies \nAbility 2: Rain down the sun fog \nWinter Wondergirl breaks a snowglobe with a lot of fog, causing a smoke bomb\nSuper:  Wonderlate the multisphere\nWinter Wondergirl builds a giant snow globe, any enemies in it take a ton of damage and are slowed",
          "slide": 47
        },
        {
          "name": "Smurtle Gurltle Cheesecake Woman",
          "image": "smurtle-gurltle-cheesecake-woman.jpg",
          "abilities": "Main Attack: Krazy Karate Kicks\nSGCW kicks with a three kick combo \nAbility 1: Super Ultra Tornado Spin\nNinja Mode - SGCW does a stunning spin kick \nTurtle Mode - SGCW spins around in her turtle shell and is invincible throughout\nAbility 2: Mega Tsunami Cheesecake\nNinja Mode - SGCW dashes forward spilling slowing cheesecake behind her\nTurtle Mode - SGCW consumes her cheesecake to gain health and movement speed\nSuper: Supersaiyan Ultra Cheesecake Weapon Ninja Gurl Explosion!\nSGCW switches to the other mode. Ninja Mode has low health and high speed. Turtle mode has low speed high health. SGCW gets a attack boost after switching",
          "slide": 48
        }
      ]
    },
    {
      "name": "Hawktalker",
      "icon": "hawktalker.png",
      "hero_count": 0,
      "heroes": []
    }
  ]
};

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
            heroGridHTML += `
                <div class="hero-card" data-hero="${hero.name}" data-class="${className}">
                    <div class="hero-card-image">
                        <img src="images/heroes/${hero.image}" alt="${hero.name}">
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
            const heroName = card.getAttribute('data-hero');
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

function formatAbilities(abilitiesText) {
    // Split abilities by common patterns
    const abilities = abilitiesText.split(/(?=Main Attack:|Ability 1:|Ability 2:|Super:)/);

    let html = '<div class="abilities-list">';
    abilities.forEach(ability => {
        if (ability.trim()) {
            const match = ability.match(/^(Main Attack|Ability \d|Super):\s*(.+)/s);
            if (match) {
                const label = match[1];
                const description = match[2].trim();
                html += `<div class="ability-item"><strong>${label}:</strong> <div class="ability-desc">${description}</div></div>`;
            }
        }
    });
    html += '</div>';

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

    // Show modal
    modal.classList.add('active');

    // Clean up old listeners to prevent duplicates
    const newSelectBtn = selectBtn.cloneNode(true);
    selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new listeners
    newSelectBtn.addEventListener('click', () => {
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

// Random Selection Function
function randomSelection() {
    // Get all available heroes (from all classes with heroes)
    const allHeroes = [];
    heroesData.classes.forEach(heroClass => {
        if (heroClass.hero_count > 0) {
            heroClass.heroes.forEach(hero => {
                allHeroes.push({
                    hero: hero,
                    className: heroClass.name
                });
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

async function startGame() {
    if (!selectedHero) {
        alert("Please select a hero first!");
        // Shake the character menu item
        const charItem = document.querySelector('[data-menu="character"]');
        charItem.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { charItem.style.animation = ''; }, 500);
        return;
    }

    if (!selectedGameMode) {
        alert("Please select a game mode first!");
         // Shake the gamemode menu item
        const modeItem = document.querySelector('[data-menu="gamemode"]');
        modeItem.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { modeItem.style.animation = ''; }, 500);
        return;
    }

    // Get Game Mode Image
    const gameModeSlide = document.querySelector(`.carousel-slide[data-mode="${selectedGameMode}"]`);
    const gameModeImgSrc = gameModeSlide.querySelector('.carousel-image img').src;

    // Get Hero Image
    // Use helper to find hero object in heroesData
    let heroObj = null;
    heroesData.classes.forEach(c => {
        c.heroes.forEach(h => {
            if (h.name === selectedHero.name) {
                heroObj = h;
            }
        });
    });

    // Fallback if not found (shouldn't happen)
    const heroImgSrc = heroObj ? `images/heroes/${heroObj.image}` : '';

    // Transition to Loading Screen
    transitionToScreen('home-screen', 'loading-screen');

    // Setup Loading Screen
    const loadingBg = document.getElementById('loading-bg');
    const loadingHero = document.getElementById('loading-hero');
    const progressFill = document.getElementById('progress-fill');

    loadingBg.style.backgroundImage = `url('${gameModeImgSrc}')`;
    loadingHero.src = heroImgSrc;

    // Reset progress fill
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    // Force a reflow to ensure the width is reset
    void progressFill.offsetHeight;

    // Set transition for 10 second animation
    progressFill.style.transition = 'width 10s linear';

    // Start animation on next frame
    requestAnimationFrame(() => {
        progressFill.style.width = '100%';
    });

    // Wait 10 seconds then show Game Over
    setTimeout(async () => {
        await showGameOver();
    }, 10000);
}

async function showGameOver() {
    // Reset progress fill for next time (remove transition first)
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    transitionToScreen('loading-screen', 'game-over-screen');

    const deathMessageEl = document.getElementById('death-message');
    const killerContainer = document.getElementById('killer-container');
    const killerImage = document.getElementById('killer-image');
    const killerNameDisplay = document.getElementById('killer-name');

    deathMessageEl.textContent = "Loading death message...";
    killerContainer.style.display = 'none';

    try {
        const response = await fetch('death_messages.json');
        if (!response.ok) throw new Error('Failed to load death messages');
        const deathMessages = await response.json();

        // Filter out the selected hero from keys
        const otherHeroes = Object.keys(deathMessages).filter(name => name !== selectedHero.name);

        if (otherHeroes.length === 0) {
             deathMessageEl.textContent = "You died alone.";
             return;
        }

        // Randomly select a hero
        const randomHeroName = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];
        const heroMessages = deathMessages[randomHeroName];

        // Randomly select a message from that hero
        const messageKeys = Object.keys(heroMessages);
        const randomMessageKey = messageKeys[Math.floor(Math.random() * messageKeys.length)];
        const message = heroMessages[randomMessageKey];

        deathMessageEl.textContent = message;

        // Find killer image
        let killerHeroObj = null;
        heroesData.classes.forEach(c => {
            c.heroes.forEach(h => {
                if (h.name === randomHeroName) {
                    killerHeroObj = h;
                }
            });
        });

        if (killerHeroObj) {
            killerImage.src = `images/heroes/${killerHeroObj.image}`;
            killerNameDisplay.textContent = randomHeroName;
            killerContainer.style.display = 'flex';
        } else {
            console.log("Killer image not found for:", randomHeroName);
            // Optional: Show a default "Unknown" image or just keep hidden
        }

    } catch (error) {
        console.error("Error loading death messages:", error);
        deathMessageEl.textContent = "You died. (Error loading specific death message)";
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
