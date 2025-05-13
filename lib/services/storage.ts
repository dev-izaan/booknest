import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadString
} from 'firebase/storage';
import { storage } from '../firebase';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Upload a file to a specific path with size validation
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file size for free tier optimization
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size of 5MB`);
    }

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error.message || 'Unknown error'}`);
  }
};

// Upload a compressed image (for better free tier usage)
export const uploadCompressedImage = async (file: File, path: string, maxWidth = 1200): Promise<string> => {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size of 5MB`);
    }

    // Only compress if it's an image
    if (!file.type.startsWith('image/')) {
      return uploadFile(file, path);
    }

    // Compress the image
    const compressedFile = await compressImage(file, maxWidth);
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading compressed image:", error);
    throw new Error(`Failed to upload compressed image: ${error.message || 'Unknown error'}`);
  }
};

// Helper function to compress an image
const compressImage = (file: File, maxWidth: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions if needed
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Get the compressed image as a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          0.8 // 80% quality
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

// Get a download URL for a file
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    console.error("Error getting file URL:", error);
    throw new Error(`Failed to get file URL: ${error.message || 'Unknown error'}`);
  }
};

// Delete a file
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    console.error("Error deleting file:", error);
    throw new Error(`Failed to delete file: ${error.message || 'Unknown error'}`);
  }
};

// Generate a unique file path with user folder and timestamp
export const generateFilePath = (userId: string, fileName: string): string => {
  const timestamp = new Date().getTime();
  const extension = fileName.split('.').pop();
  return `uploads/${userId}/${timestamp}.${extension}`;
};

// Get storage usage stats for monitoring free tier limits
export const getStorageUsageInfo = async (): Promise<void> => {
  // Note: Firebase doesn't have a direct way to get storage usage stats in the client-side SDK
  // For a production app, you would implement this using Firebase Admin SDK in a backend service
  console.warn("Storage usage monitoring requires Firebase Admin SDK in a backend service");
};

export { storage, ref, MAX_FILE_SIZE };
export default storage; 