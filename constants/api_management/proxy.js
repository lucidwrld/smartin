import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL query parameter is required");
  }

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"];
    res.send(`data:${mimeType};base64,${base64}`);
  } catch (error) {
    res.status(500).send("Error fetching the image");
  }
}
