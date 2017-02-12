<?php
namespace app\api\controller;

/**
 * swagger: 房间
 */
class Room {
	/**
	 * get: 获取房间列表
	 * path: lst/{floorId}
	 * method: lst
	 * param: floorId - {int} 层id
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($floorId = 0) {
		$db = model('Room');
		$list = $db->_query($floorId);
		return success($list);
	}
	
	/**
	 * post: 保存房间
	 * path: save
	 * method: save
	 * param: floorId - {int} 层id
	 * param: roomId - {int} = 0 房间id(新增的时候为0)
	 * param: roomName - {string} = '' 房间名
	 * param: shopId - {int} = 0 商铺id
	 * param: x - {int} = '' x坐标(像素)
	 * param: y - {int} = '' y坐标(像素)
	 */
	public function save() {
		$db = model('Room');
		$rst = $db->_save();
		if($rst == 0) {
			return success(true, '保存成功');
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除房间
	 * path: delete/{roomId}
	 * method: delete
	 * param: roomId - {int} 房间Id
	 */
	public function delete($roomId = 0) {
		$db = model('Room');
		if($db->_delete($roomId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}