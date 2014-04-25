/**
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */

package com.phonegap.plugins.barcodescanner;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.LOG;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;

import android.app.ProgressDialog;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.widget.Toast;


/**
 * This calls out to the ZXing barcode reader and returns the result.
 */
public class BarcodeScanner extends CordovaPlugin {
    private static final String SCAN = "scan";
    private static final String ENCODE = "encode";
    private static final String CANCELLED = "cancelled";
    private static final String FORMAT = "format";
    private static final String TEXT = "text";
    private static final String DATA = "data";
    private static final String TYPE = "type";
    private static final String SCAN_INTENT = "com.phonegap.plugins.barcodescanner.SCAN";
    private static final String ENCODE_DATA = "ENCODE_DATA";
    private static final String ENCODE_TYPE = "ENCODE_TYPE";
    private static final String ENCODE_INTENT = "com.phonegap.plugins.barcodescanner.ENCODE";
    private static final String TEXT_TYPE = "TEXT_TYPE";
    private static final String EMAIL_TYPE = "EMAIL_TYPE";
    private static final String PHONE_TYPE = "PHONE_TYPE";
    private static final String SMS_TYPE = "SMS_TYPE";
    private static final String GPS = "gps";
    private static final String SHOW = "show";
    private static final String HIDE = "hide";
    
    private CallbackContext cbContext;

    public static final int REQUEST_CODE = 0x0ba7c0de;

    public String callback;
    
    private ProgressDialog waitingDialog = null;
    
    GPSTracker gps;

    /**
     * Constructor.
     */
    public BarcodeScanner() {
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action        The action to execute.
     * @param args          JSONArray of arguments for the plugin.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              A PluginResult object with a status and message.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        
        this.cbContext = callbackContext;
    	
        if (action.equals(ENCODE)) {
            JSONObject obj = args.optJSONObject(0);
            if (obj != null) {
                String type = obj.optString(TYPE);
                String data = obj.optString(DATA);

                // If the type is null then force the type to text
                if (type == null) {
                    type = TEXT_TYPE;
                }

                if (data == null) {
                	callbackContext.error("User did not specify data to encode");
                
                    return false;
                }

                encode(type, data);
            } else {
            	callbackContext.error("User did not specify data to encode");
            	
                return false;
            }
        }
        else if (action.equals(SCAN)) {
        	
        	scan();
        	
        } else if (action.equals(GPS)) {
			getLocation(callbackContext);
			//callbackContext.success();
			return true;			
		}else if (action.equals(SHOW)) {
			String text = "Please wait";
			try {
				text = args.getString(0);
			} catch (Exception e) {
				LOG.d("WaitingDialog", "Text parameter not valid, using default");
			}
			showWaitingDialog(text);
			callbackContext.success();
			return true;
		} else if (action.equals(HIDE)) {
			hideWaitingDialog();
			callbackContext.success();
			return true;
		}else {
        	callbackContext.error("Invalid Action");
        	
            return false;
        }
        
        return true;
    }
    
    public void showWaitingDialog(String text) {
		if (waitingDialog == null) {
		waitingDialog = ProgressDialog.show(this.cordova.getActivity(), "", text);
		LOG.d("WaitingDialog", "Dialog shown, waiting hide command");
		}
	}
	
	public void hideWaitingDialog() {
		if (waitingDialog != null) {
			waitingDialog.dismiss();
			LOG.d("WaitingDialog", "Dialog dismissed");
			waitingDialog = null;
		} else {
			LOG.d("WaitingDialog", "Nothing to dismiss");
		}
	}

	 /**
     * Starts an intent to scan and decode a barcode.
     */
    public void scan() {
        Intent intentScan = new Intent(SCAN_INTENT);
        intentScan.addCategory(Intent.CATEGORY_DEFAULT);

        this.cordova.startActivityForResult((CordovaPlugin) this, intentScan, REQUEST_CODE);
    }
    
    public void getLocation(CallbackContext callbackContext) {
		gps = new GPSTracker(this.cordova.getActivity());

		// check if GPS enabled		
        if(gps.canGetLocation()){
        	
        	double latitude = gps.getLatitude();
        	double longitude = gps.getLongitude();
        	
        	// \n is for new line
        	//Toast.makeText(this.cordova.getActivity().getApplicationContext(), "Your Location is - \nLat: " + latitude + "\nLong: " + longitude, Toast.LENGTH_LONG).show();
        	
        	JSONObject contactObject = new JSONObject();
            try {
                    contactObject.put("latitude", latitude);
                    contactObject.put("longitude", longitude);                    
            } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error("JSON error");
            }
        	callbackContext.success(contactObject);
        }else{
        	// can't get location
        	// GPS or Network is not enabled
        	// Ask user to enable GPS/network in settings
        	callbackContext.error("GPS is not enabled");
        	gps.showSettingsAlert();
        }	
	}

    /**
     * Called when the barcode scanner intent completes
     *
     * @param requestCode       The request code originally supplied to startActivityForResult(),
     *                          allowing you to identify who this result came from.
     * @param resultCode        The integer result code returned by the child activity through its setResult().
     * @param intent            An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, intent.getStringExtra("SCAN_RESULT"));
                    obj.put(FORMAT, intent.getStringExtra("SCAN_RESULT_FORMAT"));
                    obj.put(CANCELLED, false);
                } catch(JSONException e) {
                    //Log.d(LOG_TAG, "This should never happen");
                }
                
                this.cbContext.success(obj);
                
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, "");
                    obj.put(FORMAT, "");
                    obj.put(CANCELLED, true);
                } catch(JSONException e) {
                    //Log.d(LOG_TAG, "This should never happen");
                }
                	
                this.cbContext.success(obj);
                
            } else {
            	
            	this.cbContext.error("Invalid Activity");

            }
        }
    }

    /**
     * Initiates a barcode encode.
     * @param data  The data to encode in the bar code
     * @param data2
     */
    public void encode(String type, String data) {
        Intent intentEncode = new Intent(ENCODE_INTENT);
        intentEncode.putExtra(ENCODE_TYPE, type);
        intentEncode.putExtra(ENCODE_DATA, data);

        this.cordova.getActivity().startActivity(intentEncode);
    }
}