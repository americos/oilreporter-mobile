package com.intridea.oilreporter;

import org.appcelerator.titanium.TiApplication;

public class OilReporterApplication extends TiApplication {

	@Override
	public void onCreate() {
		super.onCreate();
		
		appInfo = new OilReporterAppInfo(this);
	}
}
