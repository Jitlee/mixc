<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 客户
class Scene extends Model
{
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
}
?>