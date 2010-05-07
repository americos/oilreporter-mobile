Titanium.include('../javascripts/application.js');

var win = Ti.UI.currentWindow;
var properties = Titanium.App.Properties;
var data = [];
var accountField;
var usernameField;
var passwordField;

function buildRows() {
  data[0] = Ti.UI.createTableViewSection({headerTitle:'Twitter Information'});
	
	var userRow = Ti.UI.createTableViewRow({height:50});
	userRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	userRow.className = 'control';
	
	var usernameLabel = Ti.UI.createLabel({
  	color:'#444',
  	font:{fontSize:14, fontWeight:'normal'},
  	text:"Username",
  	top:16,
  	left:10,
  	width:100,
  	height:16,
  	textAlign:'left'
  });
  userRow.add(usernameLabel);
  
	usernameField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.getString("username") == null ? '' : properties.getString("username")),
		hintText:'Your Username',
		autocorrect:false,
		height:30,
		top:10,
		left:100,
		width:184,
  	font:{fontSize:14, fontWeight:'normal'},
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	userRow.add(usernameField);
	data[0].add(userRow);
	
	var passRow = Ti.UI.createTableViewRow({height:50});
	passRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	passRow.className = 'control';
	
	var passwordLabel = Ti.UI.createLabel({
  	color:'#444',
  	font:{fontSize:14, fontWeight:'normal'},
  	text:"Password",
  	top:16,
  	left:10,
  	width:100,
  	height:16,
  	textAlign:'left'
  });
  passRow.add(passwordLabel);
  
	passwordField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.getString("password") == null ? '' : properties.getString("password")),
		hintText:'Your Password',
		autocorrect:false,
		height:30,
		top:10,
		left:100,
		width:184,
		passwordMask:true,
  	font:{fontSize:14, fontWeight:'normal'},
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	passRow.add(passwordField);
	data[0].add(passRow);

  var versionRow = Ti.UI.createTableViewRow({height:40});
	versionRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	versionRow.className = 'version';
	
	var versionLabel = Ti.UI.createLabel({
  	color:'#666',
  	font:{fontSize:12, fontWeight:'normal'},
  	text:"version " + Titanium.App.getVersion(),
  	top:10,
  	left:0,
  	width:300,
  	height:16,
  	textAlign:'center'
  });
  versionRow.add(versionLabel);
	data[0].add(versionRow);
	
}

buildRows();

// create table view data object
var tableView = Ti.UI.createTableView({
	data:data, 	
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(tableView);

function storeValidCredentials(username, password) {
 properties.setString('twitUsername',username);
 properties.setString('twitPassword',password);

 var alert = Titanium.UI.createAlertDialog({
 	title:'Saved!',
 	message:'Your Twitter credentials have been saved.  You are now able to reply and share tweets.  Do you want to see our latest #'+ TWITTER_ACCOUNT +' updates?'
 });
 alert.buttonNames = ['Yes', 'No'];
	alert.addEventListener("click",function(e) {
	  if(e.index == 0) {
	    Titanium.UI.currentTabGroup.tabs[2].active = true;
	  }
	});
	alert.show(); 
}

var saveButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.SAVE});
saveButton.addEventListener('click',function(){
 if(isBlank(usernameField.value) || isBlank(passwordField.value)) {
   var errorAlert = Titanium.UI.createAlertDialog({title:'Oops!'});
   errorAlert.setMessage("You must add in all of your Twitter account information before you can save your information.");
   errorAlert.show();
 } else {
  Titanium.App.fireEvent("show_indicator",{title:'Authenticating'});
  var url = "http://"+usernameField.value+":"+passwordField.value+"@twitter.com/statuses/friends_timeline.xml";
	var xhr = Ti.Network.createHTTPClient();
    Ti.API.info(url);
	xhr.open("GET",url);
	xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        Ti.API.info('Authentication request status is ' + this.status);
        Titanium.App.fireEvent("hide_indicator");
        if(this.status == 200) {
		  storeValidCredentials(usernameField.value, passwordField.value);
        } else if(this.status == 401) {
			var errorAlert = Titanium.UI.createAlertDialog({title:'Oops!'});
			errorAlert.setMessage("Twitter says your username and password are not valid. Please try re-entering them.");
			errorAlert.show();
        } else {
			var errorAlert = Titanium.UI.createAlertDialog({title:'Oops!'});
			errorAlert.setMessage("Twitter encountered an unknown error while authenticating. Please try again.");
			errorAlert.show();
        }
	  }
	};
	xhr.send();
 }
});
win.setRightNavButton(saveButton);
