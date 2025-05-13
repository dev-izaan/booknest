import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import app from '../firebase';

// Initialize Firebase Storage
const storage = getStorage(app);

// Upload a file to a specific path
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

// Get a download URL for a file
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw error;
  }
};

// Delete a file
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    throw error;
  }
};

// Generate a unique file path
export const generateFilePath = (userId: string, fileName: string): string => {
  const timestamp = new Date().getTime();
  const extension = fileName.split('.').pop();
  return `uploads/${userId}/${timestamp}.${extension}`;
};

export { storage, ref };
export default storage; 