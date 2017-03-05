<?php
namespace app\api\controller;

/**
 * swagger: 层
 */
class Floor {
	/**
	 * get: 获取层列表
	 * path: lst/{buildId}/{pageNo}
	 * method: lst
	 * param: buildId - {int} 楼id
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($buildId = 0, $pageNo = 1) {
		$floor = model('Floor');
		$list = $floor->_query($buildId, $pageNo);
		return success($list);
	}
	/**
	 * get: 获取层列表
	 * path: all/{buildId}
	 * method: all
	 * param: buildId - {int} 楼id
	 */
	public function all($buildId = 0) {
		$floor = model('Floor');
		$list = $floor->_all($buildId);
		return success($list);
	}
	
	/**
	 * get: 获取层列表
	 * path: getall/{buildId}
	 * method: getall
	 * param: buildId - {int} 楼id
	 */
	public function getall($buildId = 0) {
		$floor = model('Floor');
		$list = $floor->_getall($buildId);
		return success($list);
	}
	
	/**
	 * post: 保存层
	 * path: save
	 * method: save
	 * param: floorId - {int} = 0 层id(新增的时候为0)
	 * param: floorName - {string} = '' 层名
	 * param: buildId - {int} = '' 楼id
	 * param: navFileKey - {String} = 'default_floor_nav_file' 导航图
	 * param: floorAlias - {String} 别名
	 * param: floorEn - {String} 英文别名
	 * param: floorTags - {String} 标签(用逗号隔开)
	 */
	public function save() {
		$floor = model('Floor');
		$rst = $floor->_save();
		if($rst == 0) {
			return success(true, '保存成功');
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除层
	 * path: delete/{floorId}
	 * method: delete
	 * param: floorId - {int} 层Id
	 */
	public function delete($floorId = 0) {
		$floor = model('Floor');
		if($floor->_delete($floorId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
	
	/**
	 * patch: 上调一个顺序
	 * path: moveup/{floorId}
	 * method: moveup
	 * param: floorId - {int} 层id
	 */
	public function moveup($floorId) {
		$floor = model('Floor');
		$rst = $floor->moveUp($floorId);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('上移失败失败');
		}
	}
	
	/**
	 * patch: 下调一个顺序
	 * path: movedown/{floorId}
	 * method: movedown
	 * param: floorId - {int} 层id
	 */
	public function movedown($floorId) {
		$floor = model('Floor');
		$rst = $floor->moveDown($floorId);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('下移失败失败');
		}
	}
}