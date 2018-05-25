package com.chadvisorteam.se.chadvisor;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonHandler {

    private static final String PREREQUISITE_ACTION = "prerequisites";
    private static final String COREQUISITE_ACTION = "corequisites";
    private static final String SUGGESTED_ACTION = "suggested";
    private static final String ELECTIVE_ACTION = "elective";
    private static final String FOLLOWING_ACTION = "following";

    private final JSONObject topJson;
    private String message;

    public JsonHandler(JSONObject topJson) {
        this.topJson = topJson;
    }

    public String botResponse () {
        try {
            message = topJson.getString("message");
            String action = topJson.getString("actionGiven");

            switch (action) {
                case PREREQUISITE_ACTION :
                    return prerequisiteAction();
                case COREQUISITE_ACTION :
                    return corequisiteAction();
                case SUGGESTED_ACTION :
                    return suggestedAction();
                case ELECTIVE_ACTION :
                    return electiveAction();
                case FOLLOWING_ACTION :
                    return followingAction();
            }
            return message;
        } catch (JSONException e) {
            return  message;
        }
    }

    private String prerequisiteAction () {
        try {
            JSONArray results = topJson.getJSONArray("foundResults");
            StringBuilder response;
            JSONArray prerequisiteArray = results.getJSONObject(0).getJSONArray("prerequisites");
            if (prerequisiteArray.length() > 0) {
                response = new StringBuilder("The prerequisites of " + topJson.getString("paperGiven") + " is:");
                for (int i = 0; i < prerequisiteArray.length(); i++) {
                    response.append("\n\n").append(prerequisiteArray.getString(i));
                }
            } else {
                response = new StringBuilder("No prerequisites for " + topJson.getString("paperGiven") + ".");
            }
            return response.toString();
        } catch (JSONException e) {
            return message;
        }
    }

    private String suggestedAction () {
        try {
            JSONArray results = topJson.getJSONArray("foundResults");
            StringBuilder response = new StringBuilder("Here is the suggested list of papers for " + topJson.getString("major")
                    + "in Year " + topJson.getString("currentYear") + ":");
            for (int i = 0; i < results.length(); i++) {
                response.append("\n\n").append(results.getJSONObject(i).getString("name"));
            }
            return response.toString();
        } catch (JSONException e) {
            return message;
        }
    }

    private String corequisiteAction () {
        try {
            JSONArray results = topJson.getJSONArray("foundResults");
            StringBuilder response;
            JSONArray corequisiteArray = results.getJSONObject(0).getJSONArray("corequisites");
            if (corequisiteArray.length() > 0) {
                response = new StringBuilder("The corequisites of " + topJson.getString("paperGiven") + " is:");
                for (int i = 0; i < corequisiteArray.length(); i++) {
                    response.append("\n\n").append(corequisiteArray.getString(i));
                }
            } else {
                response = new StringBuilder("No corequisites for " + topJson.getString("paperGiven") + ".");
            }
            return response.toString();
        } catch (JSONException e) {
            return message;
        }
    }

    private String electiveAction () {
        try {
            JSONObject result = topJson.getJSONObject("foundResults");
            StringBuilder response;
            JSONArray electiveArray = result.getJSONArray("electivePapers");
            if (electiveArray.length() > 0) {
                response = new StringBuilder("The list of electives available for " + topJson.getString("majorGiven") + " are:");
                for (int i = 0; i < electiveArray.length(); i++) {
                    response.append("\n\n").append(electiveArray.getJSONObject(i).getString("name")).append(", Level: ").append(electiveArray.getJSONObject(i).getString("level"));
                }
            } else {
                response = new StringBuilder("There are no elective papers for " + topJson.getString("majorGiven"));
            }
            return response.toString();
        } catch (JSONException e) {
            return message;
        }
    }

    private String followingAction () {
        try {
            StringBuilder response;
            JSONArray followingArray = topJson.getJSONArray("foundResults").getJSONObject(0).getJSONArray("followingPaper");
            if (followingArray.length() > 0) {
                response = new StringBuilder("The suggested paper after completing " + topJson.getString("paperGiven") + " is:");
                for (int i = 0; i < followingArray.length(); i++) {
                    response.append("\n\n").append(followingArray.getString(i));
                }
            } else {
                response = new StringBuilder("No papers follows " + topJson.getString("paperGiven"));
            }
            return response.toString();
        } catch (JSONException e) {
            return message;
        }
    }
}
