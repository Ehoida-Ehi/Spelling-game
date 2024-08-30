const images = [
    { src: './images/apple.jpg', word: 'APPLE' },
    { src: './images/dogs.webp', word: 'DOG' },
    { src: './images/ball.jpg', word: 'BALL' },
    { src: './images/cake.webp', word: 'CAKE' }
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const carousel = document.getElementById('carousel');
const spellingBox = document.getElementById('spellingBox');
const keyboard = document.getElementById('keyboard');
const timerElement = document.getElementById('timer');
const resultModal = document.getElementById('resultModal');
const finalScoreElement = document.getElementById('finalScore');
const gradeTextElement = document.getElementById('gradeText');
let currentImageIndex = 0;
let currentWord = '';
let score = 0;
let timeRemaining = 60;
let timerInterval, imageTimeout;
let canSubmit = true;

function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.classList.add('absolute', 'top-0', 'left-0', 'fade');
    return img;
}

function showNextImage() {
    // Reset the spelling box and enable submission
    clearSpellingBox();
    canSubmit = true;

    // Show the current image
    const currentImage = createImageElement(images[currentImageIndex].src);
    carousel.appendChild(currentImage);
    setTimeout(() => {
        currentImage.classList.add('show');
    }, 10);

    currentWord = images[currentImageIndex].word;

    // Start the 60-second timeout for this image
    imageTimeout = setTimeout(() => {
        currentImage.classList.remove('show');
        setTimeout(() => {
            carousel.removeChild(currentImage);
            goToNextImage();
        }, 1000);
    }, 60000);

    // Reset and start the timer
    startTimer();
}

function clearSpellingBox() {
    spellingBox.innerText = '';
}

function updateSpellingBox(letter) {
    if (canSubmit) {
        spellingBox.innerText += letter;
    }
}

function submitSpelling() {
    if (canSubmit) {
        const userSpelling = spellingBox.innerText.trim();
        if (userSpelling === currentWord) {
            score++;
            alert('Correct!');
            canSubmit = false;
            clearTimeout(imageTimeout); // Stop the current image timeout
            goToNextImage(); // Move to the next image
        } else {
            alert('Incorrect! Try again.');
            clearSpellingBox(); // Clear the spelling box for a new attempt
        }
    }
}

function goToNextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        showNextImage(); // Show the next image
    } else {
        showResult(); // Show the result modal after all images are done
    }
}

function showResult() {
    resultModal.classList.remove('hidden');
    finalScoreElement.innerText = score;
    gradeTextElement.innerText = getGrade(score);
    clearInterval(timerInterval);
}

function getGrade(score) {
    switch (score) {
        case 4:
            return 'Very Well';
        case 3:
            return 'Well';
        case 2:
            return 'Average';
        case 1:
            return 'Bad';
        default:
            return 'Very Bad';
    }
}

function restartGame() {
    score = 0;
    currentImageIndex = 0;
    timeRemaining = 60;
    timerElement.innerText = timeRemaining;
    resultModal.classList.add('hidden');
    showNextImage();
}

function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = 60; // Reset the timer for each new image
    timerElement.innerText = timeRemaining;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            goToNextImage();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    clearTimeout(imageTimeout);
}

alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter;
    button.className = 'bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded';
    button.addEventListener('click', () => updateSpellingBox(letter));
    keyboard.appendChild(button);
});

document.getElementById('submitBtn').addEventListener('click', submitSpelling);
document.getElementById('startTimerBtn').addEventListener('click', startTimer);
document.getElementById('stopTimerBtn').addEventListener('click', stopTimer);

// Start the game by showing the first image
showNextImage();

