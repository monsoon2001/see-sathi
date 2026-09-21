export const firebaseConfig = {
  apiKey: "AIzaSyAx_o_15KKSZGSyNFF3R6PcTayXViH2UvM",
  authDomain: "learning-832c9.firebaseapp.com",
  projectId: "learning-832c9",
  storageBucket: "learning-832c9.firebasestorage.app",
  messagingSenderId: "369679619426",
  appId: "1:369679619426:web:95b8eb31e04b102cdc483b",
  measurementId: "G-53ZMM394Q4",
} as const;

export const FIREBASE_API_KEY = firebaseConfig.apiKey;

export const FIRESTORE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;