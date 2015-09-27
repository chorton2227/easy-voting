// Require dependencies
var notifications   = require('sdk/notifications');
var self            = require('sdk/self');
var simple_prefs    = require('sdk/simple-prefs');
var simple_storage  = require('sdk/simple-storage');
var tabs            = require('sdk/tabs');
var { setInterval } = require('sdk/timers');
var buttons         = require('sdk/ui/button/action');

// Setup variables in add-on scope
if (typeof simple_storage.storage.last_vote_date === "undefined") {
	simple_storage.storage.last_vote_date = new Date(-8640000000000000);
}

if (typeof simple_storage.storage.last_notification_date === "undefined") {
	simple_storage.storage.last_notification_date = new Date(-8640000000000000);
}

// Setup vote now button
var button = buttons.ActionButton({
	id: 'vote-button',
	label: 'Vote Now',
	icon: {
		'16': './icon-16.png',
		'32': './icon-32.png',
		'64': './icon-64.png'
	},
	onClick: function(state) {
		// Check if the account name is correct
		var accountName = simple_prefs.prefs.accountName;
		if (accountName === "" || accountName === "Enter your account name") {
			tabs.activeTab.attach({
				contentScript: 'alert("You must first configure your account name through the Add-ons Manager before you can vote.")'
			});			
			return;
		}

		// Checks if the script has already been run
		var hasRun = false;

		// Open the vote page in a new tab
		tabs.open({
			url: 'http://extalia.net/vote',
			onReady: function(tab) {
				// Only run the vote script once
				if (!hasRun) {
					// Run vote script on vote page
					tab.attach({
						contentScriptFile: self.data.url('vote.js'),
						contentScriptOptions: {
							accountName: accountName
						}
					});

					// Update the last vote date
					simple_storage.storage.last_vote_date = new Date();

					// The script has been run, set variable to true
					hasRun = true;
				}
			}
		});
	}
});

// Setup timer, check if it is time to vote every minute
setInterval(function() {
	// If you can NOT vote, stop here
	if (!canVote()) {
		return;
	}

	// If you can NOT notify, stop here
	if (!canNotify()) {
		return;
	}

	// Notify the user that they can now vote
	notifications.notify({
		title: 'Vote Now',
		text: 'You can vote again!'
	});

	// Update the last notification date
	simple_storage.storage.last_notification_date = new Date();
}, 10000);

// Check if the user can vote
function canVote() {
	var now = new Date();
	var last_vote_date_time_diff = Math.abs(now.getTime() - simple_storage.storage.last_vote_date.getTime());
	var last_vote_date_time_diff_hours = Math.ceil(last_vote_date_time_diff / (1000 * 3600));

	if (last_vote_date_time_diff_hours >= 6) {
		return true;
	}

	return false;
}

// Check if you can notify the user
function canNotify() {
	var now = new Date();
	var last_notification_date_time_diff = Math.abs(now.getTime() - simple_storage.storage.last_notification_date.getTime());
	var last_notification_date_time_diff_minutes = Math.ceil(last_notification_date_time_diff / (1000 * 60));

	if (last_notification_date_time_diff_minutes > 1) {
		return true;
	}

	return false;
}