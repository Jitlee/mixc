<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 兴趣点
class Poi extends Model
{
	public function _query($floorId = 0) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('f')
			->field('floor_id floorId, poi_id poiId, poi_name poiName, x, y, poi_type poiType, dict_value poiTypeText')
			->join('__DICT__ d', 'f.poi_type = d.dict_id');
			
		if($keywords != '') {
			$db = $db->where('poi_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('floor_id', $floorId)->where('is_deleted', 'N')->order('f.create_time asc')->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$poiId = (int)$request->post('poiId');
		$poidata = [
			'poi_name' 		=> $request->post('poiName'),
			'x' 		=> $request->post('x'),
			'y' 		=> $request->post('y'),
			'poi_type' => $request->post('poiType')
		];
		try {
			if($poiId == 0) {
				$poidata['floor_id'] = (int)$request->post('floorId');
				$this->insert($poidata);
			} else {
				$this->where('poi_id', $poiId)->update($poidata);
			}
			return 0;
		} catch(\Exception $e) {
			return -1;
		}
	}
	
	public function _delete($poiId = 0) {
		try{
			$this->where('poi_id', $poiId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>