const typedLines = [
  "Happy Princess Day, my love.",
  "Meri Lado Rani, tu meri duniya hai.",
  "You make every day magical.",
];

const typedTextEl = document.getElementById("typedText");
const heroSection = document.getElementById("hero");
const heroPhoto = document.getElementById("heroPhoto");
const contrastToggle = document.getElementById("contrastToggle");
const speakButton = document.getElementById("speakMessage");
const messageCard = document.querySelector(".message-card");
const secretHeart = document.getElementById("secretHeart");
const surpriseMessage = document.getElementById("surpriseMessage");
const confettiContainer = document.getElementById("confettiContainer");
const backgroundAudio = document.getElementById("backgroundAudio");

let typedIndex = 0;
let charIndex = 0;
let typingForward = true;

function typewriterLoop() {
  const currentLine = typedLines[typedIndex];

  if (typingForward) {
    typedTextEl.textContent = currentLine.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentLine.length) {
      typingForward = false;
      setTimeout(typewriterLoop, 1500);
      return;
    }
  } else {
    typedTextEl.textContent = currentLine.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      typingForward = true;
      typedIndex = (typedIndex + 1) % typedLines.length;
    }
  }
  setTimeout(typewriterLoop, typingForward ? 100 : 50);
}

typewriterLoop();

heroSection.addEventListener("mousemove", (event) => {
  const rect = heroSection.getBoundingClientRect();
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 20;
  heroSection.style.backgroundPosition = `${50 - offsetX / 4}% ${50 - offsetY / 4}%`;
  heroPhoto.style.transform = `translate(${offsetX / 4}px, ${offsetY / 4}px)`;
});

heroSection.addEventListener("mouseleave", () => {
  heroSection.style.backgroundPosition = "";
  heroPhoto.style.transform = "";
});

contrastToggle.addEventListener("change", (event) => {
  document.body.classList.toggle("high-contrast", event.target.checked);
});

const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
let currentGalleryIndex = 0;

function openModal(index) {
  const image = galleryImages[index];
  if (!image) return;
  currentGalleryIndex = index;
  modalImage.src = image.src;
  modalCaption.textContent = image.dataset.caption || "";
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("active");
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function showNext(step) {
  const nextIndex = (currentGalleryIndex + step + galleryImages.length) % galleryImages.length;
  openModal(nextIndex);
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openModal(index));
  img.addEventListener("keypress", (event) => {
    if (event.key === "Enter") openModal(index);
  });
  img.tabIndex = 0;
});

modalClose.addEventListener("click", closeModal);
modalPrev.addEventListener("click", () => showNext(-1));
modalNext.addEventListener("click", () => showNext(1));

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("active")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") showNext(-1);
  if (event.key === "ArrowRight") showNext(1);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

function speakMessageText() {
  const message =
    "Pahal, tumhari muskaan mere liye sab kuch hai. Har pal tumhare saath special lagta hai. Happy Princess Day — may your every dream come true. Love, Rajat.";
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-IN";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } else {
    alert("Speech not supported on this browser.");
  }
}

speakButton.addEventListener("click", speakMessageText);

let heartTapCount = 0;
secretHeart.addEventListener("click", () => {
  heartTapCount += 1;
  secretHeart.classList.add("pulse");
  setTimeout(() => secretHeart.classList.remove("pulse"), 300);

  if (heartTapCount === 3) {
    revealSecret();
  }
});

function revealSecret() {
  surpriseMessage.textContent = "Tum ho meri forever princess. I love you — Rajat ❤️";
  triggerConfetti();
  heartTapCount = 0;
}

function triggerConfetti() {
  confettiContainer.innerHTML = "";
  const colors = ["#ff5aa5", "#ff9cc1", "#ffd1e8", "#ffffff"];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("span");
    confetti.className = "confetti-piece";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[i % colors.length];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

if (messageCard) {
  observer.observe(messageCard);
}

function setupBackgroundMusic() {
  if (!backgroundAudio) return;

  const unlockAudio = () => {
    backgroundAudio.play().finally(() => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    });
  };

  const playPromise = backgroundAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.addEventListener("click", unlockAudio, { once: true });
      document.addEventListener("touchstart", unlockAudio, { once: true });
    });
  }
}

setupBackgroundMusic();

