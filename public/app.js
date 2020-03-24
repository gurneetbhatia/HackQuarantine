(function() {
	/*const firebaseConfig = {
	apiKey: "AIzaSyCleBofgyhYWDkI6o9fz1lF_wZnlpIlnuc",
	authDomain: "hq-app-8cc14.firebaseapp.com",
	databaseURL: "https://hq-app-8cc14.firebaseio.com",
	projectId: "hq-app-8cc14",
	storageBucket: "hq-app-8cc14.appspot.com",
	messagingSenderId: "564633742909",
	appId: "1:564633742909:web:d4cf905814484078a70454",
	measurementId: "G-LVC5S42ELF"
	};
	firebase.initializeApp(firebaseConfig);*/

	console.log('here');
	const preObject = document.getElementById('object');
	const dbRefObject = firebase.database().ref().child('object');
	dbRefObject.on('value', snap => console.log(snap.val()));

})();