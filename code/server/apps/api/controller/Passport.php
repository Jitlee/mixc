<?php
namespace app\api\controller;

/**
 * swagger: 身份验证
 */
class Passport {
	/**
	 * post: 登录
	 * path: login
	 * method: login
	 * param: username - {string} 用户名
	 * param: password - {string} 密码
	 */
	public function login() {
		$db = model('User');
		$rst = $db->login();
		if($rst == -1) {
			return fail('用户名或密码不正确');
		} else if($rst == -2){
			return fail('账户已停用');
		} else if($rst < 0){
			return fail('账户数据异常:'.$rst);
		} else {
			session('profile', $rst);
			return success($rst);
		}
	}
	
	/**
	 * post: 登出
	 * path: logout
	 * method: logout
	 */
	public function logout() {
		session('profile', null);
		return sucess(true);
	}
}