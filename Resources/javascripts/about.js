Titanium.include('../javascripts/application.js');
var win = Ti.UI.currentWindow;

var aboutImage = Ti.UI.createImageView({
  top:0,
  left:0,
  url:'../images/oil_reporter_about.png',
  height:'auto',
  width:'auto'
})
win.add(aboutImage);

var chooseSitePicker = function(event) {
  switch(event.index) {
    case 0:
      Ti.Platform.openURL("http://crisiscommons.org");
      break;
    case 1:
      Ti.Platform.openURL("http://intridea.com");
      break;
    case event.destructive:
      break;
  };
};

aboutImage.addEventListener("click",function(e){
  var chooseSite = Ti.UI.createOptionDialog({ title: 'Visit Our Website' });
  chooseSite.addEventListener('click', chooseSitePicker);
  chooseSite.options = ['Crisis Commons', 'Intridea, Inc.','Cancel'];
  chooseSite.cancel = 2;
  chooseSite.show();
});