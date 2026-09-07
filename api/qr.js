import qr from "qr-image";

export default function handler(request, response) {
  const value = request.query?.url;

  if (typeof value !== "string" || !value.trim()) {
    return response.status(400).json({ error: "Enter a URL to generate a QR code." });
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported protocol");
    }

    response.setHeader("Content-Type", "image/png");
    return qr.image(value, { type: "png", size: 10, margin: 2 }).pipe(response);
  } catch {
    return response.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }
}
