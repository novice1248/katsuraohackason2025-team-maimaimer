import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
	apiKey: "AIzaSyDKVKL5JVwrWXLQP2IVV08AoMwzvHl_7m4",
	authDomain: "maimai-a1302.firebaseapp.com",
	projectId: "maimai-a1302",
	storageBucket: "maimai-a1302.firebasestorage.app",
	messagingSenderId: "823024798025",
	appId: "1:823024798025:web:bff7cfed9cca63dfe63298",
	measurementId: "G-9HXB7Q48K5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const functions = getFunctions(app, 'asia-northeast1');
