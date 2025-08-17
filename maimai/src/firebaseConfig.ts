import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// あなたのFirebaseプロジェクトの設定情報
// ※この情報はFirebaseコンソールからコピーできます
const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// 各サービスへの参照を取得
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
