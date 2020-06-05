package org.cboard.security.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.commons.lang.StringUtils;
import org.cboard.dto.User;
import org.cboard.security.ShareAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

public class AutoFilter implements Filter {

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
   private FilterConfig filterConfig;
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig=filterConfig;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        // 转换对象
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        // 获得访问的路径
        String uri = httpServletRequest.getRequestURI();
        String contextPath = httpServletRequest.getContextPath();
        uri = uri.substring(contextPath.length() + 1);
        // 获得初始化参数
        String login = filterConfig.getInitParameter("bi.html");

        // 不包含"bi"的路径就要进行过滤 （bi.jsp 不需要自动登录）
        if (login.equals(httpServletRequest.getServletPath())) {
            String sid = httpServletRequest.getParameter("sid");
            try {
                String uid = sidCache.get(sid);
                if (StringUtils.isNotEmpty(uid)) {
                    User user = new User("shareUser", "", new ArrayList<>());
                    user.setUserId(sidCache.get(sid));
                    SecurityContext context = SecurityContextHolder.getContext();
                    context.setAuthentication(new ShareAuthenticationToken(user));
                    httpServletRequest.getSession().setAttribute("SPRING_SECURITY_CONTEXT", context);
                }
            } catch (Exception e) {
                LOG.error("", e);
            }
        }
    }

    @Override
    public void destroy() {

    }
}
