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
    
	public function _query($clientId, $albumType, $objId) {
		$list = $this->alias('a')
			->field('a.album_type albumType, a.obj_id objId')
			->field('f.file_key fileKey, f.file_name fileName, f.file_path filePath, unix_timestamp(f.create_time) * 1000 createTime')
			->join('__FILE__ f', 'f.file_key = a.file_key')
			->where('a.client_id', $clientId)
			->where('a.obj_id', $objId)
			->where('a.album_type', $albumType)
			->order('f.create_time asc')
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
		try {
			$this->insert($data);
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
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