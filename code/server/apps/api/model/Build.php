<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 楼层
class Build extends Model
{
	public function _query($sceneId = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this
			->field('build_id buildId, scene_id sceneId, build_name buildName, build_desc buildDesc');
			
		if($keywords != '') {
			$db = $db->where('build_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('scene_id', $sceneId)->where('is_deleted', 'N')->order('create_time desc')
			->page($pageNo, config('page_size'))->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$buildId = (int)$request->post('buildId');
		$builddata = [
			'build_name' 		=> $request->post('buildName'),
			'build_desc' 		=> $request->post('buildDesc', 0)
		];
		try {
			if($buildId == 0) {
				$builddata['scene_id'] = (int)$request->post('sceneId');
				$this->insert($builddata);
			} else {
				$this->where('build_id', $buildId)->update($builddata);
			}
			return 0;
		} catch(\Exception $e) {
			return -1;
		}
	}
	
	public function _delete($buildId = 0) {
		try{
			$this->where('build_id', $buildId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>