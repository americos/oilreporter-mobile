Titanium.include('../javascripts/application.js');

var wildView = Ti.UI.createView({
  top: 285,
  left: 10,
  width: 300,
  height: 90,
  backgroundColor:'#5a5c64',
  borderRadius:6
});

var html = "<html><body bgcolor='#5a5c64'>";
html += "<p>Test</p>";
html +="</body></html>";

var wildWebView = Ti.UI.createWebView({
  top: 35,
  left: 00,
  width: 290,
  height: 44,
  html:html
});
wildView.add(wildWebView);