import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// あなたのFirebaseプロジェクトの設定情報
// ※この情報はFirebaseコンソールからコピーできます
const firebaseConfig = {
	apiKey: "AIzaSyBtW_witMwgoMD-ULmeM5b0RVkd1iQnEcg",
	authDomain: "maimai-a1302.firebaseapp.com",
	projectId: "maimai-a1302",
	storageBucket: "maimai-a1302.firebasestorage.app",
	messagingSenderId: "823024798025",
	appId: "1:823024798025:web:bff7cfed9cca63dfe63298",
	measurementId: "G-9HXB7Q48K5",
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// 各サービスへの参照を取得
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
