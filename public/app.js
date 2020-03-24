(function() {
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

	/*const preObject = document.getElementById('object');
	const dbRefObject = firebase.database().ref().child('object');
	dbRefObject.on('value', snap => console.log(snap.val()));*/

	/*Things that we need to write to the database for each user:
	user_id (5 digit random and unique numeric value)
	first_name (string)
	last_name (string)
	email (string)
	password (string) -- should be hashed but idk how to do it here
	volunteer_level (string)
	at_risk (boolean)
	*/

	getUniqueUserID().then(function(output) {
		var userid = output;
		createUser(userid, "Gurneet", "Bhatia", "sbgurneet@gmail.com", "test", "novice", false);
	});


})();

async function getUniqueUserID() {
	var userid = Math.floor(Math.random()*90000) + 10000;

	let userids = await getAllUserIDs();
	while((userids).includes(userid)) {
		console.log('here')
		userid = Math.floor(Math.random()*90000) + 10000;
	}
	return userid;
}

async function getAllUserIDs() {
	var userids = {}
	await firebase.database().ref('/users/').once("value").then(function(snapshot) {
		let values = snapshot.val();
		userids = (values) ? Object.keys(snapshot.val()) : [];
    	//userids = Object.keys(snapshot.val());
	});
	return userids;
}

function createUser(userid, first_name, last_name, email, password, volunteer_level, at_risk) {
	firebase.database().ref('users/' + userid).set({
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
		volunteer_level: volunteer_level,
		at_risk: at_risk
	})
}