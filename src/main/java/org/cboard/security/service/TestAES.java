package org.cboard.security.service;

import com.alibaba.fastjson.JSONObject;
import com.apexinfo.finereport.AESBaseUtil;
import com.apexinfo.finereport.ApexUtil;

public class TestAES {
    public static void main(String[] args) {
        String token = "2";
        JSONObject jsonOld = new JSONObject();
        jsonOld.put("r","/bi.html#/dashboard/Demo/1");
        jsonOld.put("u","2d0a60bd-d425-4cf3-8ffe-14ac927a8266");
        jsonOld.put("u","user");
        String ming = jsonOld.toString();
        String key = "apexinfo*1234567";
        String ivs = "apexinfoapexinfo";
        try {
            token = AESBaseUtil.encode(ming,key,ivs);
            System.out.println(token);

            String info = ApexUtil.decode("MkppeEQwTzJ3dnQxOXptb0EvWHRlYVNPUWlPRzJXQ0lYTVRKS3QxZVN4WmVBdWZiY0VWaTB2MGJyY0I1Z3hWWkRwRUZMc1RDL0liYQ0KTkFkdDFJR3U1a0p6TUpVUWxTelZFeWdiMTVkZGZpRHl5TkRFN2JhdnNDeDU0N0YrOWVDWA..");
            System.out.println(info);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
