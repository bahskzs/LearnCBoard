package org.cboard.util;

import com.alibaba.fastjson.JSONObject;
import com.apexinfo.finereport.AESBaseUtil;
import com.apexinfo.finereport.ApexUtil;

import java.util.Map;

public class JSONEncryption {

    public static final String KEY = "apexinfo*1234567";
    public static final String IVS = "apexinfoapexinfo";

    public static String encode(JSONObject json) throws Exception {
        String info = "";
        String plainText = json.toString();
        info = AESBaseUtil.encode(plainText,KEY,IVS);
        return info;
    }

    public static String decode(String info) {
        String plainText = "";
        plainText = ApexUtil.decode(info);
        return plainText;
    }
}
