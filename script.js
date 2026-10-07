// Screen Navigation
let currentScreen = 1;

function nextScreen(screenNum) {
  document.getElementById(`screen-${currentScreen}`).classList.remove('active');
  currentScreen = screenNum;
  document.getElementById(`screen-${currentScreen}`).classList.add('active');
}

// Screen 2 Interaction: Stars
let tapCount = 0;
function handleTapScreen2(e) {
  if (tapCount >= 3) return;

  tapCount++;
  const starsRow = document.getElementById('stars-row');
  const star = document.createElement('div');
  star.className = 'star';
  starsRow.appendChild(star);

  const title = document.getElementById('screen2-title');
  const sub = document.getElementById('screen2-sub');

  if (tapCount === 1) {
    title.textContent = "You show up.";
  } else if (tapCount === 3) {
    title.textContent = "And everything lights up.";
    sub.style.display = 'none';
    document.getElementById('screen2-btn').style.display = 'inline-flex';
  }
}

// Screen 3 Interaction: Hold Button
const holdBtn = document.getElementById('hold-btn');
const progressBar = document.getElementById('progress-bar');
const percentText = document.getElementById('percent-text');
const holdHeart = document.getElementById('hold-heart');

let holdProgress = 0;
let holdInterval = null;
const maxDashOffset = 565;

function startHold(e) {
  if (e && e.cancelable) e.preventDefault();
  if (holdProgress >= 100) return;

  if (!holdInterval) {
    holdInterval = setInterval(() => {
      holdProgress += 2;
      if (holdProgress >= 100) {
        holdProgress = 100;
        clearInterval(holdInterval);
        holdInterval = null;
        completeHold();
      }
      updateProgress();
    }, 30);
  }
}

function endHold(e) {
  if (e && e.cancelable) e.preventDefault();
  if (holdProgress < 100) {
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
    holdProgress = 0;
    updateProgress();
  }
}

function updateProgress() {
  const offset = maxDashOffset - (maxDashOffset * holdProgress) / 100;
  progressBar.style.strokeDashoffset = offset;
  
  if (holdProgress < 100) {
    percentText.textContent = `${Math.floor(holdProgress)}%`;
    holdHeart.style.transform = `scale(${1 + holdProgress / 200})`;
  } else {
    percentText.textContent = '∞';
    holdHeart.style.transform = 'scale(1.3)';
  }
}

function completeHold() {
  setTimeout(() => {
    nextScreen(4);
  }, 600);
}

// Desktop Mouse Events
holdBtn.addEventListener('mousedown', startHold);
holdBtn.addEventListener('mouseup', endHold);
holdBtn.addEventListener('mouseleave', endHold);

// Mobile Touch Events
holdBtn.addEventListener('touchstart', startHold, { passive: false });
holdBtn.addEventListener('touchend', endHold, { passive: false });
holdBtn.addEventListener('touchcancel', endHold, { passive: false });

// Screen 4 & Modal Interaction
function openLetter() {
  document.getElementById('letter-modal').classList.add('open');
}

function closeLetterAndAdvance() {
  document.getElementById('letter-modal').classList.remove('open');
  nextScreen(5);
}

// Screen 5 Interaction: Send Hug
function sendHug(e) {
  const btn = document.getElementById('hug-btn');
  btn.textContent = 'Hug sent! 💕';

  const clientX = e.touches ? e.touches[0].clientX : (e.clientX || window.innerWidth / 2);
  const clientY = e.touches ? e.touches[0].clientY : (e.clientY || window.innerHeight / 2);

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart-particle';
      heart.textContent = ['❤️', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];

      heart.style.left = `${clientX + (Math.random() * 120 - 60)}px`;
      heart.style.top = `${clientY + (Math.random() * 60 - 30)}px`;

      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 2500);
    }, i * 100);
  }
}
