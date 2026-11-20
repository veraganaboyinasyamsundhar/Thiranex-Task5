import "../css/style.css";
import { products, getProduct } from "./products.js";
import { navigate, routeFor } from "./router.js";
import { addToCart, getCartCount, removeFromCart, setQuantity, toggleFavorite } from "./store.js";
import { refreshShopGrid, renderAbout, renderCart, renderHome, renderNotFound, renderProduct, renderShop, setShopCategory, setShopSearch, setShopSort } from "./views.js";

const app = document.querySelector("#app");
const cartCount = document.querySelector("#cart-count");
const cartLink = document.querySelector(".cart-link");
const toast = document.querySelector("#toast");
let activeRoute = { name: "home" };
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function updateCartBadge() {
  const quantity = getCartCount();
  cartCount.textContent = String(quantity);
  cartLink.setAttribute("aria-label", `Shopping bag, ${quantity} ${quantity === 1 ? "item" : "items"}`);
}

function renderRoute() {
  activeRoute = routeFor();
  switch (activeRoute.name) {
    case "home": app.innerHTML = renderHome(); break;
    case "shop": app.innerHTML = renderShop(); refreshShopGrid(); break;
    case "product": app.innerHTML = renderProduct(activeRoute.id); break;
    case "cart": app.innerHTML = renderCart(); break;
    case "about": app.innerHTML = renderAbout(); break;
    default: app.innerHTML = renderNotFound();
  }
  document.querySelectorAll("[data-route]").forEach((link) => {
    if (["/shop", "/about"].includes(link.dataset.route)) {
      if (link.dataset.route === window.location.pathname) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("a[data-route]");
  if (routeLink && (event.button === 0 || event.button === undefined) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    navigate(routeLink.dataset.route);
    return;
  }

  const categoryButton = event.target.closest("button[data-action='category']");
  if (categoryButton) {
    setShopCategory(categoryButton.dataset.category);
    return;
  }

  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  if (action === "add") {
    const quantityInput = document.querySelector("#detail-quantity");
    const quantity = quantityInput ? Math.max(1, Math.min(99, Number.parseInt(quantityInput.value, 10) || 1)) : 1;
    const product = getProduct(id);
    if (!product) return;
    addToCart(id, quantity);
    showToast(`${product.name} added to your bag.`);
  } else if (action === "favorite") {
    const saved = toggleFavorite(id);
    if (activeRoute.name === "shop") refreshShopGrid();
    else if (activeRoute.name === "home") app.innerHTML = renderHome();
    else if (activeRoute.name === "product") app.innerHTML = renderProduct(activeRoute.id);
    showToast(saved ? "Saved for later." : "Removed from saved items.");
  } else if (action === "quantity") {
    const item = document.querySelector(`.cart-item[data-id="${CSS.escape(id)}"]`);
    const current = Number.parseInt(item?.querySelector(".quantity-control span")?.textContent || "1", 10);
    setQuantity(id, current + Number(actionButton.dataset.delta));
    if (activeRoute.name === "cart") app.innerHTML = renderCart();
  } else if (action === "remove") {
    removeFromCart(id);
    if (activeRoute.name === "cart") app.innerHTML = renderCart();
    showToast("Item removed from your bag.");
  } else if (action === "checkout") {
    showToast("Demo checkout only — no payment will be collected.");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("#shop-search")) setShopSearch(event.target.value);
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#shop-sort")) setShopSort(event.target.value);
});

window.addEventListener("popstate", renderRoute);
window.addEventListener("shop:change", updateCartBadge);
window.addEventListener("shop:storage-error", () => showToast("Storage is unavailable. Changes may not persist."));

document.querySelector("#year").textContent = String(new Date().getFullYear());
updateCartBadge();
renderRoute();
