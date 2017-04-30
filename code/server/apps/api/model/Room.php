<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 房间
class Room extends Model
{
	protected $type = [
        'shopId'  	=>  'integer',
        'roomId'  	=>  'integer',
        'floorId'  	=>  'integer',
        'x'  	=>  'integer',
        'y'  	=>  'integer',
    ];
    
	public function _query($floorId = 0) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('r')
			->field('floor_id floorId, room_id roomId, room_name roomName, x, y')
			->field('r.shop_id shopId, s.shop_name shopName, f_get_shop_position(s.shop_id) shopPosition')
			->join('__SHOP__ s', 's.shop_id = r.shop_id', 'left');
			
		if($keywords != '') {
			$db = $db->where('room_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('floor_id', $floorId)->where('r.is_deleted', 'N')->order('r.create_time asc')->select();
//		echo $this->getLastSql();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$roomId = (int)$request->post('roomId');
		$floorId = (int)$request->post('floorId');
		$roomdata = [
			'room_name' 		=> $request->post('roomName'),
			'shop_id' 		=> $request->post('shopId'),
			'x' 		=> $request->post('x'),
			'y' 		=> $request->post('y')
		];
		
		if($roomId == 0) {
			$exists = db::table('__ROOM__')
				->where('room_name', $roomdata['room_name'])
				->where('floor_id', $floorId)->find();
			if($exists) {
				return -2;
			}
		} else {
			$exists = db::table('__ROOM__')
				->where('room_name', $roomdata['room_name'])
				->where('room_id', 'neq', $roomId)
				->where('floor_id', $floorId)->find();
			if($exists) {
				return -2;
			}
		}
		
		try {
			if($roomId == 0) {
				$roomdata['floor_id'] = $floorId;
				$this->insert($roomdata);
			} else {
				$this->where('room_id', $roomId)->update($roomdata);
			}
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	public function _savePosition($roomId, $x, $y) {
		$roomdata = [
			'x' 		=> $x,
			'y' 		=> $y
		];
		
		if($this->where('room_id', $roomId)->update($roomdata)) {
			return 0;
		}
		return -1;
	}
	
	public function _delete($roomId = 0) {
		try{
			$this->where('room_id', $roomId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>