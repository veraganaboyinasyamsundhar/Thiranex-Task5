import amberCandle from "../assets/products/amber-candle.svg";
import stonewareMug from "../assets/products/stoneware-mug.svg";
import arcLamp from "../assets/products/arc-lamp.svg";
import terraPlanter from "../assets/products/terra-planter.svg";
import canvasTote from "../assets/products/canvas-tote.svg";
import linenJournal from "../assets/products/linen-journal.svg";
import ovalTray from "../assets/products/oval-tray.svg";
import wovenThrow from "../assets/products/woven-throw.svg";

export const products = [
  { id: "amber-candle", name: "Amber Hour Candle", category: "Rituals", price: 1490, image: amberCandle, alt: "Amber glass candle with a soft evening glow", color: "Sand / amber", material: "Coconut wax · hand-poured glass", description: "A warm, woodsy blend of cedar, bergamot, and a hint of fig. Poured in small batches for a slower, softer end to the day.", tag: "Bestseller", featured: true },
  { id: "stoneware-mug", name: "Sunday Stoneware Mug", category: "Home", price: 1180, image: stonewareMug, alt: "Hand-finished warm ivory stoneware mug", color: "Oat milk", material: "Wheel-thrown stoneware", description: "An easy, generous shape made for the first coffee and the second cup of tea. Each piece has its own subtle glaze variation.", tag: "Handmade", featured: true },
  { id: "arc-lamp", name: "Little Arc Table Lamp", category: "Home", price: 4250, image: arcLamp, alt: "Sculptural brass and golden yellow table lamp", color: "Brushed brass", material: "Powder-coated steel · warm LED", description: "A small pool of warm light for nightstands and reading corners. The curved shade directs a gentle glow exactly where you need it.", tag: "New", featured: true },
  { id: "terra-planter", name: "Terra Self-Water Planter", category: "Home", price: 1850, image: terraPlanter, alt: "Muted sage ceramic planter with leafy green plant", color: "Sage", material: "Reclaimed ceramic · cotton wick", description: "A considered home for your leafy friends. Its hidden reservoir keeps soil evenly moist without asking you to think about it.", tag: "Thoughtful design", featured: true },
  { id: "canvas-tote", name: "Everyday Canvas Tote", category: "Textile", price: 980, image: canvasTote, alt: "Terracotta canvas carryall tote with long handles", color: "Clay", material: "Recycled cotton canvas", description: "Room for the market flowers, the library book, and everything in between. A sturdy daily carry, made with recycled cotton.", tag: "Everyday essential", featured: false },
  { id: "linen-journal", name: "Field Notes Journal", category: "Paper", price: 650, image: linenJournal, alt: "Deep blue clothbound journal with cream pages", color: "Indigo", material: "Recycled paper · linen cloth cover", description: "A quiet place for big ideas, small lists, and thoughts worth keeping. Thread-bound with smooth, responsibly sourced paper.", tag: "Made to write", featured: false },
  { id: "oval-tray", name: "Solstice Catchall Tray", category: "Home", price: 1320, image: ovalTray, alt: "Hand-glazed oval sandstone tray with small objects", color: "Terracotta", material: "Stoneware · food-safe glaze", description: "A home for the little things that usually wander. Hand-finished stoneware, equally at home by the door or on a bedside table.", tag: "Hand-finished", featured: false },
  { id: "woven-throw", name: "Sunday Woven Throw", category: "Textile", price: 3690, image: wovenThrow, alt: "Olive and sage woven cotton throw blanket", color: "Olive grove", material: "Recycled cotton · hand-loomed", description: "A soft extra layer for slow mornings and open windows. Woven from recycled cotton with a subtle, tactile stripe.", tag: "Small batch", featured: false },
];

export const categories = ["All objects", "Home", "Rituals", "Paper", "Textile"];

export function getProduct(id) {
  return products.find((product) => product.id === id);
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}
