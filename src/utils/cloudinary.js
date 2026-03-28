import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    try {
        fs.unlinkSync(localFilePath); // remove local saved temporary file
    } catch(e) { console.error('Failed to softly delete file:', e) }
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    try {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
    } catch(e) { console.error('Failed to softly delete file on error:', e) }
    return null;
  }
};

export { uploadOnCloudinary };
