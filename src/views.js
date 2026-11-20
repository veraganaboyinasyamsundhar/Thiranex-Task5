import { categories, escapeHTML, formatPrice, getProduct, products } from "./products.js";
import { getCartItems, isFavorite } from "./store.js";

let activeCategory = "All objects";
let activeSort = "featured";
let activeSearch = "";

function card(product) {
  const favorite = isFavorite(product.id);
  return `<article class="product-card">
    <div class="product-image-wrap"><a class="product-image-link" href="/product/${product.id}" data-route="/product/${product.id}" aria-label="View ${escapeHTML(product.name)}"><img class="product-image" src="${product.image}" alt="${escapeHTML(product.alt)}" loading="lazy" decoding="async"></a>
      ${product.tag ? `<span class="product-tag">${escapeHTML(product.tag)}</span>` : ""}
      <button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-action="favorite" data-id="${product.id}" aria-label="${favorite ? "Remove from" : "Add to"} saved items: ${escapeHTML(product.name)}" aria-pressed="${favorite}">♡</button>
    </div>
    <div class="product-info"><div><a class="product-name" href="/product/${product.id}" data-route="/product/${product.id}">${escapeHTML(product.name)}</a><p class="product-category">${escapeHTML(product.category)}</p></div><strong class="product-price">${formatPrice(product.price)}</strong></div>
    <button class="card-add" type="button" data-action="add" data-id="${product.id}">Add to bag <span aria-hidden="true">+</span></button>
  </article>`;
}

export function renderHome() {
  const featured = products.filter((product) => product.featured);
  return `<section class="hero-section"><div class="hero-copy"><p class="eyebrow">OBJECTS FOR EVERYDAY LIVING</p><h1>Make space<br>for <em>slower.</em></h1><p>Thoughtful things for the little rituals that make a day feel like your own.</p><a class="button button-dark" href="/shop" data-route="/shop">Explore the collection <span aria-hidden="true">↗</span></a><span class="hero-note">Considered essentials. Made to stay.</span></div><div class="hero-art"><img src="${products[2].image}" alt="Sculptural Arc table lamp in warm golden light" fetchpriority="high"><span class="hero-art-caption">THE SOFT LIGHT EDITION <span>01 / 08</span></span><span class="hero-orbit" aria-hidden="true"></span></div><div class="hero-side-note" aria-hidden="true">A LITTLE MORE<br>ROOM TO BREATHE</div></section>
  <section class="promise-bar" aria-label="Our values"><span>Thoughtful materials</span><span class="promise-dot">✳</span><span>Small batch makers</span><span class="promise-dot">✳</span><span>Designed for the everyday</span></section>
  <section class="collection-section"><div class="section-title"><div><p class="eyebrow">THE GOOD THINGS</p><h2>Everyday, elevated.</h2></div><a class="text-link" href="/shop" data-route="/shop">View all objects <span aria-hidden="true">↗</span></a></div><div class="product-grid">${featured.map(card).join("")}</div></section>
  <section class="story-strip"><span class="story-mark" aria-hidden="true">✳</span><div><p class="eyebrow">A NOTE FROM MORROW</p><h2>Less, but with a little more meaning.</h2><p>We believe the things we reach for every day deserve a little thought. Morrow brings together honest materials, useful shapes, and pieces that feel good to live with.</p><a class="text-link" href="/about" data-route="/about">Meet the makers <span aria-hidden="true">↗</span></a></div></section>`;
}

export function renderShop() {
  activeCategory = "All objects";
  activeSort = "featured";
  activeSearch = "";
  const categoryButtons = categories.map((category) => `<button class="category-button${category === activeCategory ? " is-active" : ""}" type="button" data-action="category" data-category="${escapeHTML(category)}" aria-pressed="${category === activeCategory}">${escapeHTML(category)}</button>`).join("");
  return `<section class="page-intro"><p class="eyebrow">FIND YOUR EVERYDAY</p><h1>Objects with <em>intention.</em></h1><p>Small comforts and useful details, chosen to feel at home in your home.</p></section>
  <section class="shop-section" aria-label="Product catalog"><div class="shop-controls"><div class="category-list" id="category-list" role="group" aria-label="Product categories">${categoryButtons}</div><div class="shop-tools"><label class="shop-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search products</span><input id="shop-search" type="search" placeholder="Search objects" value=""></label><label class="sort-label" for="shop-sort">Sort</label><select id="shop-sort"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></div></div><p class="results-count" id="results-count" aria-live="polite"></p><div class="product-grid shop-grid" id="shop-grid"></div></section>`;
}

export function refreshShopGrid() {
  const grid = document.querySelector("#shop-grid");
  const count = document.querySelector("#results-count");
  if (!grid || !count) return;
  let matching = products.filter((product) => {
    const categoryMatch = activeCategory === "All objects" || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(activeSearch.toLowerCase());
    return categoryMatch && searchMatch;
  });
  if (activeSort === "price-low") matching.sort((a, b) => a.price - b.price);
  if (activeSort === "price-high") matching.sort((a, b) => b.price - a.price);
  if (activeSort === "name") matching.sort((a, b) => a.name.localeCompare(b.name));
  count.textContent = `${matching.length} ${matching.length === 1 ? "object" : "objects"}`;
  grid.innerHTML = matching.length ? matching.map(card).join("") : `<div class="no-results"><span aria-hidden="true">⌕</span><h2>No objects found.</h2><p>Try a different search or category.</p></div>`;
}

export function setShopCategory(category) {
  if (!categories.includes(category)) return;
  activeCategory = category;
  document.querySelectorAll("[data-action='category']").forEach((button) => {
    const selected = button.dataset.category === category;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  refreshShopGrid();
}

export function setShopSearch(value) { activeSearch = value; refreshShopGrid(); }
export function setShopSort(value) { activeSort = value; refreshShopGrid(); }

export function renderProduct(id) {
  const product = getProduct(id);
  if (!product) return renderNotFound();
  const favorite = isFavorite(product.id);
  return `<section class="detail-page"><a class="back-link" href="/shop" data-route="/shop">← Back to all objects</a><div class="product-detail-grid"><div class="detail-image"><img src="${product.image}" alt="${escapeHTML(product.alt)}" fetchpriority="high"></div><div class="detail-copy"><p class="eyebrow">${escapeHTML(product.category)} · ${escapeHTML(product.tag || "MORROW OBJECT")}</p><h1>${escapeHTML(product.name)}</h1><p class="detail-price">${formatPrice(product.price)}</p><p class="detail-description">${escapeHTML(product.description)}</p><div class="detail-facts"><div><span>COLOUR</span><strong>${escapeHTML(product.color)}</strong></div><div><span>MATERIAL</span><strong>${escapeHTML(product.material)}</strong></div></div><div class="detail-actions"><label for="detail-quantity">Quantity</label><input id="detail-quantity" type="number" min="1" max="99" value="1"><button class="button button-dark" type="button" data-action="add" data-id="${product.id}">Add to bag <span aria-hidden="true">↗</span></button></div><button class="detail-favorite" type="button" data-action="favorite" data-id="${product.id}" aria-pressed="${favorite}">${favorite ? "♥ Saved to your list" : "♡ Save for later"}</button><p class="shipping-note">Complimentary delivery on orders over ₹3,000.</p></div></div><section class="detail-note"><p class="eyebrow">A LITTLE ABOUT THIS ONE</p><p>${escapeHTML(product.description)}</p><span>Made thoughtfully. Chosen to last.</span></section></section>`;
}

export function renderCart() {
  const items = getCartItems(products);
  if (!items.length) return `<section class="empty-cart"><span class="empty-bag" aria-hidden="true">♧</span><p class="eyebrow">YOUR BAG</p><h1>A little room<br>for something <em>good.</em></h1><p>Your bag is taking a quiet moment. Find something that feels like you.</p><a class="button button-dark" href="/shop" data-route="/shop">Explore the collection <span aria-hidden="true">↗</span></a></section>`;
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= 3000 ? 0 : 180;
  const lines = items.map((item) => `<article class="cart-item" data-id="${item.id}"><a class="cart-item-image" href="/product/${item.id}" data-route="/product/${item.id}"><img src="${item.image}" alt="${escapeHTML(item.alt)}" loading="lazy"></a><div class="cart-item-info"><p class="product-category">${escapeHTML(item.category)}</p><a class="product-name" href="/product/${item.id}" data-route="/product/${item.id}">${escapeHTML(item.name)}</a><p class="cart-item-price">${formatPrice(item.price)}</p><div class="quantity-control" aria-label="Quantity for ${escapeHTML(item.name)}"><button type="button" data-action="quantity" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-action="quantity" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div class="cart-line-total"><strong>${formatPrice(item.lineTotal)}</strong><button class="remove-link" type="button" data-action="remove" data-id="${item.id}">Remove</button></div></article>`).join("");
  return `<section class="cart-page"><div class="section-title"><div><p class="eyebrow">YOUR PICKS</p><h1>Your bag<span class="brand-dot">.</span></h1></div><a class="text-link" href="/shop" data-route="/shop">Continue browsing <span aria-hidden="true">↗</span></a></div><div class="cart-layout"><div class="cart-items">${lines}</div><aside class="order-summary"><p class="eyebrow">THE DETAILS</p><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div><div class="summary-line"><span>Delivery</span><strong>${shipping === 0 ? "Complimentary" : formatPrice(shipping)}</strong></div>${subtotal < 3000 ? `<p class="shipping-progress">Add ${formatPrice(3000 - subtotal)} more for complimentary delivery.</p>` : `<p class="shipping-progress shipping-unlocked">Complimentary delivery unlocked ✳</p>`}<div class="summary-total"><span>Total</span><strong>${formatPrice(subtotal + shipping)}</strong></div><button class="button button-dark checkout-button" type="button" data-action="checkout">Continue to checkout <span aria-hidden="true">↗</span></button><p class="checkout-note">Demo checkout · no payment will be collected.</p></aside></div></section>`;
}

export function renderAbout() {
  return `<section class="about-page"><p class="eyebrow">A NOTE ON THE WAY WE LIVE</p><h1>Keep what feels<br><em>like home.</em></h1><div class="about-grid"><p>We started Morrow with one small idea: the things we use every day deserve a little more care. Not more things. Better chosen ones.</p><div><p>Our collection brings together useful forms, honest materials, and thoughtful makers. Every object is selected to earn its place, feel good in your hands, and stay with you through the ordinary days.</p><p>We believe good design can be quiet. It can be a lamp that makes a corner softer, a mug that turns five minutes into a ritual, or a notebook that gives a thought somewhere to land.</p><a class="text-link" href="/shop" data-route="/shop">Find your everyday <span aria-hidden="true">↗</span></a></div></div><div class="about-values"><div><span>01</span><h2>Made thoughtfully</h2><p>Materials with purpose, selected for feel and longevity.</p></div><div><span>02</span><h2>Chosen to last</h2><p>Useful shapes, made for real homes and everyday rituals.</p></div><div><span>03</span><h2>Room to breathe</h2><p>A considered collection. No rush to fill every shelf.</p></div></div></section>`;
}

export function renderNotFound() {
  return `<section class="empty-cart"><p class="eyebrow">A WRONG TURN</p><h1>That page<br>has wandered <em>off.</em></h1><p>Let's bring you back to something familiar.</p><a class="button button-dark" href="/" data-route="/">Back home <span aria-hidden="true">↗</span></a></section>`;
}

