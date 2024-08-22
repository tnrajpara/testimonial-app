// public/embed-loader.js
var DOMAIN =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://your-production-domain.com";

function loadTestimonials(elementId, spaceId, options = {}) {
  var iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "800px";
  iframe.style.border = "none";

  var src = `${DOMAIN}/embed/${spaceId}`;

  iframe.src = src;

  document.getElementById(elementId).appendChild(iframe);
}

window.loadTestimonials = loadTestimonials;
