if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
var firebaseConfig = {
  "projectId": "hq-app-8cc14",
  "appId": "1:564633742909:web:d4cf905814484078a70454",
  "databaseURL": "https://hq-app-8cc14.firebaseio.com",
  "storageBucket": "hq-app-8cc14.appspot.com",
  "locationId": "us-central",
  "apiKey": "AIzaSyCleBofgyhYWDkI6o9fz1lF_wZnlpIlnuc",
  "authDomain": "hq-app-8cc14.firebaseapp.com",
  "messagingSenderId": "564633742909",
  "measurementId": "G-LVC5S42ELF"
};
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
}
