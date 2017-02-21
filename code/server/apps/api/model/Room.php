<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 房间
class Room extends Model
{
	public function _query($floorId = 0) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('r')
			->field('floor_id floorId, room_id roomId, room_name roomName, x, y')
			->field('r.shop_id shopId, s.shop_name shopName')
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
		$roomdata = [
			'room_name' 		=> $request->post('roomName'),
			'shop_id' 		=> $request->post('shopId'),
			'x' 		=> $request->post('x'),
			'y' 		=> $request->post('y')
		];
		try {
			if($roomId == 0) {
				$roomdata['floor_id'] = (int)$request->post('floorId');
				$this->insert($roomdata);
			} else {
				$this->where('room_id', $roomId)->update($roomdata);
			}
			return 0;
		} catch(\Exception $e) {
			return -1;
		}
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