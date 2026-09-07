const form = document.querySelector("#qr-form");
const input = document.querySelector("#url-input");
const message = document.querySelector("#form-message");
const placeholder = document.querySelector(".result-placeholder");
const content = document.querySelector(".result-content");
const image = document.querySelector("#qr-image");
const resultUrl = document.querySelector("#result-url");
const downloadLink = document.querySelector("#download-link");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const url = input.value.trim();
  const requestUrl = `/api/qr?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(requestUrl);

    if (!response.ok) {
      const responseType = response.headers.get("content-type") || "";

      if (responseType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.error || "Unable to generate the QR code.");
      }

      const errorText = await response.text();
      throw new Error(errorText || `The QR service returned HTTP ${response.status}.`);
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    image.src = imageUrl;
    downloadLink.href = imageUrl;
    resultUrl.textContent = url;
    placeholder.hidden = true;
    content.hidden = false;
  } catch (error) {
    message.textContent = error.message || "Unable to generate the QR code.";
    placeholder.hidden = false;
    content.hidden = true;
  }
});
