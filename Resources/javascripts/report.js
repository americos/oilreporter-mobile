Titanium.include('../javascripts/application.js');

var win = Ti.UI.currentWindow;
var properties = Ti.App.Properties;
var currentImageView;
var currentImageAdded = false;
var hostname = "http://oilreporter.heroku.com";

// See
var seeView = Ti.UI.createView({
  top: 10,
  left: 10,
  width: 300,
  height: 160,
  backgroundColor:'#333',
  borderRadius:6
});

var seeTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:'What Do You See?'
});
seeView.add(seeTitleLabel);

var seeField = Ti.UI.createTextArea({
	value:'',
	top: 40,
	left: 10,
	height: 54,
	width:280,
	keyboardType:Ti.UI.KEYBOARD_ASCII,
	color:'#222',
	font:{fontSize: 14, fontWeight:"normal"},  
	borderWidth:2,
	borderColor:'#303030',
	borderRadius:6
});
seeField.addEventListener("return",function(e){
  seeField.blur();
})
seeView.add(seeField);

var mediaLabel = Ti.UI.createLabel({
  top: 100,
  left: 70,
  width: 280,
  height: 30,
  color: '#fff',
	font:{fontSize:16, fontWeight:'bold'},
  text:'Add a Photo or Video'
});
var mediaDescLabel = Ti.UI.createLabel({
  top: 120,
  left: 70,
  width: 280,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:'Share with us what you\'re seeing'
});
seeView.add(mediaDescLabel);
seeView.add(mediaLabel);
var mediaView = Ti.UI.createView({
  top: 100,
  left: 10,
  width: 50,
  height: 50,
  backgroundColor:'#222',
  borderRadius:6
});

var mediaButtonBg = Ti.UI.createView({
  top: 2,
  left: ((mediaView.width - 46)/2),
  width: 46,
  height: 46,
  backgroundColor: '#000',
  borderRadius: 5
});

var mediaAddButton = Ti.UI.createButton({
  top: 1,
  left: 1,
  width: 44,
  height: 44,
  backgroundImage: '../images/icon_camera.png',
	backgroundSelectedImage: '../images/icon_camera.png',
	backgroundDisabledImage: '../images/icon_camera.png'
});

mediaAddButton.addEventListener('click', function() {
  displayMediaChooser();
});

mediaButtonBg.add(mediaAddButton);
mediaView.add(mediaButtonBg);
seeView.add(mediaView);
win.add(seeView);

// Oil
var oilView = Ti.UI.createView({
  top: 185,
  left: 10,
  width: 300,
  height: 90,
  backgroundColor:'#5a5c64',
  borderRadius:6
});
var oilTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:"How Much Oil Do You See? (5)"
});
oilView.add(oilTitleLabel);

var oilDescLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name == 'android' ? 30 : 25),
  left: 10,
  width: 300,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:"0 is open water, 10 is thick"
});
oilView.add(oilDescLabel);

var oilSlider = Ti.UI.createSlider({
  top: 55,
  left: 10,
  width: 280,
  height: "auto",
  min: 0,
  max: 10,
  value:5,
  enabled: true
});
oilView.add(oilSlider);

oilSlider.addEventListener('change',function(e) {
	oilTitleLabel.text = "How Much Oil Do You See? (" + Math.round(oilSlider.value)+")";
});

win.add(oilView);

// Respond
var respondView = Ti.UI.createView({
  top: 286,
  left: 10,
  width: 300,
  height: 70,
  backgroundColor:'#5a5c64',
  borderRadius:6
});

var respondTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 160,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:"Mark as Urgent?"
});
respondView.add(respondTitleLabel);

var respondDescLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name == 'android' ? 30 : 25),
  left: 10,
  width: 160,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:"Do you require a response?"
});
respondView.add(respondDescLabel);

var respondSwitch = Ti.UI.createSwitch({
  top: (Ti.Platform.name == 'android' ? 15 : 18),
  right: 20,
  width: 80,
  height: "auto",
  enabled: true
});
respondView.add(respondSwitch);

win.add(respondView);


// Media management
var currentMedia = false;

var chooseMediaSource = function(event) {
  switch(event.index) {
    case 0:
      Ti.Media.showCamera({
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO, Ti.Media.MEDIA_TYPE_VIDEO]
      });
      break;
    case 1:
      chooseFromGallery();
      break;
    case event.destructive:
      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
        currentMedia = false;
      }
      break;
  };
};

var chooseMedia = Ti.UI.createOptionDialog({
  title: 'Choose media'
});
chooseMedia.addEventListener('click', chooseMediaSource);

function displayMediaChooser() {
  if(currentImageAdded) {
    chooseMedia.options = ['New Photo or Video', 'Choose Existing', 'Remove Existing', 'Cancel'];
    chooseMedia.destructive = 2;  
    chooseMedia.cancel = 3;
  } else {
    chooseMedia.options = ['New Photo or Video', 'Choose Existing','Cancel'];
    chooseMedia.cancel = 2;
  }
  chooseMedia.show();
}

function chooseFromGallery() {
  Ti.Media.openPhotoGallery({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO, Ti.Media.MEDIA_TYPE_VIDEO],
    success: function(event) {
      var cropRect = event.cropRect;
      var image = event.media;
      currentMedia = event.media;

      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      currentImageView = Ti.UI.createImageView({
                        top: 1,
                        left: 1,
                        image: event.media,
                        height: 44,
                        width: 44,
                        borderRadius: 2
                      });

      currentImageView.addEventListener('click', function(event) {
        displayMediaChooser();
      });
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    }
  });
};

var clearButton = Titanium.UI.createButton({title:'Clear'});
clearButton.addEventListener('click',function()	{
  var clearAlert = Titanium.UI.createAlertDialog({
  	title:'Clear All Values?',
  	message:'Are you sure you want to clear all the values in the fields below?'
  });
  clearAlert.buttonNames = ['Yes', 'No'];
	clearAlert.addEventListener("click",function(e) {
	  if(e.index == 0) {
      clearAllValues();
	  }
	});
	clearAlert.show();
});
Titanium.UI.currentWindow.setLeftNavButton(clearButton);


function clearAllValues(){
  oilSlider.value = 5;
  seeField.value = "";
  image = null;
  currentMedia = null;
  if(currentImageAdded) {
    mediaButtonBg.remove(currentImageView);
    currentImageAdded = false;
  }
}

function showSuccess() {
  Ti.UI.createAlertDialog({
  	title:'Success!',
  	message:'Your report has been submitted.  Thank you!'
  }).show();
  clearAllValues();
}

var xhrOnError = function(e) {
  Ti.API.info("Error " + e.error);
  Ti.App.fireEvent('hide_indicator',{});
  Ti.UI.createAlertDialog({
  	title:'Sorry',
  	message:'There was a problem submitting your oil report.  Please try again soon.'
  }).show();
  
};

Ti.App.addEventListener('submit_form', function(options) {
  if (options.latitude == null) { options.latitude = 0.0; }
  if (options.longitude == null) { options.longitude = 0.0; }

  var jsonData = JSON.stringify({ report: {
                                    description: seeField.value,
                                    oil        : oilSlider.value,
                                    respond    : respondSwitch.value,
                                    latitude   : options.latitude,
                                    longitude  : options.longitude
                                  }
                               });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function() {
    Ti.API.info('Response ' + this.responseText);
    var reportId = false;

    reportId = JSON.parse(this.responseText).id;

    if (reportId && currentMedia) {
      Ti.App.fireEvent('upload_picture', { reportId: reportId });
    } else {
      if (!reportId) { Ti.API.error('Could not eval() responseText'); }
      Ti.App.fireEvent('hide_indicator',{});
      showSuccess();
    }
  };
  
  Ti.API.info("About to submit ..." + jsonData);
  
  xhr.open('POST', hostname + '/reports');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(jsonData);
});

Ti.App.addEventListener('upload_picture', function(options) {
  if (options.reportId == null) {
    xhrOnError({ error: 'No report id' });
    return;
  }

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function() {
    Ti.API.info('response' + this.responseText);
    Ti.App.fireEvent('hide_indicator', {});
    showSuccess();
  };

  xhr.open('PUT', hostname + '/reports/' + options.reportId);
  xhr.send({"report[media]": currentMedia, "_method": "PUT"});
});

var submitButton = Titanium.UI.createButton({title:'Send'});
Titanium.UI.currentWindow.setRightNavButton(submitButton);

submitButton.addEventListener('click', function() {
  submitReport();
});

function submitReport() {
  seeField.blur(); // Drop keyboard
  
  if (Titanium.Network.online == false){
  	Titanium.UI.createAlertDialog({
  	  title:"Connection Required",
  	  message:"We cannot detect a network connection.  You need an active network connection to be able to submit oil reports."
  	}).show();
  } else if(seeField.value != null && seeField.value != "" && seeField.value.length > 0) {
    Ti.App.fireEvent('show_indicator', { title: 'Locating' });

    Titanium.Geolocation.getCurrentPosition(function(e) {
      Ti.App.fireEvent('change_title', { title: 'Submitting' });
  		Ti.API.info("Received geolocation response");
      
  		if (e.error) {
  		  Ti.API.error("Could not determine location");
  		  Ti.App.fireEvent('submit_form', {});
  		} else {
  		  Ti.App.fireEvent('submit_form', { latitude: e.coords.latitude, longitude: e.coords.longitude });
      }
  	});
  } else {
    Ti.UI.createAlertDialog({
    	title:'Sorry!',
    	message:'You must make sure to at least let us know what you see in the field above before submitting.'
    }).show();
  }
}

if(Ti.Platform.name == "android") {
  var menu = Ti.UI.Android.OptionMenu.createMenu();
  var clearMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({title : 'Clear Form'});
  clearMenuItem.addEventListener('click', function(){
    var clearAlert = Titanium.UI.createAlertDialog({
    	title:'Clear All Values?',
    	message:'Are you sure you want to clear all the values in the fields below?'
    });
    clearAlert.buttonNames = ['Yes', 'No'];
  	clearAlert.addEventListener("click",function(e) {
  	  if(e.index == 0) {
        clearAllValues();
  	  }
  	});
  	clearAlert.show();
  });
  var submitMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({
      title : 'Submit Report'
  });
  submitMenuItem.addEventListener('click', function(){
    submitReport();
  });

  menu.add(clearMenuItem);
  menu.add(submitMenuItem);
  Ti.UI.Android.OptionMenu.setMenu(menu); 
}