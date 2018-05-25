package com.chadvisorteam.se.chadvisor;

import android.content.Context;
import android.support.v7.widget.AppCompatTextView;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.widget.LinearLayout;

public class BotText extends AppCompatTextView {

    public BotText(Context context) {
        super(context);
        setTextSize(20f);
        setTextColor(getResources().getColor(R.color.botTextColour));
        setTextAlignment(TEXT_ALIGNMENT_TEXT_END);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.bottomMargin = 20;
        layoutParams.leftMargin = 80;
        setLayoutParams(layoutParams);
    }

    public BotText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}
