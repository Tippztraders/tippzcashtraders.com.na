// ✅ This is the swipe image + tap-dot-to-close + desktop arrow support code

const products = [
  {
    images: ["PH1.png"],
    name: "White Office Chair",
    price: "N$700",
    condition: "Excellent Condition"
  },
  {
    images: ["PH2sold.png"],
    name: "32L Samsung Microwave",
    price: "N$950",
    condition: "Pre-Loved",
    status: "SOLD"      // status: "SOLD"
  },
  {
    images: ["PH3a.jpg", "PH3b.jpg"],
    name: "Electrical Frying Pan",
    price: "N$450",
    condition: "Pre-Loved"
  },
  {
    images: ["PH4.jpg"],
    name: "Traditional Pot #3",
    price: "N$350",
    condition: "Showroom Quality"
  },
  {
    images: ["PH5.jpg"],
    name: "Traditional Pot #2",
    price: "N$250",
    condition: "Showroom Quality"
  },
  {
    images: ["PH6a.jpg", "PH6b.jpg", "PH6c.jpg"],
    name: "32L Samsung Microwave",
    price: "N$1,250",
    condition: "Trendsetter"
  },
  {
    images: ["PH7.png"],
    name: "Office Chair #3",
    price: "N$750",
    condition: "Well-Maintained"
  },
  {
    images: ["PH8.png"],
    name: "Office Chair #1",
    price: "N$500",
    condition: "Well-Maintained"
  },
  {
    images: ["PH9.jpg"],
    name: "Kitchen Sink",
    price: "N$1,250",
    condition: "Well-Maintained"
  },
  {
    images: ["PH10a.png", "PH10b.jpg", "PH10c.jpg"],
    name: "Event Tables Combo: Kickstart your dream business today; Was:3550 for both tables",
    price: "NOW: N$2,900",
    condition: "Pre-Loved"
  },
  {
    images: ["PH11a.jpg", "PH11b.jpg", "PH11c.jpg", "PH11d.jpg", "PH11e.jpg"],
    name: "Assorted Fabric",
    price: "N$20 per meter",
    condition: "Excellent Condition"
  },
  {
    images: ["PH12.jpg"],
    name: "Mirror #1",
    price: "N$1,250",
    condition: "Excellent Condition"
  },
  {
    images: ["PH14.jpg"],
    name: "Electrical Cable",
    price: "N$50",
    condition: "New"
  }
];
const productContainer = document.querySelector(".product-grid");

function renderProducts() {
  productContainer.innerHTML = products.map((product, i) => `
    <div class="product-card" id="item${i + 1}">
      <div class="image-wrapper" style="position: relative;">
        <img src="${product.images[0]}" alt="${product.name}" onclick="openLightbox(${i}, 0)" />
        ${
          product.images.length > 1
            ? `<div class="image-dots" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px;">
                 ${product.images.map((_, dotIndex) => `<div style="width: 8px; height: 8px; background: #999; border-radius: 50%; opacity: 0.7;"></div>`).join('')}
               </div>`
            : ''
        }
      </div>
      <h4>${product.name}</h4>
      <p class="price">${product.price}</p>
      <span class="condition faded-badge">${product.condition}</span>
      <p class="status ${product.status === 'SOLD' ? 'sold' : ''}">${product.status || "In Stock"}</p> 
      <div class="like-section">
        <i class="fas fa-heart" onclick="toggleLike(this, ${i})"></i>
      </div>
      <a href="#" class="whatsapp-button" onclick="sendWhatsappMessage(event, ${i})">
        <i class="fab fa-whatsapp"></i> WhatsApp Seller
      </a>
    </div>
  `).join('');
}

renderProducts();

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

// Close lightbox, optionally scroll back to product
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
// Accept optional index to show a specific image
function updateLightbox(imageIndex = null) {
  const images = products[currentProductIndex].images;
  if (imageIndex !== null) {
    currentImageIndex = imageIndex;
  }
  lightboxImage.src = images[currentImageIndex];

  lightboxDots.innerHTML = images.map((_, i) => `
    <div class="${i === currentImageIndex ? 'active' : ''}" onclick="updateLightbox(${i})"></div>
  `).join('');
}

// Swipe image left/right on mobile
let startX = null;

lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener('touchmove', e => {
  if (startX === null) return;
  let x = e.touches[0].clientX;
  let diffX = x - startX;

  if (Math.abs(diffX) > 50) {
    const images = products[currentProductIndex].images;
    if (diffX < 0) {
      currentImageIndex = (currentImageIndex + 1) % images.length;
    } else {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    updateLightbox();
    startX = null;
  }
});

// Tap anywhere outside the image to close lightbox
lightbox.addEventListener("click", function (e) {
  const imageWrapper = document.querySelector(".lightbox-image-wrapper");
  if (!imageWrapper.contains(e.target)) {
    closeLightbox(true);
  }
});

// Keyboard arrow keys for desktop navigation and escape to close
document.addEventListener("keydown", e => {
  if (lightbox.style.display !== "flex") return;
  const images = products[currentProductIndex].images;
  if (e.key === "ArrowRight") {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
  }
  if (e.key === "ArrowLeft") {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
  }
  if (e.key === "Escape") {
    closeLightbox(true);
  }
});

// Like button logic with localStorage and burst hearts
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

// Initialize like buttons state on page load
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
function sendWhatsappMessage(e, productIndex) {
  e.preventDefault();
  const productName = products[productIndex].name;
  const message = encodeURIComponent(`Hello Tippz, I am interested in your product: "${productName}". Please provide more details.`);
  const whatsappNumber = "+264817859603";
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank");
}

// Initialize likes on page load
window.onload = () => {
  initLikes();
};
