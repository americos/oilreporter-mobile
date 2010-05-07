Titanium.include('javascripts/application.js');
var indicatorShowing = false;

var tabGroup = Titanium.UI.createTabGroup();
var reportWin = Titanium.UI.createWindow({  
  url:'javascripts/report.js',
  title:'Oil Reporter',
  barColor:"#333",
  backgroundImage:'images/back.png'
});
var reportTab = Titanium.UI.createTab({  
  icon:'images/icon_report.png',
  title:'Report',
  window:reportWin
});

var twitterWin = Titanium.UI.createWindow({  
  url:'javascripts/twitter.js',
  title:'Twitter #oilspill',
  barColor:"#333",
  backgroundColor:'#5a5c64'
});
var twitterTab = Titanium.UI.createTab({  
  icon:'images/icon_twitter2.png',
  title:'Twitter',
  window:twitterWin
});

var aboutWin = Titanium.UI.createWindow({  
  url:'javascripts/about.js',
  backgroundColor:'#2f5480',
  title:'About Oil Reporter',
  barColor:"#333",
  backTitle:'Back'
});
var aboutTab = Titanium.UI.createTab({  
  icon:'images/icon_about.png',
  title:'About',
  window:aboutWin
});

tabGroup.addTab(reportTab);  
tabGroup.addTab(twitterTab);  
tabGroup.addTab(aboutTab);  

tabGroup.open();


// ---------------------------------------------------------------
// Create custom loading indicator
// ---------------------------------------------------------------
var indWin = null;
var actInd = null;
function showIndicator(title) {
	indicatorShowing = true;
  Ti.API.info("showIndicator with title " + title);
	
	if(Ti.Platform.name == 'android') {
	  Ti.API.info("in android block");
    androidActivityIndicator = Titanium.UI.createActivityIndicator({message:title});
    androidActivityIndicator.show();
  } else {
  	// window container
  	indWin = Titanium.UI.createWindow({
  		height:150,
  		width:150
  	});

  	// black view
  	var indView = Titanium.UI.createView({
  		height:150,
  		width:150,
  		backgroundColor:'#000',
  		borderRadius:10,
  		opacity:0.7
  	});
  	indWin.add(indView);

  	// loading indicator
  	actInd = Titanium.UI.createActivityIndicator({
  		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
  		height:30,
  		width:30
  	});
  	indWin.add(actInd);

  	// message
  	var message = Titanium.UI.createLabel({
  		text:title,
  		color:'#fff',
  		width:'auto',
  		height:'auto',
  		font:{fontSize:20,fontWeight:'bold'},
  		bottom:20
  	});
  	indWin.add(message);
  	indWin.open();
  	actInd.show();
  }
};

function hideIndicator() {
  if(Ti.Platform.name == 'android') {
    indicatorShowing = false;
    androidActivityIndicator.hide();
  } else {
  	actInd.hide();
  	indWin.close({opacity:0,duration:500});
  	indicatorShowing = false;
  }
};

// ---------------------------------------------------------------
// Add global event handlers to hide/show custom indicator
// ---------------------------------------------------------------
Titanium.App.addEventListener('show_indicator', function(e) {
  if(e.title == null) { e.title = 'Loading'; }
  if(indicatorShowing == true) { hideIndicator(); }
	showIndicator(e.title);
});
Titanium.App.addEventListener('change_title', function(e) {
  if(e.title) {
    hideIndicator();
  	showIndicator(e.title);
  }
});
Titanium.App.addEventListener('hide_indicator', function(e) {
	hideIndicator();
});