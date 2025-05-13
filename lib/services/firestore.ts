// Import the functions you need from the SDKs you need
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Get a document from a collection
export const getDocument = async (collectionName: string, documentId: string) => {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Alias for getDocument for backward compatibility
export const getDocumentById = async (collectionName: string, documentId: string) => {
  return getDocument(collectionName, documentId);
};

// Set a document in a collection
export const setDocument = async (collectionName: string, documentId: string, data: any) => {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, data);
  return documentId;
};

// Update a document in a collection
export const updateDocument = async (collectionName: string, documentId: string, data: any) => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data);
  return documentId;
};

// Delete a document from a collection
export const deleteDocument = async (collectionName: string, documentId: string) => {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
  return documentId;
};

// Get all documents from a collection
export const getCollection = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Query a collection
export const queryCollection = async (
  collectionName: string, 
  conditions: Array<{ field: string, operator: any, value: any }>,
  sortBy?: { field: string, direction: 'asc' | 'desc' },
  limitTo?: number
) => {
  const collectionRef = collection(db, collectionName);
  
  // Build the query
  let q = query(collectionRef);
  
  // Add where conditions
  if (conditions && conditions.length > 0) {
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
  }
  
  // Add sorting
  if (sortBy) {
    q = query(q, orderBy(sortBy.field, sortBy.direction));
  }
  
  // Add limit
  if (limitTo) {
    q = query(q, limit(limitTo));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export default db;