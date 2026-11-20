export function routeFor(path = window.location.pathname) {
  const cleanPath = decodeURIComponent(path.replace(/\/+$/, "") || "/");
  if (cleanPath === "/") return { name: "home" };
  if (cleanPath === "/shop") return { name: "shop" };
  if (cleanPath === "/cart") return { name: "cart" };
  if (cleanPath === "/about") return { name: "about" };
  const productMatch = cleanPath.match(/^\/product\/([^/]+)$/);
  if (productMatch) return { name: "product", id: productMatch[1] };
  return { name: "not-found" };
}

export function navigate(path) {
  if (!path || path === window.location.pathname) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
