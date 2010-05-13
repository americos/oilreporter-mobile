Titanium.include('../javascripts/application.js');

var win = Ti.UI.currentWindow;
var properties = Titanium.App.Properties;
var data = [];
var orgField;

function buildRows() {
  data[0] = Ti.UI.createTableViewSection({headerTitle:'Organization Information'});
	
	var orgRow = Ti.UI.createTableViewRow({height:50});
	if(Ti.Platform.name != 'android') {
  	orgRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	orgRow.className = 'control';
	
	var orgLabel = Ti.UI.createLabel({
  	color:'#444',
  	font:{fontSize:14, fontWeight:'bold'},
  	text:"Organization ID",
  	top:16,
  	left:10,
  	width:130,
  	height:16,
  	textAlign:'left'
  });
  orgRow.add(orgLabel);
  
	orgField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.hasProperty("orgId") ? properties.getString("orgId") : ''),
  	hintText:'Optional ID',
		autocorrect:false,
		height:30,
		top:9,
		left:130,
		width:154,
  	font:{fontSize:14, fontWeight:'normal'},
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	orgRow.add(orgField);
	data[0].add(orgRow);
	
}

buildRows();

// create table view data object
var tableView = Ti.UI.createTableView({
	data:data, 	
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(tableView);

var saveButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.SAVE});
saveButton.addEventListener('click',function(){
  properties.setString('orgId',orgField.value);

  var alert = Titanium.UI.createAlertDialog({
  	title:'Saved!',
  	message:'Your organization ID has been saved.  This will be sent with each report.'
  });
  alert.show(); 

});
win.setRightNavButton(saveButton);
