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
      const error = await response.json();
      throw new Error(error.error);
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
