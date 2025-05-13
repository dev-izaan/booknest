import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import app from '../firebase';

// Initialize Firestore
const db = getFirestore(app);

// Get a document by ID from a collection
export const getDocumentById = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Get all documents from a collection
export const getCollection = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Query documents from a collection with filters
export const queryDocuments = async (
  collectionName: string, 
  constraints: QueryConstraint[]
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Create or update a document
export const setDocument = async (
  collectionName: string, 
  docId: string, 
  data: DocumentData, 
  merge = true
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge });
    return docId;
  } catch (error) {
    throw error;
  }
};

// Update fields in a document
export const updateDocument = async (
  collectionName: string, 
  docId: string, 
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return docId;
  } catch (error) {
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
};

export { db, collection, doc, query, where, orderBy, limit };
export default db; 