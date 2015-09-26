// Add account name
var account = document.getElementById('account').value = self.options.accountName;

// Get toplist dropdown list
var toplist = document.getElementById('toplist');

// Loop through each option in dropdown list and submit the voting form
for (var i = 1; i < toplist.length; i++) {
	setTimeout(function() {
		submitVotingForm();
	}, 1000 * i);
}

// Submit the voting form
function submitVotingForm()
{
	// Change selected option
	toplist.selectedIndex = toplist.selectedIndex + 1;

	// Submits the form
	document.forms[1].submit();
}