<?php
namespace app\api\controller;

/**
 * swagger: 场景
 */
class Scene {
	/**
	 * get: 获取场景列表
	 * path: lst/{clientId}/{pageNo}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($clientId = 0, $pageNo = 1) {
		$scene = model('Scene');
		$list = $scene->_query($clientId, $pageNo);
		return success($list);
	}
	
	/**
	 * post: 保存场景
	 * path: save
	 * method: save
	 * param: sceneId - {int} = 0 场景id(新增的时候为0)
	 * param: sceneName - {string} = '' 场景名
	 * param: clientId - {string} = '' 客户id
	 * param: sceneDesc - {string} = '' 场景描述
	 */
	public function save() {
		$scene = model('Scene');
		$rst = $scene->_save();
		if($rst == 0) {
			return success(true);
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除场景
	 * path: delete/{sceneId}
	 * method: delete
	 * param: sceneId - {int} 场景Id
	 */
	public function delete($sceneId = 0) {
		$db = model('Scene');
		if($db->_delete($sceneId)) {
			return success(true);
		} else {
			return fail("删除失败");
		}
	}
	
	/**
	 * get: 获取场景默认设置
	 * path: _setting/{clientId}
	 * method: _setting
	 * param: clientId - {int} 客户id
	 */
	public function _setting($clientId = 0) {
		$db = model('Scene');
		$rst = $db->_setting($clientId);
		if($rst < 0) {
			return fail(false);
		}
		return success($rst);
	}
	
	/**
	 * patch: 修改场景默认设置
	 * path: setting/{clientId}
	 * method: setting
	 * param: clientId - {int} 客户id
	 * param: sceneName - {string} 场景名称
	 * param: buildName - {string} 建筑名称
	 * param: city	   - {string} 城市
	 */
	public function setting($clientId = 0) {
		$db = model('Scene');
		if($db->setting($clientId) < 0) {
			return fail("保存失败");
		}
		return success(true);
	}
	
	/**
	 * get: 获取场景默认设置
	 * path: getdefault/{clientId}
	 * method: getshutdown
	 * param: clientId - {int} 客户id
	 */
	public function getdefault($clientId = 0) {
		$db = model('Scene');
		$rst = $db->getdefault($clientId);
		if(empty($rst)) {
			return fail(false);
		}
		return success($rst);
	}
	
	/**
	 * patch: 修改场景默认设置
	 * path: setshutdown/{clientId}/{time}
	 * method: setshutdown
	 * param: clientId - {int} 客户id
	 * param: time - {int} 统一关机时间
	 */
	public function setshutdown($clientId = 0, $time = 0) {
		$db = model('Scene');
		if($db->setshutdown($clientId, $time) < 0) {
			return fail("保存失败");
		}
		return success(true);
	}
	
	/**
	 * patch: 修改默认广告出现分钟数
	 * path: setadstime/{clientId}/{time}
	 * method: setadstime
	 * param: clientId - {int} 客户id
	 * param: time - {int} 广告出现分钟数
	 */
	public function setadstime($clientId = 0, $time = 0) {
		$db = model('Scene');
		if($db->setadstime($clientId, $time) < 0) {
			return fail("保存失败");
		}
		return success(true);
	}
	
	/**
	 * patch: 修改默认终端密码
	 * path: setpassword/{clientId}/{passowrd}
	 * method: setpassword
	 * param: clientId - {int} 客户id
	 * param: passowrd - {string} 密码
	 */
	public function setpassword($clientId = 0, $passowrd) {
		$db = model('Scene');
		if($db->setpassword($clientId, $passowrd) < 0) {
			return fail("保存成功");
		}
		return success(true);
	}
}