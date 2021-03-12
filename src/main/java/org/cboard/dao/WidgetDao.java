package org.cboard.dao;

import org.cboard.pojo.DashboardWidget;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by yfyuan on 2016/8/122.
 */
@Repository
public interface WidgetDao {

    /**
     * @return 报表分类list
     */
    List<String> getCategoryList();

    /**
     *
     * @return 获取所有报表配置信息
     */
    List<DashboardWidget> getAllWidgetList();

    /**
     *
     * @param userId 用户id
     * @return 获取用户id所属的报表信息
     */
    List<DashboardWidget> getWidgetList(String userId);

    /**
     *
     * @param userId 用户id
     * @return 用户id下admin角色的报表信息
     */
    List<DashboardWidget> getWidgetListAdmin(String userId);

    /**
     *
     * @param dashboardWidget 报表信息
     * @return  影响行数
     */
    int save(DashboardWidget dashboardWidget);

    /**
     *
     * @description 判断当前分类下是否有相同名称的报表
     * @param map
     * @return  1|存在；0|不存在
     */
    long countExistWidgetName(Map<String, Object> map);

    /**
     * @description 更新报表信息
     * @param dashboardWidget 报表信息
     * @return  影响行数
     */
    int update(DashboardWidget dashboardWidget);

    /**
     *
     * @description 删除报表
     * @param id  报表id
     * @return
     */
    int delete(Long id);

    /**
     *
     * @param id 报表主键id
     * @return  报表信息
     */
    DashboardWidget getWidget(Long id);

    /**
     *
     * @description 根据报表名称、分类名称获取报表id
     * @param widgetName 报表名称
     * @param category  分类名称
     * @return  报表id
     */
    String getWidgetId(String widgetName,String category);

    /**
     *
     * @description 检测用户是否有权限
     * @param userId 用户id
     * @param widgetId 报表id
     * @param permissionPattern 是否许可
     * @return
     */
    long checkWidgetRole(String userId, Long widgetId, String permissionPattern);
}
