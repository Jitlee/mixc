<?php
namespace app\api\controller;

/**
 * swagger: 文章
 */
class Article {
	/**
	 * get: 获取文章列表
	 * path: lst/{clientId}/{group}
	 * method: lst
	 * param: clientId - {int} 客户id
	 * param: group - {int} 文章类型
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($clientId = 0, $group = 0, $pageNo = 1) {
		$db = model('Article');
		$list = $db->_query($clientId, $group, $pageNo);
		return success($list);
	}
	
	/**
	 * get: 获取文章列表
	 * path: all/{clientId}
	 * method: all
	 * param: clientId - {int} 客户id
	 */
	public function all($clientId = 0) {
		$db = model('Article');
		$list = $db->_all($clientId);
		return success($list);
	}
	
	/**
	 * get: 获取文章列表
	 * path: getall/{clientId}
	 * method: getall
	 * param: clientId - {int} 客户id
	 */
	public function getall($clientId = 0) {
		$db = model('Article');
		$list = $db->_getall($clientId);
		return success($list);
	}
	
	/**
	 * get: 获取文章列表
	 * path: info/{articleId}
	 * method: info
	 * param: articleId - {int} 文章id
	 */
	public function info($articleId = 0) {
		$db = model('Article');
		$list = $db->_get($articleId);
		return success($list);
	}
	
	/**
	 * post: 保存文章
	 * path: save
	 * method: save
	 * param: articleId - {int} = 0 文章id(新增的时候为0)
	 * param: clientId - {int}  客户id
	 * param: articleGroupId - {int} 分组Id
	 * param: articleTitle - {string} = '' 文章标题
	 * param: articleContent - {string} = '' 商家简介
	 */
	public function save() {
		$db = model('Article');
		$rst = $db->_save();
		if($rst < 0) {
			return fail('保存失败');
		}
		return success(true, '保存成功');
	}
	
	/**
	 * delete: 删除文章
	 * path: delete/{articleId}
	 * method: delete
	 * param: articleId - {int} 文章id
	 */
	public function delete($articleId = 0) {
		$db = model('Article');
		if($db->_delete($articleId)) {
			return success(true, '删除成功');
		} else {
			return fail("删除失败");
		}
	}
}