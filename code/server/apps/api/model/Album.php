<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 相册
class Album extends Model
{
	protected $type = [
        'objId'  		=>  'integer',
    ];
    
    public function _getall($clientId) {
    		$list = $this->alias('a')
			->field('a.album_type albumType, a.obj_id objId')
			->field('f.file_key fileKey, f.file_name fileName, f.file_path filePath')
			->join('__FILE__ f', 'f.file_key = a.file_key')
			->where('a.client_id', $clientId)
			->order('a.album_sort asc')
			->select();
		return $list;
    }
    
	public function _query($clientId, $albumType, $objId) {
		$list = $this->alias('a')
			->field('a.album_type albumType, a.obj_id objId')
			->field('f.file_key fileKey, f.file_name fileName, f.file_path filePath, unix_timestamp(f.create_time) * 1000 createTime')
			->join('__FILE__ f', 'f.file_key = a.file_key')
			->where('a.client_id', $clientId)
			->where('a.obj_id', $objId)
			->where('a.album_type', $albumType)
			->order('a.album_sort asc')
			->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$clientId = $request->post('clientId');
		$albumType = $request->post('albumType');		
		$objId = $request->post('objId');
		$fileKey = $request->post('fileKey');
		$data = [
			'client_id' => $clientId,
			'album_type' => $albumType,
			'obj_id' => $objId,
			'file_key' => $fileKey,
		];
		$albumSort = $this->where('album_type', $albumType)->max('album_sort');
		if($albumSort >= 0) {
			$data['album_sort'] = $albumSort + 1;
		}
		try {
			$this->insert($data);
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			return -1;
		}
	}
	
	public function moveUp($albumType, $objId, $fileKey) {
		
		$current = $this->field('album_sort')->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $fileKey)->find();
		if(empty($current)) {
			return -1;
		}
		
		$currentSort = (int)$current['album_sort'];
		
		$up = $this->field('file_key, album_sort')->where('album_type', $albumType)
				->where('obj_id', $objId)->where('album_sort', 'lt', $currentSort)->order('album_sort desc')->find();
//		echo $this->getLastSql();
		if(empty($up)) {
			return 0;
		}
		
		$upSort = (int)$up['album_sort'];
		$upFileKey = $up['file_key'];
		Db::startTrans();
		try {
			$this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $upFileKey)->update(['album_sort' => $currentSort]);
//			echo $this->getLastSql();
			$this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $fileKey)->update(['album_sort' => $upSort]);
			
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function moveDown($albumType, $objId, $fileKey) {
		
		$current = $this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $fileKey)->field('album_sort')->find();
		if(empty($current)) {
			return -1;
		}
		
		$currentSort = (int)$current['album_sort'];
		
		$down = $this->field('file_key, album_sort')->where('album_type', $albumType)
				->where('obj_id', $objId)->where('album_sort', 'gt', $currentSort)->order('album_sort asc')->find();
		if(empty($down)) {
			return 0;
		}
		
		$downSort = (int)$down['album_sort'];
		$downFileKey = $down['file_key'];
		Db::startTrans();
		try {
			$this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $fileKey)->update(['album_sort' => $downSort]);
			$this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $downFileKey)->update(['album_sort' => $currentSort]);
			
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function _delete($albumType, $objId, $fileKey) {
		try {
			$this->where('album_type', $albumType)
				->where('obj_id', $objId)
				->where('file_key', $fileKey)->delete();
//			echo $this->getLastSql();
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
}
?>