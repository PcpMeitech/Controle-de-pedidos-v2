import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // ← linha que faltava

const firebaseConfig = {
  apiKey: "AIzaSyCYmLArXKWXqwTNYwXeV5Q48NJagS3AmhA",
  authDomain: "controle-de-pedidos-aebe3.firebaseapp.com",
  databaseURL: "https://controle-de-pedidos-aebe3-default-rtdb.firebaseio.com",
  projectId: "controle-de-pedidos-aebe3",
  storageBucket: "controle-de-pedidos-aebe3.firebasestorage.app",
  messagingSenderId: "863403131373",
  appId: "1:863403131373:web:09f4dc5277c20fc6e9e7e4",
  measurementId: "G-235VEGBH92"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // ← linha que faltava