package org.cboard.util;

import com.alibaba.fastjson.JSONObject;
import org.junit.Test;
/**
 * Created by cat on 2020-06-04.
 */
public class JSONEncryptionTest{

    @Test
    public void testEncode() throws Exception {
        JSONObject json = new JSONObject();
        json.put("r","/bi.html#/dashboard/Demo/1");
        json.put("u","2d0a60bd-d425-4cf3-8ffe-14ac927a8266");
        json.put("userName","user");
        String info = JSONEncryption.encode(json);
        System.out.println(info);
    }
    @Test
    public void testDecode() throws Exception {
        JSONObject json = new JSONObject();
        json.put("r","/bi.html#/dashboard/Demo/1");
        json.put("u","2d0a60bd-d425-4cf3-8ffe-14ac927a8266");
        json.put("userName","user");
        String info = JSONEncryption.encode(json);
        System.out.println(JSONEncryption.decode(info));
    }
}