<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 场景
class Scene extends Model
{
	protected $type = [
        'sceneId'  		=>  'integer',
        'clientId'  		=>  'integer',
        'shutdownTime'  		=>  'integer',
        'adsTime'  		=>  'integer',
    ];
	public function _query($clientId = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this
			->field('scene_id sceneId, scene_name sceneName, scene_desc sceneDesc, client_id clientId');
			
		if($keywords != '') {
			$db = $db->where('scene_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('client_id', $clientId)->where('is_delete', 'N')->order('create_time desc')
			->page($pageNo, config('page_size'))->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$sceneId = (int)$request->post('sceneId');
		$scenedata = [
			'scene_name' 		=> $request->post('sceneName'),
			'scene_desc' 		=> $request->post('sceneDesc', 0)
		];
		try {
			if($sceneId == 0) {
				$scenedata['client_id'] = (int)$request->post('clientId');
				$this->insert($scenedata);
			} else {
				$this->where('scene_id', $sceneId)->update($scenedata);
			}
			return 0;
		} catch(\Exception $e) {
			return -1;
		}
	}
	
	public function _delete($sceneId = 0) {
		try{
			$this->where('scene_id', $sceneId)->update(['is_deleted'=>'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
	
	public function getLastVersion($sceneId) {
		$new = $this->alias('s')
			->field('first_version, second_version, thrid_version + 1 thrid_version')
			->where('scene_id', $sceneId)->find();
		$firstVersion = (int)$new['first_version'];
		$secondVersion = (int)$new['second_version'];
		$thridVersion = (int)$new['thrid_version'];
		
		if(!($firstVersion >= 0 && $secondVersion >= 0 && $thridVersion > 0)) {
			return null;
		}
		
		return [$firstVersion, $secondVersion, $thridVersion];
	}
	
	public function _setting($clientId) {
		try{
			$data = $this->field('scene_name, scene_id')->where('client_id', $clientId)->where('is_default', 'Y')->find();
			$sceneName = $data['scene_name'];
			$sceneId = $data['scene_id'];
			$data = Db::table('__BUILD__')->field('build_name, city')->where('scene_id', $sceneId)->where('is_default', 'Y')->find();
			$buildName = $data['build_name'];
			$city = $data['city'];
			return ['scene_name' => $sceneName, 'build_name' => $buildName, 'city' => $city];
		} catch (\Exception $e) {
		    echo dump($e);
		    return -1;
		}
	}
	
	public function setting($clientId) {
		$request = Request::instance();
		$sceneName = $request->patch('sceneName');
		$buildName = $request->patch('buildName');
		$city = $request->patch('city');
		// 启动事务
		Db::startTrans();
		try{
			$data = $this->field('scene_id')->where('client_id', $clientId)->where('is_default', 'Y')->find();
			$sceneId = $data['scene_id'];
			$this->where('client_id', $clientId)->where('is_default', 'Y')->update(['scene_name' => $sceneName]);
			Db::table('__BUILD__')->where('scene_id', $sceneId)->where('is_default', 'Y')->update(['build_name' => $buildName, 'city' => $city]);
		    // 提交事务
			Db::commit();
			return 0;
		} catch (\Exception $e) {
		    // 回滚事务
//		    echo dump($e);
		    Db::rollback();
		    return -1;
		}
	}
	
	public function getdefault($clientId) {
		$data = $this->field('shutdown_time shutdownTime, ads_time adsTime, password')->where('client_id', $clientId)->where('is_default', 'Y')->find();
		if(empty($data)) {
			return;
		}
		return $data;
	}
	
	public function setshutdown($clientId, $time) {
		try{
			$this->where('client_id', $clientId)->where('is_default', 'Y')->update(['shutdown_time' => $time]);
			return 0;
		} catch (\Exception $e) {
		    // 回滚事务
		    return -1;
		}
	}
	
	public function setadstime($clientId, $time) {
		try{
			$this->where('client_id', $clientId)->where('is_default', 'Y')->update(['ads_time' => $time]);
			return 0;
		} catch (\Exception $e) {
		    // 回滚事务
		    return -1;
		}
	}
	
	public function setpassword($clientId, $password) {
		try{
			$this->where('client_id', $clientId)->where('is_default', 'Y')->update(['password' => $password]);
			return 0;
		} catch (\Exception $e) {
		    // 回滚事务
		    return -1;
		}
	}
}
?>