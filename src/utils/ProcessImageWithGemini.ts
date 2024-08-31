import {
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * Function to upload an image to Gemini API, and return the value contained on it.
 * @param {string} imagePath - Path of saved image inside the application.
 * @returns {Promise<{ tempUrl: string, imagePath: string }>} - A promise that resolves to the value contained inside the uploaded image.
 */

const extractValueFromImage = async (imagePath: string): Promise<string> => {
  try {
    const fileManager = new GoogleAIFileManager(
      process.env.GEMINI_API_KEY as string
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const uploadResponse: UploadFileResponse = await fileManager.uploadFile(
      imagePath,
      {
        mimeType: "image/png",
        displayName: "image",
      }
    );

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: "Read the number that image shows. It might be a water or gas meter. Also, you must answer only the number read, nothing more",
      },
    ]);

    return result.response.text();
  } catch (error) {
    throw error;
  }
};

export default extractValueFromImage;
