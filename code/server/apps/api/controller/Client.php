<?php
namespace app\api\controller;

/**
 * swagger: 客户
 */
class Client {
	/**
	 * get: 获取客户列表
	 * path: lst/{pageNo}
	 * method: lst
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($pageNo = 1) {
		$client = model('Client');
		$list = $client->_query($pageNo);
		return success($list);
	}
	
	/**
	 * post: 保存客户
	 * path: save
	 * method: save
	 * param: clientId - {int} = 0 客户id(新增的时候为0)
	 * param: clientName - {string} = '' 客户名
	 * param: clientLogo - {string} = '' 客户logo
	 * param: clientAddr - {string} = '' 客户地址
	 * param: clientContact - {string} = '' 联系人
	 * param: clientTel - {int} = '' 联系电话
	 * param: clientPhone - {string} = '' 手机
	 * param: clientDesc - {string} = '' 备注
	 */
	public function save() {
		$client = model('Client');
		$rst = $client->_save();
		if($rst == 0) {
			return success(true);
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * patch: 修改客户状态
	 * path: state/{clientId}
	 * method: state
	 * param: clientId - {int} 客户Id
	 * param: clientId - {int} 客户Id
	 */
	public function state($clientId = 0, $state = false) {
		$client = model('Client');
		if($client->changeState($clientId, $state == true ? 'Y' : 'N')) {
			return success(true);
		} else {
			return fail("修改失败");
		}
	}
}