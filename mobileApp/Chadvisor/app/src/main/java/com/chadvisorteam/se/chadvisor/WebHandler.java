package com.chadvisorteam.se.chadvisor;

import android.util.Log;

import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class WebHandler {

    private final HttpClient httpClient;
    private final HttpPost httpPost;

    public WebHandler () {
        this.httpClient = new DefaultHttpClient();
        this.httpPost = new HttpPost("https://chatspire.herokuapp.com/api/submitMessage");
    }

    public String getBotResponse (String userInput) {
        try {
            List<NameValuePair> messageValuePair = new ArrayList<>(1);
            messageValuePair.add(new BasicNameValuePair("message", userInput));

            httpPost.setEntity(new UrlEncodedFormEntity(messageValuePair));

            ResponseHandler<String> responseHandler = new BasicResponseHandler();

            HttpRequestRunnable httpRequestRunnable = new HttpRequestRunnable(responseHandler);
            Thread botThread = new Thread(httpRequestRunnable);
            botThread.start();
            try {
                botThread.join();
            } catch (InterruptedException e) {
                Log.e("Thread Error", e.getMessage());
            }

            String jsonText = httpRequestRunnable.getBotResponse();
            JsonHandler handler = new JsonHandler(new JSONObject(jsonText));

            return handler.botResponse();
        } catch (IOException e) {
            return "Invalid message.";
        } catch (JSONException e) {
            return e.getMessage();
        }
    }

    private class HttpRequestRunnable implements Runnable {

        private String botResponse;
        private final ResponseHandler<String> responseHandler;

        public HttpRequestRunnable(ResponseHandler<String> responseHandler) {
            this.botResponse = "No message sent to bot.";
            this.responseHandler = responseHandler;
        }

        @Override
        public void run() {
            try {
                botResponse = httpClient.execute(httpPost, responseHandler);
            } catch (IOException e) {
                botResponse = e.getMessage();
            }
        }

        public String getBotResponse () {
            return botResponse;
        }
    }
}
