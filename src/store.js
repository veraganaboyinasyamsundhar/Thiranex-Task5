const CART_KEY = "morrow.cart.v1";
const FAVORITES_KEY = "morrow.favorites.v1";

function read(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

const storedCart = read(CART_KEY, []);
const storedFavorites = read(FAVORITES_KEY, []);
let cart = (Array.isArray(storedCart) ? storedCart : []).filter((item) => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0);
let favorites = (Array.isArray(storedFavorites) ? storedFavorites : []).filter((id) => typeof id === "string");

function persist() {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    window.dispatchEvent(new CustomEvent("shop:storage-error"));
  }
  window.dispatchEvent(new CustomEvent("shop:change", { detail: getState() }));
}

export function getState() {
  return { cart: cart.map((item) => ({ ...item })), favorites: [...favorites] };
}

export function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartItems(products) {
  return cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity } : null;
  }).filter(Boolean);
}

export function addToCart(id, quantity = 1) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
  else cart.push({ id, quantity: Math.min(99, Math.max(1, quantity)) });
  persist();
}

export function setQuantity(id, quantity) {
  const entry = cart.find((item) => item.id === id);
  if (!entry) return;
  entry.quantity = Math.min(99, Math.max(1, quantity));
  persist();
}

export function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  persist();
}

export function clearCart() {
  cart = [];
  persist();
}

export function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((entry) => entry !== id) : [...favorites, id];
  persist();
  return favorites.includes(id);
}

export function isFavorite(id) {
  return favorites.includes(id);
}
