<?php
namespace app\api\controller;

/**
 * swagger: 字典
 */
class Dict {
	/**
	 * get: 获取字典列表
	 * path: lst/{clientId}/{parenId}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: parenId - {int} 键值
	 */
	public function lst($clientId = 0, $parenId = 0) {
		$dict = model('Dict');
		$list = $dict->_query($clientId, $parenId);
		return success($list);
	}
	
	/**
	 * get: 获取字典分组列表
	 * path: group/{clientId}/{parenId}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: parenId - {int} 键值
	 */
	public function group($clientId = 0, $parenId = 0) {
		$dict = model('Dict');
		$list = $dict->group($clientId, $parenId);
		return success($list);
	}
	
	/**
	 * post: 保存字典
	 * path: save
	 * method: save
	 * param: clientId - {int} 客户id
	 * param: dictParentId - {int} 父字典id
	 * param: dictId - {int} 字典id
	 * param: dictValue - {string} 值
	 * param: dictIcon - {string} ＝ '' 图标
	 * param: dictRemark - {string} = '' 备注
	 */
	public function save() {
		$dict = model('Dict');
		$rst = $dict->_save();
		if($rst == 0) {
			return success(true, '保存成功');
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除字典
	 * path: delete/{dictId}
	 * method: delete
	 * param: dictId - {int} 字典id
	 */
	public function delete($dictId) {
		$dict = model('Dict');
		if($dict->_delete($dictId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
	
	/**
	 * patch: 上调一位
	 * path: moveup/{dictId}
	 * method: moveup
	 * param: dictId - {int} 字典id
	 */
	public function moveup($dictId) {
		$dict = model('Dict');
		$rst = $dict->moveUp($dictId);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('上移失败失败');
		}
	}
	
	/**
	 * patch: 下调一位
	 * path: movedown/{dictId}
	 * method: movedown
	 * param: dictId - {int} 字典id
	 */
	public function movedown($dictId) {
		$dict = model('Dict');
		$rst = $dict->moveDown($dictId);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('下移失败失败');
		}
	}
}