package org.cboard.security.service;

import com.alibaba.fastjson.JSONObject;

import com.apexinfo.finereport.AESBaseUtil;
import com.apexinfo.finereport.ApexUtil;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.commons.lang.StringUtils;
import org.cboard.dto.User;
import org.cboard.security.ShareAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * Created by yfyuan on 2017/2/22.
 */
public class LocalSecurityFilter implements Filter {

    private Logger LOG = LoggerFactory.getLogger(this.getClass());
    private static String context = "";
    private static String schema = "";
    private static LoadingCache<String, String> sidCache = CacheBuilder.newBuilder().expireAfterAccess(3, TimeUnit.MINUTES).build(new CacheLoader<String, String>() {
        @Override
        public String load(String key) throws Exception {
            return null;
        }
    });

    public static void put(String sid, String uid) {
        sidCache.put(sid, uid);
    }

    public static String getContext() {
        return context;
    }

    public static String getSchema() {
        return schema;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest hsr = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String token = hsr.getParameter("APEXTOKEN");
        boolean success = false;

        if (StringUtils.isBlank(context) || StringUtils.isBlank(schema) ) {
            context = hsr.getLocalPort() + hsr.getContextPath();
            schema = hsr.getScheme();
        }
        if ("/render.html".equals(hsr.getServletPath())) {
            String sid = hsr.getParameter("sid");
            try {
                String uid = sidCache.get(sid);
                if (StringUtils.isBlank(String.valueOf(sidCache))) {
                    User user = new User("shareUser", "", new ArrayList<>());
                    user.setUserId(sidCache.get(sid));
                    SecurityContext context = SecurityContextHolder.getContext();
                    context.setAuthentication(new ShareAuthenticationToken(user));
                    hsr.getSession().setAttribute("SPRING_SECURITY_CONTEXT", context);
                }
            } catch (Exception e) {
                LOG.error("", e);
            }
        }
        //2020-05-25 cat
        if(StringUtils.isNotEmpty(token)) {

            //也可以通过session获得SecurityContext对象
            SecurityContext context_session = (SecurityContext)
                    hsr.getSession().getAttribute("SPRING_SECURITY_CONTEXT");

            //通过SecurityContextHolder获得当前线程上绑定的SecurityContext对象
            SecurityContext context = SecurityContextHolder.getContext();

            String info = ApexUtil.decode(token);

            if (StringUtils.isNotEmpty(info)) {
                String serivcePath = "/cboard";
                JSONObject json = JSONObject.parseObject(info);
                String url = json.getString("r");
                String userID = json.getString("u");
                String userName = json.getString("userName");
                String params = json.getString("params");
                Set<String> keySet = new HashSet<String>();

                if(StringUtils.isNotEmpty(params)){
                    keySet = JSONObject.parseObject(params).keySet();
                    StringBuffer str = new StringBuffer();

                    Iterator<String> iterator = keySet.iterator();
                    int count = 0;
                    str.append("externalParam"+"=1&");
                    while (iterator.hasNext()){

                        String key = iterator.next();
                        String value = JSONObject.parseObject(params).getString(key);
                        str.append(key + "=" + value);
                        count ++ ;
                        if(count < keySet.size()){
                            str.append("&");
                        }
                    }
                    params = URLEncoder.encode(str.toString(),"utf-8");
                }else{
                    params = "";
                }
                //构造 "params:"{"name":"正式"}
///                String params = json.getString("params");
///                Map<String,String> map = new HashMap<String,String>();
///                map.put("params",params);
                //证明两个context一致
                if (context_session != null) {
                    Authentication authentication = context_session.getAuthentication();
                    User user = (User) authentication.getPrincipal();

                    if (userID.equals(user.getUserId()) == false) {
                        user = new User(userName, " ", new ArrayList<>());
                        user.setUserId(userID);
                        context.setAuthentication(new ShareAuthenticationToken(user));
                        hsr.getSession().setAttribute("SPRING_SECURITY_CONTEXT", context);
                        success = true;
                    }else{
                        success = true;
                    }
                } else {
                    //user = new User("user", " ", new ArrayList<>());
                    User user = new User(userName, " ", new ArrayList<>());
                    user.setUserId(userID);
                    context.setAuthentication(new ShareAuthenticationToken(user));
                    hsr.getSession().setAttribute("SPRING_SECURITY_CONTEXT", context);
                    success = true;
                }

                if (success) {
                    //hsr.getRequestDispatcher("/starter.html").forward(servletRequest, servletResponse);
                    String urls = serivcePath + url + "?" + params;
                    response.sendRedirect(urls);
                    return;
                }
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
