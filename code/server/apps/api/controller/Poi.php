<?php
namespace app\api\controller;

/**
 * swagger: 兴趣点
 */
class Poi {
	/**
	 * get: 获取兴趣点列表
	 * path: lst/{floorId}
	 * method: lst
	 * param: floorId - {int} 层id
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($floorId = 0) {
		$db = model('Poi');
		$list = $db->_query($floorId);
		return success($list);
	}
	
	/**
	 * post: 保存兴趣点
	 * path: save
	 * method: save
	 * param: floorId - {int} 层id
	 * param: poiId - {int} = 0 兴趣点id(新增的时候为0)
	 * param: poiName - {string} = '' 兴趣点名
	 * param: poiType - {int} 兴趣类型
	 * param: x - {int} = 0 x坐标(像素)
	 * param: y - {int} = 0 y坐标(像素)
	 */
	public function save() {
		$db = model('Poi');
		$rst = $db->_save();
		if($rst == 0) {
			return success(true, '保存成功');
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * delete: 删除兴趣点
	 * path: delete/{poiId}
	 * method: delete
	 * param: poiId - {int} 兴趣点Id
	 */
	public function delete($poiId = 0) {
		$db = model('Poi');
		if($db->_delete($poiId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}