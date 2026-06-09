importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: "AIzaSyCbQIr7stKtowtx1X7jz1eShM6heoAemCI",
  authDomain: "footballlive-3cc97.firebaseapp.com",
  projectId: "footballlive-3cc97",
  storageBucket: "footballlive-3cc97.firebasestorage.app",
  messagingSenderId: "259772515101",
  appId: "1:259772515101:web:c6076c24ea18319b1997f4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
