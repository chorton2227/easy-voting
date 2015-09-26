// Require dependencies
var buttons = require('sdk/ui/button/action');
var simple_prefs = require('sdk/simple-prefs');
var tabs = require('sdk/tabs');
var self = require('sdk/self');

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

					// The script has been run, set variable to true
					hasRun = true;
				}
			}
		});
	}
});