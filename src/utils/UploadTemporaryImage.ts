import fs from "fs";
import path from "path";

/**
 * Function to upload an image, save it for 48 hours, and return a link to the uploaded image.
 * @param {string} image - Base64 encoded image string.
 * @returns {Promise<{ tempUrl: string, imagePath: string }>} - A promise that resolves to the temporary image URL and the absolute image path.
 */
export default function uploadTemporaryImage(
  image: string
): Promise<{ tempUrl: string; imagePath: string }> {
  return new Promise((resolve, reject) => {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      const uploadsDir = path.resolve(__dirname, "../uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const imageName = `image_${Date.now()}.png`;
      const imagePath = path.join(uploadsDir, imageName);

      fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
          return reject("Error saving image.");
        }

        const tempUrl = `/uploads/${imageName}`;

        setTimeout(() => {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting file:", unlinkErr);
            }
          });
        }, 48 * 60 * 60 * 1000); // 48 hours expiration

        resolve({ tempUrl, imagePath });
      });
    } catch (error) {
      reject("An error occurred during image processing.");
    }
  });
}
