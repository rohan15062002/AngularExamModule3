import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideFirebaseApp(() => initializeApp({"projectId":"productfirebase-e47a8","appId":"1:704291234380:web:611241a6b612ad83da4ae9","storageBucket":"productfirebase-e47a8.firebasestorage.app","apiKey":"AIzaSyCrN9xr-MtPpgTlZ1gOv_4UL7hx-bozOrw","authDomain":"productfirebase-e47a8.firebaseapp.com","messagingSenderId":"704291234380"})), 
     provideAuth(() => getAuth()), 
     provideFirestore(() => getFirestore()),
     provideHttpClient()
    ]
};
