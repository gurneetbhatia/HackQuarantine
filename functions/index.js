const functions = require('firebase-functions');
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const firebaseConfig = {
  apiKey: "AIzaSyCleBofgyhYWDkI6o9fz1lF_wZnlpIlnuc",
  authDomain: "hq-app-8cc14.firebaseapp.com",
  databaseURL: "https://hq-app-8cc14.firebaseio.com",
  projectId: "hq-app-8cc14",
  storageBucket: "hq-app-8cc14.appspot.com",
  messagingSenderId: "564633742909",
  appId: "1:564633742909:web:d4cf905814484078a70454",
  measurementId: "G-LVC5S42ELF"
};
firebase.initializeApp(firebaseConfig);
/*var database = firebase.database();
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
});*/
//console.log('here1');
//firebase.analytics();

/*exports.dbTest = functions.https.onRequest((request, response) => {
	var database = firebase.database();
	var db = firebase.firestore();
	db.collection("users").add({
	    first_name: "Gurneet",
	    last_name: "Bhatia",
	    email: "sbgurneet@gmail.com",
	    at_risk: false,
	    password: "testpasswd",
	    volunteer_level: "novice"
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});

});*/



