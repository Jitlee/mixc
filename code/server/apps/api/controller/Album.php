<?php
namespace app\api\controller;

/**
 * swagger: 相册管理
 */
class Album {
	/**
	 * get: 获取相册
	 * path: lst/{clientId}/{albumType}/{objId}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: albumType - {string} 相册类型
	 * param: objId - {int} 对象id
	 */
	public function lst($clientId = 0, $albumType = '', $objId = 0) {
		$db = model('Album');
		$list = $db->_query($clientId, $albumType, $objId);
		return success($list);
	}
	
	/**
	 * get: 获取所有相册
	 * path: all/{clientId}
	 * method: all
	 * param: clientId - {int} 客户id
	 */
	public function all($clientId = 0) {
		$db = model('Album');
		$list = $db->_getall($clientId);
		return success($list);
	}
	
	/**
	 * post: 保存相册
	 * path: save
	 * method: save
	 * param: clientId - {int} 客户id
	 * param: albumType - {string} 相册类型
	 * param: objId - {int} 对象Id
	 * param: fileKey - {string} 文件Key
	 */
	public function save() {
	    $db = model('Album');
	    if($db->_save() == 0) {
	    		return success(true, '保存相册成功');
	    } else {
	    		return fail('保存相册失败');
	    }
	}
	
	/**
	 * delete: 删除相册
	 * path: delete/{albumType}/{objId}/{fileKey}
	 * param: albumType - {string} 相册类型
	 * param: objId - {int} 对象Id
	 * param: fileKey - {string} 文件Key
	 */
	public function delete($albumType, $objId, $fileKey) {
		$db = model('Album');
		if($db->_delete($albumType, $objId, $fileKey) == 0) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
	
	/**
	 * patch: 上调一个顺序
	 * path: moveup/{albumType}/{objId}/{fileKey}
	 * param: albumType - {string} 相册类型
	 * param: objId - {int} 对象Id
	 * param: fileKey - {string} 文件Key
	 */
	public function moveup($albumType, $objId, $fileKey) {
		$album = model('Album');
		$rst = $album->moveUp($albumType, $objId, $fileKey);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('上移失败失败');
		}
	}
	
	/**
	 * patch: 下调一个顺序
	 * path: movedown/{albumType}/{objId}/{fileKey}
	 * param: albumType - {string} 相册类型
	 * param: objId - {int} 对象Id
	 * param: fileKey - {string} 文件Key
	 */
	public function movedown($albumType, $objId, $fileKey) {
		$album = model('Album');
		$rst = $album->moveDown($albumType, $objId, $fileKey);
		if($rst == 0) {
			return success(true);
		} else {
			return fail('下移失败失败');
		}
	}
}
?>