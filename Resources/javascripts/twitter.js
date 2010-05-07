Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/date_extensions.js');
Titanium.App.fireEvent('show_indicator',{});

var win = Titanium.UI.currentWindow;
var properties = Titanium.App.Properties;
var tableView;
var data = [];
var rowData = [];

function retweet(id,tweet) {
  Titanium.App.fireEvent("show_indicator",{title:'Retweeting'});
  var statusAlert;
  var url = "http://"+properties.getString("twitUsername")+":"+properties.getString("twitPassword")+"@api.twitter.com/1/statuses/retweet/"+id+".json";
	var xhr = Ti.Network.createHTTPClient();
  Ti.API.info(url);
	xhr.open("POST",url);
	xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      Titanium.App.fireEvent("hide_indicator");
      if(this.status == 200) {
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Success!',
        	message:'This tweet has been successfully retweeted from your account.'
        });
      } else if(this.status == 401) {
		Ti.API.info('401');
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Oops!',
        	message:'There seems to have been a problem with your username or password.'
        });
      } else {
		Ti.API.info('Other error');
		Ti.API.info('Status: ' + this.status);
		Ti.API.info(this.responseText);
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Oops!',
        	message:'Sorry, there was an issue trying to retweet this tweet.'
        });
      }
      statusAlert.show();
		}
	};
	xhr.send();
}

function emailTweet(id,tweet) {
	var emailDialog = Titanium.UI.createEmailDialog();
  emailDialog.setMessageBody(tweet +"\n\n" + "http://twitter.com/"+TWITTER_ACCOUNT);
  emailDialog.setSubject("I wanted to share a tweet with you");
  emailDialog.setBarColor(DEFAULT_BAR_COLOR);
  emailDialog.open();
}

function followOnTwitter() {
  Titanium.API.info('follow!');
  var id = 'foo';
  var tweet = 'bar';
  Titanium.App.fireEvent("show_indicator",{title:'Following'});
  var statusAlert;
  var url = "http://"+properties.getString("twitUsername")+":"+properties.getString("twitPassword")+"@api.twitter.com/1/friendships/create/"+TWITTER_ACCOUNT+".json";
	var xhr = Ti.Network.createHTTPClient();
  Ti.API.info(url);
	xhr.open("POST",url);
	xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      Titanium.App.fireEvent("hide_indicator");
      if(this.status == 200) {
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Success!',
        	message:'You are now following us on Twitter!'
        });
      } else if(this.status == 403) {
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Oops!',
        	message:'Twitter says you are already following this user.'
        });
      } else if(this.status == 401) {
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Oops!',
        	message:'There seems to have been a problem with your username or password.'
        });
      } else {
		Ti.API.info('Other error');
		Ti.API.info('Status: ' + this.status);
		Ti.API.info(this.responseText);
        statusAlert = Titanium.UI.createAlertDialog({
        	title:'Oops!',
        	message:'Sorry, there was an issue trying to follow this user.'
        });
      }
      statusAlert.show();
		}
	};
	xhr.send();
}

function presentOptionDialog(id, tweet) {
  if(tweet != null && id != null && !isBlank(properties.getString("twitUsername")) && !isBlank(properties.getString("twitPassword"))) {
    var dialog = Titanium.UI.createOptionDialog({
    	title:tweet
    });
    dialog.options = ["Retweet This","Share by E-Mail","Cancel"];
    dialog.cancel = 2;
    dialog.addEventListener("click",function(e){
      if(e.index == 0) {
        retweet(id,tweet);
      } else if(e.index == 1) {
        emailTweet(id,tweet);
      }
    });
    dialog.show();
  } else {
    var errorAlert = Titanium.UI.createAlertDialog({
    	title:'Oops!',
    	message:'You need to have your Twitter credentials saved before you can perform any actions on this tweet.  Would you like to do this?'
    });
    errorAlert.buttonNames = ['Yes', 'No'];
  	errorAlert.addEventListener("click",function(e) {
  	  if(e.index == 0) {
  	    Titanium.UI.currentTabGroup.tabs[4].active = true;
  	  }
  	});
  	errorAlert.show();
  }
}

function presentFollowOptionDialog() {
  if(!isBlank(properties.getString("twitUsername")) && !isBlank(properties.getString("twitPassword"))) {
    var followDialog = Titanium.UI.createOptionDialog({
    	title:'Follow on Twitter?'
    });
    followDialog.options = ["Follow","Cancel"];
    followDialog.cancel = 1;
    followDialog.addEventListener("click",function(e){
      if(e.index == 0) {
		followOnTwitter();
      }
    });
    followDialog.show();
  } else {
    var errorAlert = Titanium.UI.createAlertDialog({
    	title:'Oops!',
    	message:'You need to have your Twitter credentials saved before you can perform any actions on this tweet.  Would you like to do this?'
    });
    errorAlert.buttonNames = ['Yes', 'No'];
  	errorAlert.addEventListener("click",function(e) {
  	  if(e.index == 0) {
  	    Titanium.UI.currentTabGroup.tabs[4].active = true;
  	  }
  	});
  	errorAlert.show();
  }
}

function buildData(tweet) {
	var row = Ti.UI.createTableViewRow();
  row.height = 'auto';
  row.hasChild = false;
  row.className = 'twitter';
  row.tweetId = tweet.id;
  row.tweetText = tweet.text;
  
  var nameLabel = Ti.UI.createLabel({
   color:'#fff',
   font:{fontSize:13, fontWeight:'bold'},
   text:tweet.from_user,
   top:8,
   left:68,
   width:120,
   height:16,
   textAlign:'left'
  });
  row.add(nameLabel);
  
  var dateLabel = Ti.UI.createLabel({
   color:'#eee',
   font:{fontSize:10, fontWeight:'normal'},
   text:DateHelper.time_ago_in_words_with_parsing(tweet.created_at+""),
   top:8,
   left:198,
   width:110,
   height:16,
   textAlign:'right'
  });
  row.add(dateLabel);
  
  var avatarView = Ti.UI.createView({
  	top:10,
  	left:10,
  	width:48,
  	height:48,
  	borderRadius:4
  });
  
  var avatarImage = Ti.UI.createImageView({
    url:tweet.profile_image_url,
  	top:0,
  	left:0,
  	width:48,
  	height:48,
  	preventDefaultImage:true
  });
  
  avatarView.add(avatarImage);
  row.add(avatarView);
    
  var tweetLabel = Ti.UI.createLabel({
  	color:'#fff',
  	font:{fontSize:14, fontWeight:'normal'},
  	text:tweet.text+"\n\n",
  	top:30,
  	left:68,
  	width:236,
  	height:'auto',
  	textAlign:'left'
  });
  row.add(tweetLabel);
  
  data.push(row);
  
  rowData.push({
    id:tweet.id,
    text:tweet.text
  });
}

function getTimeFromDate(dateString) {
	var hour = dateString.substring(11,13)*1;
	var min = dateString.substring(14,16);
	if(hour > 12) { hour = hour - 12; }
	return hour+':'+min;
}

function timeOfDay(hour) {
	if(hour > 11) {
		return "PM";
	} else {
		return "AM";
	}
}

function retrieveTwitterFeed() {
	var url = "http://search.twitter.com/search.json?q="+encodeURIComponent(TWITTER_ACCOUNT);
	var xhr = Titanium.Network.createHTTPClient();
 
  Titanium.API.info(url);
	xhr.open("GET",url);
	xhr.onreadystatechange = function() {
	  Titanium.API.info(this.readyState);
	  Titanium.API.info(this.status);
    if (this.readyState == 4) {
			var tweets = eval('(' + this.responseText + ')');
			Titanium.API.info(this.responseText);
			var results = tweets.results;

  		for(var index in results) {
    		if(results[index] != null) {
    		  try{
      			buildData(results[index]);
    		  } catch(ex) {
    		    Titanium.API.error(ex);
    		  }
    		}
  		}
			
			if(tableView == null) {
				tableView = Titanium.UI.createTableView({
					backgroundColor:'#5a5c64',
    			separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
    			separatorColor:'#444',
					data:data
				});
				
				tableView.addEventListener("click",function(e){
				  presentOptionDialog(e.rowData.tweetId,e.rowData.tweetText);
				});
        win.add(tableView);
			} else {
				tableView.setData(data,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
			}
      Titanium.App.fireEvent('hide_indicator',{});
		}
	};
	xhr.send();
}
 
var refreshButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.REFRESH});
refreshButton.addEventListener('click',function()	{
  Titanium.App.fireEvent('show_indicator',{});
  data = [];
  rowData = [];
  retrieveTwitterFeed();
});
Titanium.UI.currentWindow.setLeftNavButton(refreshButton);

if (Titanium.Network.online == false){
  Titanium.App.fireEvent('hide_indicator',{});
	Titanium.UI.createAlertDialog({
	  title:"Connection Required",
	  message:"We cannot detect a network connection.  You need an active network connection to be able to continue using Nature Nearby features."
	}).show();
} else {
	retrieveTwitterFeed();
}

if(Ti.Platform.name == "android") {
  var menu = Ti.UI.Android.OptionMenu.createMenu();
  var refreshMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({
      title : 'Refresh Tweets'
  });
  refreshMenuItem.addEventListener('click', function(){
    Titanium.App.fireEvent('show_indicator',{});
    data = [];
    rowData = [];
    retrieveTwitterFeed();
  });
  menu.add(refreshMenuItem);
  Ti.UI.Android.OptionMenu.setMenu(menu); 
}