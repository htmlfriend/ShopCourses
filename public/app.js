document.querySelectorAll(".price").forEach((node) => {
  node.textContent = new Intl.NumberFormat("fr-FR", {
    currency: "USD",
    style: "currency",
  }).format(node.textContent);
});
