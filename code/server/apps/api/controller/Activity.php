<?php
namespace app\api\controller;

/**
 * swagger: 活动
 */
class Activity {
    
	/**
	 * get: 获取活动列表
	 * path: lst/{clientId}/{type}/{pageNo}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: type - {int} = [0|1] 活动类型(0, 当前活动，1.已结束活动)
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($clientId = 0, $type = 0, $pageNo = 1) {
		$db = model('Activity');
		$list = $db->_query($clientId, $type, $pageNo);
		return success($list);
	}
	
	/**
	 * get: 获取所有活动
	 * path: all/{clientId}
	 * method: all
	 * param: clientId - {int} 客户id
	 */
	public function all($clientId = 0) {
		$db = model('Activity');
		$list = $db->_all($clientId);
		return success($list);
	}
	
	/**
	 * get: 获取活动列表
	 * path: getall/{clientId}
	 * method: getall
	 * param: clientId - {int} 客户id
	 */
	public function getall($clientId = 0) {
		$db = model('Activity');
		$list = $db->_getall($clientId);
		return success($list);
	}
	
	/**
	 * post: 保存活动
	 * path: save
	 * method: save
	 * param: activityId - {int} = 0 活动id(新增的时候为0)
	 * param: clientId - {int}  客户id
	 * param: activityTitle - {string} = '' 活动标题
	 * param: activityDesc - {string} = '' 商家简介
	 * param: activityFileKey - {string} = '' 活动图片
	 * param: activityStartDate - {number} = '' 活动起始日期
	 * param: activityEndDate - {number} = '' 活动结束日期
	 */
	public function save() {
		$db = model('Activity');
		$rst = $db->_save();
		if($rst < 0) {
			return fail('保存失败');
		}
		return success(true, '保存成功');
	}
	
	/**
	 * delete: 删除活动
	 * path: delete/{activityId}
	 * method: delete
	 * param: activityId - {int} 活动id
	 */
	public function delete($activityId = 0) {
		$db = model('Activity');
		if($db->_delete($activityId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}