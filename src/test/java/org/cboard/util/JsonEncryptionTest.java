package org.cboard.util;

import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

import java.util.*;

/**
 * Created by cat on 2020-06-04.
 */
public class JsonEncryptionTest {

    @Test
    public void testEncode() throws Exception {
        JSONObject json = new JSONObject();
///        json.put("r","/bi.html#/mine/3");
///        json.put("u","2d0a60bd-d425-4cf3-8ffe-14ac927a8266");
        json.put("r","/starter.html#/mine/3");
        json.put("u",1);
        json.put("userName","admin");
        JSONObject jsonSub = new JSONObject();
        jsonSub.put("fname","高中,硕士");
        jsonSub.put("fno","06,07");
        json.put("params",jsonSub.toString());
        String info = JsonEncryption.encode(json);
        System.out.println(info);
    }
    @Test
    public void testDecode() throws Exception {
        JSONObject json = new JSONObject();
//        json.put("r","/bi.html#/mine/3");
//        json.put("u","2d0a60bd-d425-4cf3-8ffe-14ac927a8266");
        json.put("r","/starter.html#/mine/3");
        json.put("u",1);
        json.put("userName","admin");
        JSONObject jsonSub = new JSONObject();
        jsonSub.put("name","实习,正式");
        json.put("params",jsonSub.toString());
        System.out.println(json.getString("params").toString());
        String params = json.getString("params");

        Set<String> keySet = new HashSet<String>();
        keySet = JSONObject.parseObject(params).keySet();
        StringBuffer str = new StringBuffer();

        Iterator<String> iterator = keySet.iterator();
        int count = 0;
        while (iterator.hasNext()){

            String key = iterator.next();
            String value = JSONObject.parseObject(params).getString(key);
            str.append(key + "=" + value);
            count ++ ;
            if(count < keySet.size()){
                str.append("&");
            }
        }
        System.out.println(str.toString());
        String info = JsonEncryption.encode(json);
        System.out.println(JsonEncryption.decode(info));
//        String info1 = "MkppeEQwTzJ3dnQxOXptb0EvWHRlY0YxSzZ6SlljK3Z3WFdBY2NqL011TVBkQ3NVWnMzdEFlRkR6bGNUc3VtK3ZmMk1td1hPbStXcQ0KNzVFRHAyRG9YQk8vd0NJaGdoU2NtMU9iV3UramlXT2tzcHBJVFFybTBHOGthTWFDZFU2blN0d3JuTkxuZEdTYnpaZFFzdVZaRFE9PQ.." ;
//        System.out.println(JSONEncryption.decode(info1));
    }
}