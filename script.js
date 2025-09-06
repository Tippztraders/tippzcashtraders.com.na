// Globals for lightbox state
let currentProductIndex = 0;
let currentImageIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxDots = document.getElementById("lightboxDots");

// Open lightbox at given product and image
function openLightbox(productIndex, imageIndex) {
  currentProductIndex = productIndex;
  currentImageIndex = imageIndex;
  updateLightbox(currentImageIndex);
  lightbox.style.display = "flex";
}

// Close lightbox
function closeLightbox(scrollBack = false) {
  lightbox.style.display = "none";
  if (scrollBack) {
    const target = document.getElementById(`item${currentProductIndex + 1}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

// Update lightbox image and dots
function updateLightbox(imageIndex = null) {
  const images = document
    .querySelectorAll(`.product-card`)[currentProductIndex]
    .querySelectorAll("img");

  if (imageIndex !== null) currentImageIndex = imageIndex;

  lightboxImage.src = images[currentImageIndex].src;

  lightboxDots.innerHTML = [...images]
    .map((_, i) => `<div class="${i === currentImageIndex ? 'active' : ''}" onclick="updateLightbox(${i})"></div>`)
    .join('');
}

// Swipe image left/right on mobile
let startX = null;
lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
lightbox.addEventListener('touchmove', e => {
  if (startX === null) return;
  let diffX = e.touches[0].clientX - startX;
  const images = document.querySelectorAll(`.product-card`)[currentProductIndex].querySelectorAll("img");

  if (Math.abs(diffX) > 50) {
    if (diffX < 0) currentImageIndex = (currentImageIndex + 1) % images.length;
    else currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
    startX = null;
  }
});

// Tap outside the image to close lightbox
lightbox.addEventListener("click", function (e) {
  const imageWrapper = document.querySelector(".lightbox-image-wrapper");
  if (!imageWrapper.contains(e.target)) closeLightbox(true);
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (lightbox.style.display !== "flex") return;
  const images = document.querySelectorAll(`.product-card`)[currentProductIndex].querySelectorAll("img");

  if (e.key === "ArrowRight") { currentImageIndex = (currentImageIndex + 1) % images.length; updateLightbox(); }
  if (e.key === "ArrowLeft") { currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; updateLightbox(); }
  if (e.key === "Escape") { closeLightbox(true); }
});

// Like button logic
function toggleLike(icon, productIndex) {
  const likedKey = `liked_${productIndex}`;
  const isLiked = localStorage.getItem(likedKey) === 'true';

  if (isLiked) {
    localStorage.removeItem(likedKey);
    icon.classList.remove('liked');
  } else {
    localStorage.setItem(likedKey, 'true');
    icon.classList.add('liked');
    createBurstHearts(icon);
    showLoveText(icon);
  }
}

function initLikes() {
  const likeIcons = document.querySelectorAll('.fa-heart');
  likeIcons.forEach((icon, idx) => {
    if (localStorage.getItem(`liked_${idx}`) === 'true') {
      icon.classList.add('liked');
    }
  });
}

// Burst hearts animation
function createBurstHearts(targetIcon) {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.classList.add('burst-heart');
    heart.style.setProperty('--x', (Math.random() * 2 - 1).toFixed(2));
    heart.style.setProperty('--y', (Math.random() * 2 - 1).toFixed(2));
    const rect = targetIcon.getBoundingClientRect();
    heart.style.position = 'fixed';
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }
}

// Show "I 💖 this 😎" text temporarily
function showLoveText(targetIcon) {
  const loveText = document.createElement('div');
  loveText.textContent = "I 💖 this 😎";
  loveText.style.position = 'fixed';
  loveText.style.color = 'red';
  loveText.style.fontWeight = 'bold';
  loveText.style.fontSize = '14px';
  loveText.style.left = `${targetIcon.getBoundingClientRect().left}px`;
  loveText.style.top = `${targetIcon.getBoundingClientRect().top - 20}px`;
  loveText.style.userSelect = 'none';
  document.body.appendChild(loveText);
  setTimeout(() => loveText.remove(), 1500);
}

// WhatsApp button handler
function sendWhatsappMessage(productName) {
  const message = encodeURIComponent(`Hello Tippz, I am interested in your product: "${productName}". Please provide more details.`);
  const whatsappNumber = "+264817859603";
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank");
}

// Init likes on load
window.onload = initLikes;
