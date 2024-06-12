import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCBXqWA-Y9ts_Dc3EGtEtNnat5GsalFP4s",
	authDomain: "fir-course-74558.firebaseapp.com",
	projectId: "fir-course-74558",
	storageBucket: "fir-course-74558.appspot.com",
	messagingSenderId: "525960896067",
	appId: "1:525960896067:web:0ac4bc5cb3f2a50df0fef6",
	measurementId: "G-JY07T8NE0X",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
