<?php
namespace app\api\controller;

/**
 * swagger: 楼
 */
class Build {
	/**
	 * get: 获取楼列表
	 * path: lst/{sceneId}/{pageNo}
	 * method: lst
	 * param: sceneId - {int} 场景id
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($sceneId, $pageNo = 1) {
		$build = model('Build');
		$list = $build->_query($sceneId, $pageNo);
		return success($list);
	}
	
	/**
	 * post: 保存楼
	 * path: save
	 * method: save
	 * param: buildId - {int} = 0 楼id(新增的时候为0)
	 * param: buildName - {string} = '' 楼名
	 * param: sceneId - {id} = '' 场景id
	 * param: buildDesc - {string} = '' 楼描述
	 */
	public function save() {
		$build = model('Build');
		$rst = $build->_save();
		if($rst == 0) {
			return success(true);
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除楼
	 * path: delete/{buildId}
	 * method: delete
	 * param: buildId - {int} 楼Id
	 */
	public function delete($buildId = 0) {
		$build = model('Build');
		if($build->_delete($buildId)) {
			return success(true);
		} else {
			return fail("删除失败");
		}
	}
}