package com.chadvisorteam.se.chadvisor;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v7.widget.AppCompatTextView;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.widget.LinearLayout;

public class UserText extends AppCompatTextView {

    public UserText(Context context) {
        super(context);
        setTextSize(20f);
        setTextColor(getResources().getColor(R.color.userTextColour));
        setTextAlignment(TEXT_ALIGNMENT_TEXT_START);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.bottomMargin = 20;
        layoutParams.rightMargin = 80;
        setLayoutParams(layoutParams);
    }

    public UserText(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }
}
