<?php
namespace app\api\controller;

/**
 * swagger: 用户
 */
class User {
	/**
	 * get: 获取用户列表
	 * path: lst/{pageNo}
	 * method: lst
	 * param: pageNo - {int} 页码，从1开始
	 * param: keywords - {string} = '' 关键字
	 */
	public function lst($pageNo = 1) {
		$user = model('User');
		$list = $user->_query($pageNo);
		return success($list);
	}
	
	/**
	 * post: 保存用户
	 * path: save
	 * method: save
	 * param: uid - {int} = 0 用户id(新增的时候为0)
	 * param: username - {string} = '' 用户名
	 * param: displayName - {string} = '' 显示名称
	 * param: trueName - {string} = '' 真实名称
	 * param: clientId - {int} = 0 客户id
	 * param: phone - {string} = '' 手机
	 * param: tel - {string} = '' 电话
	 * param: email - {string} = '' 邮件
	 * param: sex - {string} = [-|M|F] 性别(-:保密，M:男，F:女)
	 * param: remark - {string} = '' 备注
	 */
	public function save() {
		$user = model('User');
		$rst = $user->_save();
		if($rst == 0) {
			return success(true, '保存成功');
		} else if($rst == 1) {
			return success(true, '用户已添加，默认密码［'.config('default_password').'］');
		} else if($rst == -2) {
			return fail('用户名重复');
		} else {
			return fail('保存失败');
		}
	}
	
	/**
	 * patch: 启用／停用设置
	 * path: enable/{uid}/{enabled}
	 * method: enable
	 * param: uid - {int} 用户id
	 * param: enabled - {int} 0停用，1启用
	 */
	public function enable($uid = 0, $enabled = 0) {
		$user = model('User');
		$user->enable($uid, $enabled == 1);
		return success(true);
	}
	
	/**
	 * delete: 删除用户
	 * path: delete/{uid}
	 * method: delete
	 * param: uid - {int} 用户id
	 */
	public function delete($uid = 0) {
		$user = model('User');
		if($user->_delete($uid, 'N')) {
			return success(true, '删除成功');
		} else {
			return fail('删除失败');
		}
	}
	
	/**
	 * patch: 修改密码
	 * path: password/{uid}
	 * method: password
	 * param: uid - {int} 用户id
	 * param: oldPassword - {string} 旧密码
	 * param: newPassword - {string} 新密码
	 */
	public function password($uid = 0) {
		$user = model('User');
		$rst = $user->changePassword($uid);
		if($rst == 0) {
			return success(true);
		} else if($rst == -2) {
			return fail('用户不存在');
		} else if($rst == -3) {
			return fail('旧密码不正确');
		} else {
			return fail('修改密码失败');
		}
	}
}