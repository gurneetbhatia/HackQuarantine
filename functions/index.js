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

exports.getFriends = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/' + data.uid + '/friends').once('value').then(snapshot => {
		return snapshot.val();
	}).catch(error => {
		return error;
	})
})

exports.getUserScore = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/' + data.uid + '/score').once('value').then(snapshot => {
		return snapshot.val()
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

exports.getAllRequests = functions.https.onCall((data, context) => {
	return firebase.database().ref('/requests/').once('value').then(snap => {
		return snap.val();
	})
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

function getNotificationIdsForUser(uid) {
	return firebase.database().ref('/users/'+uid+'/notifications').once('value').then(result => {
		return Object.keys(result.val());
	})
}

exports.confirmFriendRequest = functions.https.onCall((data, context) => {
	let originUserUID = data.originUserUID;
	let userUID = data.userUID;
	// delete the notification first and then add 
	var newPostKey = firebase.database().ref().child('users').push().key;
	updates = {};
	updates['/users/'+userUID+'/friendRequests/'+originUserUID] = null;
	firebase.database().ref('/users/'+userUID+'/notifications').once('value').then(snapshot => {
		let database = snapshot.val();
		let keys = Object.keys(database);
		keys.forEach(key => {
			if (database[key].originUserUID == originUserUID) {
				updates['/users/'+userUID+'/notifications/'+key] = null;
			}
		})
		firebase.database().ref().update(updates);
	}).catch(error => {
		firebase.database().ref().update(updates);
	})
	// friend must have firstName, lastName, uid, and email address
	getUserData(userUID).then(userData => {
		var oldOriginRef = firebase.database().ref().child('/users/'+originUserUID+'/friends');
		var friend = userData;
		var newOriginRef = oldOriginRef.push();
		newOriginRef.set(friend);
	})

	getUserData(originUserUID).then(userData => {
		var oldOriginRef = firebase.database().ref().child('/users/'+userUID+'/friends');
		var friend = userData;
		var newOriginRef = oldOriginRef.push();
		newOriginRef.set(friend);
	})

})

exports.deleteFriendRequest = functions.https.onCall((data, context) => {
	let originUserUID = data.originUserUID;
	let userUID = data.userUID;
	var newPostKey = firebase.database().ref().child('users').push().key;
	updates = {};
	updates['/users/'+userUID+'/friendRequests/'+originUserUID] = null;
	firebase.database().ref('/users/'+userUID+'/notifications').once('value').then(snapshot => {
		let database = snapshot.val();
		console.log(database)
		let keys = Object.keys(database);
		keys.forEach(key => {
			if (database[key].originUserUID == originUserUID) {
				updates['/users/'+userUID+'/notifications/'+key] = null;
			}
		})
		firebase.database().ref().update(updates);
	}).catch(error => {
		firebase.database().ref().update(updates);
	})

})

exports.sendFriendRequest = functions.https.onCall((data, context) => {
	let friendEmail = data.friendEmail;
	let userEmail = data.userEmail;
	let userUID = data.uid;
	let date = data.date;
	getAllUserIDs().then(userids => {
		firebase.database().ref('/users').once('value').then(function(snapshot) {
			let database = snapshot.val();
			userids.forEach(userid => {
				if(database[userid].email == friendEmail) {
					// add a friend request from this user
					// send email, and the user's uid in the friend request
					var newPostKey = firebase.database().ref().child('users').push().key;
					updates = {};
					updates['users/'+userid+'/friendRequests/'+userUID] = userEmail;
					firebase.database().ref().update(updates);
					data.userid = userid;
					addNotification(data);
				}

			})
		})
	})
})

exports.getGroceryList = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/'+data.uid+'/groceryList').once('value').then(result => {
		return result.val();
	}).catch(function(error){
		return error;
	})
})

exports.getHelperradius = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/'+data.uid).once('value').then(result => {
		let data = result.val();
		return data.helper == "Yes" ? data.radius : null
	}).catch(error => {
		return error
	})
})

exports.addItemToGroceryList = functions.https.onCall((data, context) => {
	let uid = data.uid;
	let src = data.src;
	let txt = data.txt
	let lng = data.lng; // update the coordinates of the user
	let lat = data.lat;
	var updates = {};
	updates['requests/'+uid+'/lat'] = lat;
	updates['requests/'+uid+'/lng'] = lng;
	firebase.database().ref().update(updates);
	let oldPostRef = firebase.database().ref().child('users/'+uid+'/groceryList');
	var groceryListItem = {src: src, txt: txt};
	var newPostRef = oldPostRef.push();
	return newPostRef.set(groceryListItem);
})

exports.removeItemFromGroceryList = functions.https.onCall((data, context) => {
	let uid = data.uid;
	let src = data.src;
	let txt = data.txt;
	return firebase.database().ref('users/'+uid+'/groceryList').once("value").then(function(snapshot) {
		let data = snapshot.val();
		if(data){
			let keys = Object.keys(data);
			updates = {};
			if (keys.length == 1) {
				// remove from requests since the grocery list is empty
				updates['requests/'+uid] = null;
			}
			for(var i = 0; i<keys.length;i++) {
				let datapoint = data[keys[i]];
				if (datapoint.src == src && datapoint.txt == txt) {
					updates['/users/'+uid+'/groceryList/'+keys[i]] = null;
					break;
				}
			}
			firebase.database().ref().update(updates);
		}
	}).catch(error => {
		return error;
	})
})

function addNotification(data) {
	var oldPostRef = firebase.database().ref().child('users/'+data.userid+'/notifications');
	var notification = {title: "Friend Request",
	text: data.userEmail+' has sent you a friend request. Click here to accept it or delete it.',
	date: data.date,
	type: "friend-request",
	originUserUID: data.uid};
	var newPostRef = oldPostRef.push();
	newPostRef.set(notification);
}

function getUserData(uid) {
	return firebase.database().ref('/users/'+uid).once('value').then(snapshot => {
		let values = snapshot.val();
		let data = {uid: uid,
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email};
		return data;
	}).catch(error => {
		return error;
	})
}

exports.getSettingsData = functions.https.onCall((data, context) => {
	let uid = data.uid;
	return firebase.database().ref('/users/'+uid).once("value").then(function(snapshot) {
		let values = snapshot.val();
		settings = {medConditions: values.medConditons,
			radius: values.radius,
			helper: values.helper};
		return settings;
	}).catch(error => {
		return error;
	})
})

exports.setEmailValid = functions.https.onCall((data, context) => {
    return admin.auth().updateUser(data.userid, {emailVerified: true}).then(function(output) {
    	return true;
    }).catch(error => {
    	return error;
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

exports.checkIfNotificationsPresent = functions.https.onCall((data, context) => {
	let uid = data.uid;
	return firebase.database().ref('/users/' + uid + '/notifications').once("value").then(function(snapshot) {
		if (snapshot.val() == null) {
			return false;
		}
		else {
			return true;
		}
	}).catch(function(error){
		return error;
	})
})

exports.acceptGroceryListRequest = functions.https.onCall((data, context) => {
	let uid = data.uid;
	let key = data.key;
	sendAcceptGroceryListNotification(uid, key)
	var updates = {};
	updates['/users/'+uid+'/acceptedGroceryList/'+key] = 1;
	return firebase.database().ref().update(updates);
})

function getUserDeets(data) {
	let uid = data.uid;
	return firebase.database().ref('/users/'+uid).once("value").then(snapshot => {
		return snapshot.val();
	}).catch(error => {
		return error;
	})
}

function sendAcceptGroceryListNotification(userid, key) {
	getUserDeets({uid: key}).then(data => {
		var oldPostRef = firebase.database().ref().child('users/'+userid+'/notifications');
		let text = 'You have accepted to take groceries for '+data.firstName+' '+data.lastName+'. Please get in touch with them on their phone number: '+data.phone;
		var notification = {title: "Volunteering Groceries", 
		text: text,
		type: 'volunteer'};
		var newPostRef = oldPostRef.push();
		newPostRef.set(notification);
	})
	getUserDeets({uid: userid}).then(data => {
		var oldPostRef = firebase.database().ref().child('users/'+key+'/notifications');
		let text = data.firstName+' '+data.lastName+' has voluteered to bring your groceries for you. Please get in touch with them on their phone number: '+data.phone;
		var notification = {title: "Volunteering Groceries", 
		text: text,
		type: 'volunteer'};
		var newPostRef = oldPostRef.push();
		newPostRef.set(notification);
	})
}

exports.getAcceptedGroceryList = functions.https.onCall((data, context) => {
	let uid = data.uid;
	return firebase.database().ref('/users/'+uid+'/acceptedGroceryList/').once('value').then(result => {
		return result.val();
	}).catch(function(error){
		return error;
	})
})

exports.declineGroceryListRequest = functions.https.onCall((data, context) => {
	let uid = data.uid;
	let key = data.key;
	var updates = {};
	updates['/users/'+uid+'/acceptedGroceryList/'+key] = null;
	return firebase.database().ref().update(updates);
})