<?php
namespace app\api\controller;

/**
 * swagger: 广告
 */
class Ads {
	/**
	 * get: 获取广告列表
	 * path: lst/{clientId}/{type}/{group}/{pageNo}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: type - {int} = [0|1] 广告类型(0, 当前广告，1.已结束广告)
	 * param: group - {int} 分组id
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($clientId = 0, $type = 0, $group, $pageNo = 1) {
		$db = model('Ads');
		$list = $db->_query($clientId, $type, $group, $pageNo);
		return success($list);
	}
	
	/**
	 * get: 获取广告列表
	 * path: getall/{clientId}
	 * method: getall
	 * param: clientId - {int} 客户id
	 */
	public function getall($clientId = 0) {
		$db = model('Ads');
		$list = $db->_getall($clientId);
		return success($list);
	}
	
	/**
	 * post: 保存广告
	 * path: save
	 * method: save
	 * param: adsId - {int} = 0 广告id(新增的时候为0)
	 * param: clientId - {int}  客户id
	 * param: adsTargetType - {int}  目标类型
	 * param: adsTargetId - {int}  目标id
	 * param: adsColor - {string}  广告背景色
	 * param: adsStretch - {string} = [A|B|C]  广告背景填充(A：剪裁填充，B：刚好填充, C:拉伸填充,D：原始大小)
	 * param: adsTitle - {string} = '' 广告标题
	 * param: adsFileKey - {string} = '' 广告图片
	 * param: adsStartDate - {number} = '' 广告起始日期
	 * param: adsEndDate - {number} = '' 广告结束日期
	 */
	public function save() {
		$db = model('Ads');
		$rst = $db->_save();
		if($rst < 0) {
			return fail('保存失败');
		}
		return success(true, '保存成功');
	}
	
	/**
	 * delete: 删除广告
	 * path: delete/{adsId}
	 * method: delete
	 * param: adsId - {int} 广告id
	 */
	public function delete($adsId = 0) {
		$db = model('Ads');
		if($db->_delete($adsId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}