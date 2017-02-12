<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 房间
class File extends Model
{
	public function _save($data) {
		try {
			$this->insert($data);
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	public function _get($fileKey) {
		return $this->field('file_name, file_path, file_type')->where('file_key', $fileKey)->find();
	}
	
	public function _delete($key) {
		$data = $this->field('file_path')->where('file_key', $key)->where('client_id', 'neq', 0)->find();
		if(empty($data)) {
			return -1;
		}
		
		try {
			$this->where('file_key', $key)->where('client_id', 'neq', 0)->delete();
			unlink('.'.$data['file_path']);
			return 0;
		} catch(\Exception $e) {
			return -1;
		}
	}
}
?>