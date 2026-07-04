// Global Mock Data (Expand this as needed)
const globalProducts = [
  { id: 1, name: 'Minimalist Keyboard', category: 'Tech', price: 2999, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500' },
  { id: 2, name: 'Wireless Mouse', category: 'Tech', price: 1499, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500' },
  { id: 3, name: 'Leather Desk Mat', category: 'Home Office', price: 1999, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500' },
  { id: 4, name: 'Cotton Crew T-Shirt', category: 'Apparel', price: 799, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
  { id: 5, name: 'Noise Cancelling Headphones', category: 'Tech', price: 8999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { id: 6, name: 'Aluminum Laptop Stand', category: 'Accessories', price: 2499, image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=500' }
];

// --- AUTHENTICATION LOGIC ---
function isLoggedIn() {
  // Checks if the user has a valid login flag in localStorage
  return localStorage.getItem('lumina_logged_in') === 'true';
}

function requireAuth() {
  if (!isLoggedIn()) {
    alert("Please log in to add items to your cart or wishlist.");
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem('lumina_logged_in'); // Clear login state
  window.location.href = 'landing.html'; // Redirect to landing page
}

// --- CART & WISHLIST LOGIC ---
function addToCart(name, price, img) {
  if (!requireAuth()) return; // Stop if not logged in

  let cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image: img, quantity: 1 });
  }
  
  localStorage.setItem('lumina_cart', JSON.stringify(cart));
  updateBadges();
  alert(`${name} added to cart!`);
}

function toggleWishlist(id, name, price, img) {
  if (!requireAuth()) return; // Stop if not logged in

  let wishlist = JSON.parse(localStorage.getItem('lumina_wishlist')) || [];
  const index = wishlist.findIndex(item => item.id === id);
  
  if (index > -1) {
    wishlist.splice(index, 1); // Remove if exists
  } else {
    wishlist.push({ id, name, price, image: img }); // Add if doesn't exist
  }
  
  localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
  
  // Update icon visually
  const icon = document.getElementById(`wishlist-icon-${id}`);
  if (icon) {
    icon.classList.toggle('bi-heart');
    icon.classList.toggle('bi-heart-fill');
    icon.classList.toggle('text-danger');
    icon.classList.toggle('text-dark');
  }
  updateBadges();
}

function updateBadges() {
  const cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('lumina_wishlist')) || [];
  
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalItems;
    totalItems > 0 ? cartBadge.classList.remove('d-none') : cartBadge.classList.add('d-none');
  }
  
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
    wishlist.length > 0 ? wishlistBadge.classList.remove('d-none') : wishlistBadge.classList.add('d-none');
  }
}

// Initialize badges on load
document.addEventListener('DOMContentLoaded', updateBadges);
