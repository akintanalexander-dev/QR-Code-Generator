import express from "express";
import qr from "qr-image";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/qr", (request, response) => {
  const value = request.query.url;

  if (typeof value !== "string" || !value.trim()) {
    return response.status(400).json({ error: "Enter a URL to generate a QR code." });
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported protocol");
    }

    response.type("png");
    return qr.image(value, { type: "png", size: 10, margin: 2 }).pipe(response);
  } catch {
    return response.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }
});

app.listen(port, () => {
  console.log(`QR Code Generator is running at http://localhost:${port}`);
});