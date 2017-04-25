<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 用户
class User extends Model
{
	protected $type = [
        'isEnabled'  	=>  'boolean',
        'uid'		  	=> 'integer',
        'clientId'		=> 'integer'
    ];
    
	public function _query($clientId = 0, $pageNo = 1) {
		$db = $this->alias('u')
			->field('u.uid, u.display_name displayName, u.username, i.true_name trueName, i.phone, i.tel, i.email, i.sex, i.remark, (is_enabled = \'Y\') isEnabled')
			->join('__USER_INFO__ i', 'u.uid = i.uid')->where('is_deleted', 'N');
			
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		if($keywords != '') {
			if(preg_match('/^1\d+$/', $keywords)) {
				$db = $db->where('i.phone', $keywords);
			} else if(preg_match('/^\w+$/', $keywords)) {
				$db = $db->where('u.username','like',$keywords.'%');
			} else {
				$db = $db->where('u.display_name','like','%'.$keywords.'%')
	    				->whereOr('i.true_name','like','%'.$keywords.'%');
			}
		}
		
		$list =  $db
			->where('is_deleted', 'N')
			->where('u.client_id', $clientId)
			->order('u.create_time desc')
			->page($pageNo, config('page_size'))->select();
		
		$db = $this->alias('u')
			->join('__USER_INFO__ i', 'u.uid = i.uid')
			->where('is_deleted', 'N')
			->where('u.client_id', $clientId);
			
		if($keywords != '') {
			if(preg_match('/^1\d+$/', $keywords)) {
				$db = $db->where('i.phone', $keywords);
			} else if(preg_match('/^\w+$/', $keywords)) {
				$db = $db->where('u.username','like',$keywords.'%');
			} else {
				$db = $db->where('u.display_name','like','%'.$keywords.'%')
	    				->whereOr('i.true_name','like','%'.$keywords.'%');
			}
		}
		
		$total = $db
			->where('is_deleted', 'N')
			->where('u.client_id', $clientId)
			->count();
			
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _save() {
		$request = Request::instance();
		$uid = (int)$request->post('uid');
		$username = $request->post('username');
		$userdata = [
			'display_name' => $request->post('displayName')
		];
		
		$userinfo = [
			'true_name'		=> $request->post('trueName'),
			'phone'			=> $request->post('phone'),
			'tel'			=> $request->post('tel'),
			'email'			=> $request->post('email'),
			'sex'			=> $request->post('sex'),
			'remark'			=> $request->post('remark'),
		];
		
		if($uid == 0 && $this->checkUsername($username)) {
			return -2;
		}
		
		// 启动事务
		Db::startTrans();
		try{
		    if($uid == 0) {
		    		$defaultPassword = config('default_password');
				$userdata['username'] = strtolower($request->post('username'));
				$userdata['client_id'] = strtolower($request->post('clientId'));
				$userdata['password'] = md5($userdata['username'].md5($defaultPassword));
		    		$this->insert($userdata);
		    		$userinfo['uid'] = $this->getLastInsID();
		    		Db::table('__USER_INFO__')->insert($userinfo);
			    // 提交事务
			    Db::commit();
			    return 1;
		    } else {
		    		$this->where('uid', $uid)->update($userdata);
		    		Db::table('__USER_INFO__')->where('uid', $uid)->update($userinfo);
			    // 提交事务
			    Db::commit();
			    return 0;
		    }
		} catch (\Exception $e) {
		    // 回滚事务
//		    echo dump($e);
		    Db::rollback();
		    return -1;
		}
	}
	
	public function checkUsername($username) {
		return $this->where('username', $username)->count() > 0;
	}
	
	public function enable($uid = 0, $isEabled = false) {
		$this->where('uid', $uid)->update(['is_enabled' => $isEabled ? 'Y' : 'N']);
	}
	
	public function _delete($uid = 0) {
		try{
			$this->where('uid', $uid)->update(['is_enabled' => 'Y']);
			return true;
		} catch (\Exception $e) {
		    return false;
		}
	}
	
	public function changePassword($uid = 0) {
		$request = Request::instance();
		$oldPassword = $request->patch('oldPassword');
		$newPassword = $request->patch('newPassword');
		
		$user = $this->field('username, password')->where('uid', $uid)->find();
		if(empty($user)) {
			return -2;	
		}
		
		if(md5(strtolower($user['username']).$oldPassword) != $user['password']) {
			return -3;
		}
		
		try{
			$this->where('uid', $uid)->update(['password' => md5(strtolower($user['username']).$newPassword)]);
			return 0;
		} catch (\Exception $e) {
//			echo dump($e);
		    return -1;
		}
	}
	
	public function login() {
		$request = Request::instance();
		$username = $request->post('username');
		$password = $request->post('password');
		$password = md5(strtolower($username).$password);
		$user = $this->alias('u')
			->field('u.uid, u.display_name displayName, u.username, (is_enabled = \'Y\') isEnabled, u.client_id clientId')
			->where('is_deleted', 'N')
			->where('username', strtolower($username))
			->where('password', $password)->find();
		if(empty($user)) {
			return -1;
		}
		
		if(!$user['isEnabled']) {
			return -2;
		}
		
		$uid = $user['uid'];
		$clientId = $user['clientId'];
		
		unset($user['isEnabled']);
		unset($user['clientId']);
		
		if($clientId == 0) {
			$user['role'] = 1024; // 超级管理员
			return [
				'user' => $user,
				'client' => null
			];
		}
		
		$client = Db::table('__CLIENT__')->alias('c')
			->field('c.client_id clientId, admin_id adminId, c.client_type clientType, c.client_name clientName')
			->field('f.file_path clientLogo')
			->join('__FILE__ f', 'f.file_key = c.client_logo and f.file_type = 4')
			->where('c.is_enabled', 'Y')
			->where('c.client_id', $clientId)->find();
		
		if(empty($client)) {
			return -3;
		}	
		
		$role = 2;
		$clientType = $client['clientType'];
		switch($clientType) {
			case 'N': // 独栋
				$rloe = 2;
				$build = Db::table('__BUILD__')->alias('b')
					->field('build_id buildId, build_name buildName')
					->join('__SCENE__ s', 'b.scene_id = b.scene_id')
					->where('s.is_default', 'Y')
					->where('b.is_default', 'Y')
					->where('s.client_id', $clientId)->find();
				if(empty($build)) {
					return -4;
				}
				$client['defaultBuildId'] = $build['buildId'];
				$client['defaultBuildName'] = $build['buildName'];
				break;
			case 'M': // 多栋
				$role = 4;
				$scene = Db::table('__SCENE__')->alias('s')
					->field('scene_id sceneId, scene_name sceneName')
					->where('s.is_default', 'Y')
					->where('s.client_id', $clientId)->find();
				if(empty($build)) {
					return -5;
				}
				if(!empty($scene)) {
					$client['defaultSceneId'] = $scene['sceneId'];
					$client['defaultSceneName'] = $scene['sceneName'];
				}
				break;
			case 'S':
				$role = 8;
				break;
			default:
				break;
		}
		
		if($client['adminId'] == $uid) {
			$role += 512; // 客户管理员
		}
		
		unset($client['clientType']);
		unset($client['adminId']);
		
		$user['role'] = $role;
		
		return [
			'user' => $user,
			'client' => $client
		];
	}
}
?>