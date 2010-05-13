package com.intridea.oilreporter;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.titanium.util.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public class OilReporterAppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	
	public OilReporterAppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
					
		properties.setString("ti.deploytype", "development");
	}
	
	public String getId() {
		return "com.intridea.oilreporter";
	}
	
	public String getName() {
		return "Oil Reporter";
	}
	
	public String getVersion() {
		return "1.0";
	}
	
	public String getPublisher() {
		return "blim";
	}
	
	public String getUrl() {
		return "http://oilreporter.org";
	}
	
	public String getCopyright() {
		return "2010 by blim";
	}
	
	public String getDescription() {
		return "No description provided";
	}
	
	public String getIcon() {
		return "default_app_logo.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "0c5d028b-bc51-49e4-a79b-00fe7cab80b9";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
