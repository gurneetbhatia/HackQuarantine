const functions = require('firebase-functions');
const firebase = require("firebase");
const express = require('express');
const spawn = require("child_process").spawn;
const fs = require('fs');
const https = require('https');
const uuid_gen = require('uuid');
var app = express();
// Required for side-effects
require("firebase/firestore");
require("firebase/functions");
var admin = require("firebase-admin");
const cors = require('cors');
app.use(cors({ origin: true }));
app.use(express.urlencoded());
app.use(express.json());


var serviceAccount = require("./admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hq-app-8cc14.firebaseio.com"
});

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
//app.use(cors({ origin: true }));
/*app.post('/register', function(request, response) {
	console.log(request.body);
	getUniqueUserID().then(function(output) {
		var userid = output;
		createUser(userid, "07464", "G", "Bhatia", "sbgurneet@gmail.com", "test", "novice", false);
	});
});*/

exports.getPopularTimes = functions.https.onCall((data, context) => {
	var pythonProcess = spawn('python3',["testing.py", data.lat, data.lng, data.radius]);
	return pythonProcess.stdout.on('data', (data1) => {
		//let rawdata = fs.readFileSync('result.json');
		//let json = JSON.parse(rawdata);
		return "done";
	}).catch(error => {
		return error;
	})
})

exports.getNotificationsForUser = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/' + data.uid + '/notifications').once("value").then(function(snapshot) {
		return snapshot.val();
	}).catch(function(error) {
		return error;
	})
})

exports.getReservationsForUser = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/' + data.uid + '/reservations').once("value").then(function(snapshot) {
		return snapshot.val();
	}).catch(function(error) {
		return error;
	})
})

exports.checkIfUserUnique = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/').once("value").then(function(snapshot) {
	    let snapData = snapshot.val();
	    values = Object.values(snapData);
	    var usernames = [];
	    for (var i=0;i<values.length;i++) {
	    	usernames.push(values[i].username);
	    }
	    return !usernames.includes(data.username);
	}).catch(function(error) {
		return error;
	});
});

exports.register = functions.https.onCall((data, context) => {
	getUniqueUserID().then(function(output) {
		var userid = output;
		/*firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		.then(function() {
			createUser(data.userid, data.username, data.email, data.phone);
			firebase.auth().signInWithEmailAndPassword(data.email, data.password);
		})
		.catch(function(error) {
			// Handle Errors here.
			console.log(error);
		});*/
		createUser(data.userid, data.username, data.email, data.phone);

		// response.set('Access-Control-Allow-Origin', '*');
		// response.status(500).send({test: 'Testing functions'});
		// createUser(userid, "07464", "G", "Bhatia", "sbgurneet@gmail.com", "test", "novice", false);
	});
});

exports.updateRegistrationInfo = functions.https.onCall((data, context) => {
	let uid = data.uid;
	data.uid = null;
	return updateUser(uid, data);
})

exports.newReservation = functions.https.onCall((data, context) => {
	let uid = data.uid;
	var oldPostRef = firebase.database().ref().child('users/'+uid+'/reservations');
	let reservation = {lat: data.lat,
		lng: data.lng,
		address: data.address,
		time: data.datetime};
	var newPostRef = oldPostRef.push();
	return newPostRef.set(reservation);

});

/*app.get('/:placeid', (req, res) => {
	let api_key = "AIzaSyAOrlWQqx5juI-PXFT-5A-Xzgw7lC74pAo";
	let placeid = req.params.placeid;
	let query = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeid+"&key="+api_key+"&fields=geometry";
	https.get(query, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			res.send(data);
		})
	})
})

app.get('/:lat/:lng/:string', (req, res) =>  {
	let api_key = "AIzaSyAOrlWQqx5juI-PXFT-5A-Xzgw7lC74pAo";
	let string = req.params.string;
	let lat = req.params.lat;
	let lng = req.params.lng
	let query =  "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+string+"&key="+api_key+"&location="+lat+","+lng+"&origin="+lat+","+lng+"&types=establishment";
	https.get(query, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			res.send(data);
		})
	})
	//res.send(req.params.id+req.params.id2)
});*/

app.get('/:address', (req, res) => {
	let address = req.params.address;
	let query = "https://bgurneet.pythonanywhere.com/api/v2/getbusytimes?address="+address;
	https.get(query, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			res.send(data);
		})
	})
})
exports.getAutocompleteResults = functions.https.onRequest(app);

exports.checkRegistrationStatus = functions.https.onCall((data, context) => {
	let uid = data.uid;
	return firebase.database().ref('/users/'+uid).once("value").then(function(snapshot) {
		let values = snapshot.val();
		return values.regCompleted;
    	//userids = Object.keys(snapshot.val());
	});
})

exports.updateSettingsData = functions.https.onCall((data, context) => {
	let uid = data.uid;
	var newPostKey = firebase.database().ref().child('users').push().key;
	updates = {};
	updates['/users/' + uid + '/helper'] = data.helper;
	updates['/users/' + uid + '/radius'] = data.radius;
	updates['/users/' + uid + '/medConditons'] = data.medConditions; // made a typo when entering into db now it shall continue for eternity
	return firebase.database().ref().update(updates);
})

exports.sendFriendRequest = functions.https.onCall((data, context) => {
	let friendEmail = data.friendEmail;
	let userEmail = data.userEmail;
	let userUID = data.uid;
	getAllUserIDs().then(userids => {
		firebase.database().ref('/users').once('value').then(function(snapshot) {
			let database = snapshot.val();
			userids.forEach(userid => {
				if(database[userid].email == friendEmail) {
					// add a friend request from this user
					// send email, and the user's uid in the friend request
					var oldPostRef = firebase.database().ref().child('users/'+userid+'/friendRequests');
					var friendRequest = {email: userEmail, uid: userUID};
					var newPostRef = oldPostRef.push();
					newPostRef.set(friendRequest);
				}

			})
		})
	})
})

exports.getSettingsData = functions.https.onCall((data, context) => {
	let uid = data.uid;
	return firebase.database().ref('/users/'+uid).once("value").then(function(snapshot) {
		let values = snapshot.val();
		settings = {medConditions: values.medConditons,
			radius: values.radius,
			helper: values.helper};
		return settings;
	})
})

exports.setEmailValid = functions.https.onCall((data, context) => {
    return admin.auth().updateUser(data.userid, {emailVerified: true}).then(function(output) {
    	return true;
    })
  });

function updateUser(uid, data) {
	var newPostKey = firebase.database().ref().child('users').push().key;
	updates = {};
	updates['/users/' + uid + '/firstName'] = data.firstName;
	updates['/users/' + uid + '/lastName'] = data.lastName;
	updates['/users/' + uid + '/age'] = data.age;
	updates['/users/' + uid + '/phone'] = data.phone;
	updates['/users/' + uid + '/medConditons'] = data.medConditions;
	updates['/users/' + uid + '/helper'] = data.helper;
	updates['/users/' + uid + '/radius'] = data.radius;
	updates['/users/' + uid + '/regCompleted'] = true;
	return firebase.database().ref().update(updates);
}

async function getUniqueUserID() {
	var userid = Math.floor(Math.random()*90000) + 10000;

	let userids = await getAllUserIDs();
	while((userids).includes(userid)) {
		console.log('here')
		userid = Math.floor(Math.random()*90000) + 10000;
	}
	return userid;
}

function getAllUserIDs() {
	var userids = {}
	return firebase.database().ref('/users/').once("value").then(function(snapshot) {
		let values = snapshot.val();
		userids = (values) ? Object.keys(snapshot.val()) : [];
		return userids;
    	//userids = Object.keys(snapshot.val());
	});
	//return userids;
}

function createUser(userid, username, email, phone) {
	firebase.database().ref('users/' + userid).set({
		username: username,
		email: email,
		phone: phone,
		regCompleted: false
	})
}
