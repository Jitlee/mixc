<?php
namespace app\api\controller;

/**
 * swagger: 商家
 */
class Shop {
	
	/**
	 * get: 获取商家列表
	 * path: all/{clientId}
	 * method: all
	 * param: clientId - {int} 客户id
	 */
	public function all($clientId = 0) {
		$db = model('Shop');
		$list = $db->_all($clientId);
		return success($list);
	}
	
	/**
	 * get: 获取商家列表
	 * path: getall/{clientId}
	 * method: getall
	 * param: clientId - {int} 客户id
	 */
	public function getall($clientId = 0) {
		$db = model('Shop');
		$list = $db->_getall($clientId);
		return success($list);
	}
	
	/**
	 * get: 获取商家列表
	 * path: lst/{clientId}/{pageNo}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: pageNo - {int} 页码，从1开始
	 * param: shopName - {string} = '' 店铺名称
	 * param: shopType - {string} = '' 店铺类型
	 * param: floorId - {string} = '' 所在楼层id
	 */
	public function lst($clientId = 0, $pageNo = 1) {
		$db = model('Shop');
		$list = $db->_query($clientId, $pageNo);
		return success($list);
	}
	
	/**
	 * get: 获取商铺信息
	 * path: info/{shopId}
	 * method: info
	 * param: shopId - {int} 商铺id
	 */
	public function info($shopId) {
		$shop = model('Shop');
		$data = $shop->_get($shopId);
		return success($data);
	}
	
	/**
	 * post: 保存商家
	 * path: save
	 * method: save
	 * param: shopId - {int} = 0 商家id(新增的时候为0)
	 * param: shopName - {string} = '' 商家名
	 * param: shopEnName - {string} = '' 商家英文名
	 * param: shopIndex - {string} = '' 商家索引(A-Z0-9)
	 * param: shopType - {int} = '' 商家类型
	 * param: shopIcon - {string} = '' 商家图标
	 * param: shopImage - {string} = '' 商家图片
	 * param: shopNavKey - {string} = '' 商家导航图片
	 * param: shopDesc - {string} = '' 商家描述
	 * param: clientId - {int} = '' 客户id
	 * param: shopTel - {string} = '' 商铺电话
	 * param: shopUrl - {string} = '' 商铺网址
	 * param: serviceStartTime - {int} = 0 服务开始时间(按分钟算)
	 * param: serviceEndTime - {int} = 0 服务结束时间(按分钟算)
	 * param: shopQRCode - {string} = '' 商铺二维码
	 * param: shopIntroduction - {string} = '' 商铺简介
	 */
	public function save() {
		$shop = model('Shop');
		$rst = $shop->_save();
		if($rst < 0) {
			return fail('保存失败');
		}
		return success(['shopId' => $rst], '保存成功');
	}
	
	/**
	 * patch: 调整商家顺序
	 * path: move/{clientId}/{shopId}/{sort}
	 * method: move
	 * param: clientId - {int} 客户Id
	 * param: shopId - {int} 商家Id
	 * param: sort - {int} 新的排名
	 */
	public function move($clientId = 0, $shopId = 0, $sort = 0) {
		$db = model('Shop');
		if($db->move($clientId, $shopId, $sort - 1) == true) {
			return success(true);
		} else {
			return fail("设置排名失败");
		}
	}
	
	/**
	 * delete: 删除商家
	 * path: delete/{shopId}
	 * method: delete
	 * param: shopId - {int} 商家Id
	 */
	public function delete($shopId = 0) {
		$shop = model('Shop');
		if($shop->_delete($shopId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}