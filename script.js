// ==========================================
// 1. BIRTHDAY DATE AND ELEMENTS
// ==========================================

const targetBirthday = new Date('2026-11-14T00:00:00');

const countdownMusic = document.getElementById('countdownMusic');
const birthdayMusic = document.getElementById('birthdayMusic');

const startOverlay = document.getElementById('startOverlay');

const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minsElement = document.getElementById('mins');
const secsElement = document.getElementById('secs');

const mainTitle = document.getElementById('mainTitle');
const cakeStatus = document.getElementById('cakeStatus');
const cake = document.getElementById('cake');

const candles = document.querySelectorAll('.candle');

const secretMessage = document.getElementById('secretMessage');
const postBlowContent = document.getElementById('postBlowContent');

const giftBox = document.getElementById('giftBox');
const couponReveal = document.getElementById('couponReveal');

const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');


// ==========================================
// 2. GLOBAL VARIABLES
// ==========================================

let unlocked = false;
let blownCount = 0;

let celebrationStarted = false;
let contentRevealed = false;

let countdownInterval = null;
let audioStarted = false;


// ==========================================
// 3. AUDIO SETTINGS
// ==========================================

countdownMusic.volume = 0.8;
birthdayMusic.volume = 0.9;

// Make sure both songs are stopped initially.
countdownMusic.pause();
birthdayMusic.pause();


// ==========================================
// 4. START SCREEN AND COUNTDOWN MUSIC
// ==========================================

startOverlay.addEventListener('click', function () {

    // Start the appropriate music.
    if (!audioStarted) {
        audioStarted = true;

        if (!contentRevealed) {
            countdownMusic.currentTime = 0;

            countdownMusic.play().catch(error => {
                console.log('Countdown music playback failed:', error);
            });
        } else {
            birthdayMusic.play().catch(error => {
                console.log('Birthday music playback failed:', error);
            });
        }
    }

    // Fade out the entrance overlay.
    startOverlay.classList.add('hidden');

    // Completely remove it after the transition.
    setTimeout(() => {
        startOverlay.style.display = 'none';
    }, 600);

});


// ==========================================
// 5. COUNTDOWN FUNCTION
// ==========================================

function updateCountdown() {

    const now = new Date().getTime();
    const distance = targetBirthday.getTime() - now;

    if (distance <= 0) {

        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minsElement.textContent = '00';
        secsElement.textContent = '00';

        triggerZeroHour();

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );

    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minsElement.textContent = String(minutes).padStart(2, '0');
    secsElement.textContent = String(seconds).padStart(2, '0');

}


// ==========================================
// 6. COUNTDOWN ENDS, CANDLES UNLOCK
// ==========================================

function triggerZeroHour() {

    if (unlocked) return;

    unlocked = true;

    clearInterval(countdownInterval);

    mainTitle.textContent = 'MAKE A WISH! 🎂';

    cakeStatus.textContent = 'Blow out all 3 candles!';

    cake.classList.remove('locked-cake');

}


// ==========================================
// 7. GRAND CELEBRATION
// ==========================================

function launchGrandCelebration() {

    if (celebrationStarted) return;

    celebrationStarted = true;

    if (typeof confetti === 'function') {

        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const defaults = {
            startVelocity: 35,
            spread: 360,
            ticks: 60,
            zIndex: 9999
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {

            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2
                }
            });

            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2
                }
            });

        }, 250);

    }

}


// ==========================================
// 8. NIGHT AMBIENCE
// ==========================================

function startNightAmbience() {

    const ambience = document.createElement('div');

    ambience.id = 'nightAmbience';

    document.body.appendChild(ambience);


    // BUTTERFLIES

    for (let i = 0; i < 14; i++) {

        const butterfly = document.createElement('div');

        butterfly.className = 'night-butterfly';

        if (i % 2 === 1) {
            butterfly.classList.add('reverse-flight');
        }

        butterfly.textContent = '🦋';

        butterfly.style.top =
            `${5 + Math.random() * 88}%`;

        butterfly.style.animationDuration =
            `${16 + Math.random() * 20}s`;

        butterfly.style.animationDelay =
            `${-Math.random() * 25}s`;

        butterfly.style.fontSize =
            `${22 + Math.random() * 20}px`;

        ambience.appendChild(butterfly);

    }


    // FIREFLIES

    for (let i = 0; i < 45; i++) {

        const firefly = document.createElement('div');

        firefly.className = 'firefly';

        firefly.style.left =
            `${Math.random() * 100}%`;

        firefly.style.top =
            `${Math.random() * 100}%`;

        firefly.style.animationDelay =
            `${Math.random() * 5}s`;

        firefly.style.animationDuration =
            `${3 + Math.random() * 5}s`;

        ambience.appendChild(firefly);

    }

}


// ==========================================
// 9. CANDLE CLICK EVENTS
// ==========================================

candles.forEach(candle => {

    candle.addEventListener('click', event => {

        event.stopPropagation();

        // Candles cannot be blown before countdown ends.
        if (!unlocked) return;

        // Prevent clicking the same candle twice.
        if (candle.classList.contains('blown')) return;

        candle.classList.add('blown');

        blownCount++;

        // Check whether all three candles are blown.
        if (blownCount === candles.length) {

            revealBirthdayContent();

        }

    });

});


// ==========================================
// 10. REVEAL BIRTHDAY CONTENT
// ==========================================

function revealBirthdayContent() {

    if (contentRevealed) return;

    contentRevealed = true;

    // FADE IN THE MOONLIT BEACH BACKGROUND
    document.body.classList.add('birthday-revealed');


    // STOP COUNTDOWN MUSIC

    countdownMusic.pause();
    countdownMusic.currentTime = 0;


    // START BIRTHDAY MUSIC

    birthdayMusic.currentTime = 0;

    birthdayMusic.play().catch(error => {
        console.log('Birthday music playback failed:', error);
    });


    // REVEAL BIRTHDAY LETTER

    secretMessage.classList.remove('locked-content');

    secretMessage.classList.add('show-content');


    // REVEAL GALLERY AND VIP PASS

    postBlowContent.classList.remove('locked-content');

    postBlowContent.classList.add('show-content');


    // UPDATE STATUS

    cakeStatus.textContent = 'HAPPY BIRTHDAY! 🎂🎉';


    // ONE-TIME GRAND CELEBRATION

    launchGrandCelebration();


    // START BUTTERFLIES AND FIREFLIES

    startNightAmbience();


    // START LETTER ANIMATION

    typeBirthdayLetter();

}


// ==========================================
// 11. BIRTHDAY LETTER TYPING EFFECT
// ==========================================

function typeBirthdayLetter() {

    const letterText = document.getElementById('typedLetterText');

    const signOff = document.getElementById('letterSignOff');

    const message = `Happiest birthdayyy!! ❤️

I hope you have the best year ahead, filled with happiness, crazy memories, lots of laughter and everything you've been waiting for.

Keep that smile on your face and don't ever change the way you are. You're honestly one of those people who can be really annoying sometimes but still somehow make me want to talk to you more. 😂❤️

I hope we get to make a lot more memories, have those never-ending conversations, pull each other's legs, flirt, tease and do all the random things we usually do.

And please, don't stop being your usual self. That little attitude, your cuteness and all that drama are part of the package, I guess. ;)

Have an amazing birthday. Enjoy every bit of it, birthday girl! Sending you lots of love, tight hugs and a few kisses too. 😘❤️

P.S. Don't forget my return gift. I'll happily accept a few extra kisses from you. In fact, I wouldn't mind if you got a little generous with them. ;) 💋;`

    let index = 0;

    letterText.textContent = '';

    function type() {

        if (index < message.length) {

            letterText.textContent += message.charAt(index);

            index++;

            setTimeout(type, 35);

        } else {

            signOff.style.opacity = '1';

        }

    }

    type();

}


// ==========================================
// 12. GIFT BOX INTERACTION
// ==========================================

giftBox.addEventListener('click', () => {

    if (couponReveal.style.display === 'block') {

        couponReveal.style.display = 'none';

        giftBox.querySelector('.gift-text').textContent =
            'Tap to Unbox Surprise!';

    } else {

        couponReveal.style.display = 'block';

        giftBox.querySelector('.gift-text').textContent =
            'Surprise Unlocked! 🎉';

        if (typeof confetti === 'function') {

            confetti({
                particleCount: 120,
                spread: 80,
                origin: {
                    y: 0.7
                },
                zIndex: 9999
            });

        }

    }

});


// ==========================================
// 13. PHOTO GALLERY LIGHTBOX
// ==========================================

const galleryImages = document.querySelectorAll('.photo-card img');

galleryImages.forEach(img => {

    img.addEventListener('click', () => {

        lightboxImg.src = img.src;

        lightboxModal.style.display = 'flex';

    });

});


const lightboxClose = document.querySelector('.lightbox-close');

lightboxClose.addEventListener('click', () => {

    lightboxModal.style.display = 'none';

});


lightboxModal.addEventListener('click', event => {

    if (event.target === lightboxModal) {

        lightboxModal.style.display = 'none';

    }

});


// ==========================================
// 14. INITIALIZE COUNTDOWN
// ==========================================

updateCountdown();

countdownInterval = setInterval(updateCountdown, 1000);