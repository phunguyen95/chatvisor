package com.chadvisorteam.se.chadvisor;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;

public class ChatActivity extends AppCompatActivity {

    private WebHandler webHandler;

    private ScrollView conversationScroller;
    private LinearLayout conversationContainer;
    private EditText userTextBox;
    private Button userSendButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        webHandler = new WebHandler();

        conversationScroller = findViewById(R.id.conversation_scroller);
        conversationContainer = findViewById(R.id.conversation_container);
        userTextBox = findViewById(R.id.user_input);
        userSendButton = findViewById(R.id.user_send_button);

        BotText welcomeBot = new BotText(getApplicationContext());
        welcomeBot.setText("Welcome to ChadVisor. I am here to help you with info about your BCIS papers. Ask me a question and I'll try to help!");
        conversationContainer.addView(welcomeBot);

        userSendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!userTextBox.getText().toString().equals("")) {

                    String userMessage = userTextBox.getText().toString();
                    UserText userText = new UserText(getApplicationContext());
                    userText.setText(userMessage);
                    conversationContainer.addView(userText);

                    String botResponse = webHandler.getBotResponse(userMessage);
                    BotText botText = new BotText(getApplicationContext());
                    botText.setText(botResponse);
                    conversationContainer.addView(botText);

                    conversationScroller.post(new Runnable() {
                        @Override
                        public void run() {
                            conversationScroller.fullScroll(View.FOCUS_DOWN);
                        }
                    });

                    userTextBox.setText("");
                }
            }
        });
    }
}
