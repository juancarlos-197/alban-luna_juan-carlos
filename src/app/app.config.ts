import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { getAnalytics } from "firebase/analytics";
import { routes } from './app.routes';


const firebaseConfig = {
  apiKey: "AIzaSyC0TbirIRydIs1oKhUylNsZSc9dlb8zIno",
  authDomain: "prueba-front-back.firebaseapp.com",
  projectId: "prueba-front-back",
  storageBucket: "prueba-front-back.firebasestorage.app",
  messagingSenderId: "936306782403",
  appId: "1:936306782403:web:3d32a198b5897877523276",
  measurementId: "G-MFF9YRLFCN"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
