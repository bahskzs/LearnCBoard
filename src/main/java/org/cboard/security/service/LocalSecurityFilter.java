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


        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
