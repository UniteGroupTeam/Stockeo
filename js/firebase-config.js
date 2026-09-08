import { initializeApp } from https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js;
import { getFirestore } from https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js;
import { getAuth, GoogleAuthProvider } from https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js;
import { getAnalytics } from https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js;

// ============================================================================
// CONFIGURACIÓN DE FIREBASE PARA STOCKEO MAYOREO
// Sustituye los valores siguientes por los de tu consola de Firebase:
// ============================================================================
export const firebaseConfig = {
  apiKey: TU_API_KEY_AQUI,
  authDomain: stockeo-mayoreo.firebaseapp.com,
  projectId: stockeo-mayoreo,
  storageBucket: stockeo-mayoreo.appspot.com,
  messagingSenderId: 1234567890,
  appId: 1:1234567890:web:abcdef123456,
  measurementId: G-STOCKEO
};

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== TU_API_KEY_AQUI;
};

let app = null, db = null, auth = null, provider = null, analytics = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn(Analytics no disponible:, e);
    }
    console.log(✅ [Firebase] Conectado exitosamente.);
  } catch (err) {
    console.error(❌ [Firebase] Error inicializando:, err);
  }
} else {
  console.log(ℹ️ [Firebase] Modo local activo. El catálogo operará con data/products.json hasta configurar credenciales.);
}

export { app, db, auth, provider, analytics };
export const ADMIN_EMAIL = 'lrodricg30@gmail.com';
