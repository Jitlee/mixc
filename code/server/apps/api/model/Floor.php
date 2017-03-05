<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 楼层
class Floor extends Model
{
	public function _query($buildId = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('fr')
			->field('fr.build_id buildId, fr.floor_id floorId, fr.floor_name floorName, floor_alias floorAlias, floor_en floorEn, floor_tags floorTags')
			->field('fr.nav_file_key navFileKey, f.file_path navFilePath')
			->join('__FILE__ f', 'f.file_key = fr.nav_file_key and f.file_type = 8');
			
		if($keywords != '') {
			$db = $db->where('fr.floor_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('fr.build_id', $buildId)->where('fr.is_deleted', 'N')->order('fr.floor_sort asc')
			->page($pageNo, config('page_size'))->select();
		
		$db =  $this->where('build_id', $buildId)->where('is_deleted', 'N');
		if($keywords != '') {
			$db = $db->where('floor_name','like','%'.$keywords.'%');
		}
		$total =  $db->count();
			
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _all($buildId = 0) {
		$list = $this->alias('fr')
			->field('fr.build_id buildId, fr.floor_id floorId, fr.floor_name floorName, floor_alias floorAlias, floor_en floorEn')
			->where('fr.build_id', $buildId)->where('fr.is_deleted', 'N')->order('fr.floor_sort asc')
			->select();
		return $list;
	}
	
	public function _getall($buildId = 0) {
		$list = $this->alias('fr')
			->field('fr.build_id buildId, fr.floor_id floorId, fr.floor_name floorName, floor_alias floorAlias, floor_en floorEn, floor_tags floorTags')
			->field('fr.nav_file_key navFileKey, f.file_path navFilePath')
			->join('__FILE__ f', 'f.file_key = fr.nav_file_key and f.file_type = 8')
			->where('fr.is_deleted', 'N')
			->where('build_id', $buildId)
			->order('fr.floor_sort asc')->select();
			
		foreach($list as $floor) {
			$floor['rooms'] = Db::table('__ROOM__')->field('room_name roomName, x, y, shop_id shopId')
				->where('is_deleted', 'N')
				->where('floor_id', $floor['floorId'])
				->order('room_name asc')->select();
		}
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$floorId = (int)$request->post('floorId');
		$floordata = [
			'floor_name' 		=> $request->post('floorName'),
			'nav_file_key'		=> $request->post('navFileKey'),
			'nav_file_key'		=> $request->post('navFileKey'),
			'floor_alias'		=> $request->post('floorAlias'),
			'floor_en'			=> $request->post('floorEn'),
			'floor_tags'			=> $request->post('floorTags')
		];
		Db::startTrans();
		try {
			if($floorId == 0) {
				$floordata['build_id'] = (int)$request->post('buildId');
				$this->insert($floordata);
				$lastInsId = $this->getLastInsID();
				if($lastInsId) {
					$floorId = (int)$lastInsId;
					$this->where('floor_id', $floorId)->update(['floor_sort' => $lastInsId]);
				}
			} else {
				$this->where('floor_id', $floorId)->update($floordata);
			}
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function moveUp($floorId) {
		
		$current = $this->where('floor_id', $floorId)->field('floor_sort, build_id')->find();
		if(empty($current)) {
			return -1;
		}
		
		$buildId = (int)$current['build_id'];
		$currentSort = (int)$current['floor_sort'];
		
		$up = $this->field('floor_id, floor_sort')->where('build_id', $buildId)->where('floor_sort', 'lt', $currentSort)->order('floor_sort desc')->find();
		if(empty($up)) {
			return 0;
		}
		
		$upSort = (int)$up['floor_sort'];
		$upFloorId = (int)$up['floor_id'];
		Db::startTrans();
		try {
			$this->where('floor_id', $floorId)->update(['floor_sort' => $upSort]);
			$this->where('floor_id', $upFloorId)->update(['floor_sort' => $currentSort]);
			
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function moveDown($floorId) {
		
		$current = $this->where('floor_id', $floorId)->field('floor_sort, build_id')->find();
		if(empty($current)) {
			return -1;
		}
		
		$buildId = (int)$current['build_id'];
		$currentSort = (int)$current['floor_sort'];
		
		$down = $this->field('floor_id, floor_sort')->where('build_id', $buildId)->where('floor_sort', 'gt', $currentSort)->order('floor_sort asc')->find();
		if(empty($down)) {
			return 0;
		}
		
		$downSort = (int)$down['floor_sort'];
		$downFloorId = (int)$down['floor_id'];
		Db::startTrans();
		try {
			$this->where('floor_id', $floorId)->update(['floor_sort' => $downSort]);
			$this->where('floor_id', $downFloorId)->update(['floor_sort' => $currentSort]);
			
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function _delete($floorId = 0) {
		try{
			$this->where('floor_id', $floorId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>