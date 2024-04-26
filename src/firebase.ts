import {initializeApp} from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_WEB_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);

export default app;