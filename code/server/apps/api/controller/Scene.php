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
		$scene = model('Scene');
		if($scene->_delete($sceneId)) {
			return success(true);
		} else {
			return fail("删除失败");
		}
	}
}