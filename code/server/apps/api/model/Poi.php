<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 兴趣点
class Poi extends Model
{
	protected $type = [
        'poiId'  		=>  'integer',
        'clientId'  		=>  'integer',
        'floorId'  		=>  'integer',
        'poiType'  		=>  'integer',
    ];
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
	
	public function _getall($clientId = 0) {
		
		$list = Db::query('select p.poi_id poiId, p.floor_id floorId, p.poi_name poiName, p.x, p.y,
			f.file_path poiIcon, d.can_delete poiType
			from mixc_poi p inner join mixc_dict d on d.dict_id = p.poi_type
			inner join mixc_file f on f.file_key = d.dict_icon
			where exists(
				select 0 from mixc_floor fr
				inner join mixc_build b on b.build_id = fr.build_id and b.is_default = \'Y\'
				inner join mixc_scene s on s.scene_id = b.scene_id and s.is_default = \'Y\'
				where fr.floor_id = p.floor_id and s.client_id = ?
			)', [$clientId]);
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
	
	public function _savePosition($poiId, $x, $y) {
		$data = [
			'x' 		=> $x,
			'y' 		=> $y
		];
		
		if($this->where('poi_id', $poiId)->update($data)) {
			return 0;
		}
		return -1;
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