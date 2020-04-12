declare -a data=('acceptGroceryListRequest' ' addItemToGroceryList' ' checkIfNotificationsPresent' ' checkIfUserUnique' ' checkRegistrationStatus' ' confirmFriendRequest' ' declineGroceryListRequest' ' deleteFriendRequest' ' getAcceptedGroceryList' ' getAllRequests' ' getAutocompleteResults' ' getFriends' ' getGroceryList' ' getHelperradius' ' getNotificationsForUser' ' getPopularTimes' ' getReservationsForUser' ' getSettingsData' ' getUserScore' ' newReservation' ' register' ' removeItemFromGroceryList' ' sendFriendRequest' ' setEmailValid' ' updateRegistrationInfo' ' updateSettingsData')
for value in ${data[@]};
do
	firebase deploy --only functions:$value
done
firebase deploy --except functions