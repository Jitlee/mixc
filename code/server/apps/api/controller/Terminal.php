<?php
namespace app\api\controller;

/**
 * swagger: 终端
 */
class Terminal {
	/**
	 * get: 获取终端列表
	 * path: lst/{clientId}
	 * method: lst
	 * param: clientId - {int} 客户id
	 */
	public function lst($clientId = 0, $pageNo = 1) {
		$db = model('Terminal');
		$list = $db->_query($clientId, $pageNo);
		return success($list);
	}
	
	/**
	 * post: 保存终端
	 * path: save
	 * method: save
	 * param: tmlId - {int} = 0 终端id(新增的时候为0)
	 * param: clientId - {int}  客户id
	 * param: tmlName - {string} = '' 终端名称
	 * param: tmlBrand - {string} = '' 终端品牌
	 * param: tmlModel - {string} = '' 终端型号
	 * param: tmlMac - {string} = '' 终端MAC地址
	 * param: tmlIp - {string} = '' 终端IP地址
	 * param: tmlDesc - {string} = '' 终端描述字段
	 * param: shutdownTime - {int} = 0 关机时间(时:分)
	 * param: adsTime - {int} = 0 开始播放广告时间(分钟)
	 */
	public function save() {
		$db = model('Terminal');
		$rst = $db->_save();
		if($rst < 0) {
			return fail('保存失败');
		}
		return success(true, '保存成功');
	}
	
	/**
	 * post: 终端心跳
	 * path: active/{releaseSourceId}
	 * method: active
	 * param: releaseSourceId - {int} 版本id
	 * param: code - {string} = '' 终端机器码
	 * param: mac - {string} = '' 终端MAC地址
	 * param: ip - {string} = '' 终端IP地址
	 */
	public function active($releaseSourceId = 1) {
		$db = model('Terminal');
		$rst = $db->_active($releaseSourceId);
		if($rst < 0) {
			return fail("心跳失败");
		}
		return success($rst, '心跳成功');
	}
	
	/**
	 * delete: 删除终端
	 * path: delete/{tmlId}
	 * method: delete
	 * param: tmlId - {int} 终端id
	 */
	public function delete($tmlId = 0) {
		$db = model('Terminal');
		if($db->_delete($tmlId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
	
	/**
	 * patch: 修改客户端名称
	 * path: name
	 * method: name
	 * param: code - {string} 终端id
	 * param: name - {string} 终端名称
	 */
	public function name() {
		$db = model('Terminal');
		if($db->_name() > -1) {
			return success(true, '修改成功');
		} else {
			return fail("修改失败");
		}
	}
	
	/**
	 * patch: 客户端注册
	 * path: register
	 * method: register
	 * param: code - {string} 终端id
	 * param: sn - {string} 终端id
	 */
	public function register() {
		$db = model('Terminal');
		if($db->_register() > -1) {
			return success(true, '注册成功');
		} else {
			return fail("注册失败");
		}
	}
}