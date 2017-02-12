<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 活动
class Activity extends Model
{   
	protected $type = [
        'clientId'  		=>  'integer',
        'activityId'  	=>  'integer',
    ];
	public function _query($clientId = 0, $type = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('a')
			->field('a.client_id clientId, a.activity_id activityId, a.activity_title activityTitle')
			->field('a.activity_desc activityDesc, a.activity_file_key activityFileKey')
			->field('a.activity_start_date activityStartDate, a.activity_end_date activityEndDate')
			->field('f.file_path activityFilePath')
			->join('__FILE__ f', 'f.file_key = a.activity_file_key and f.file_type = 6');
			
		if($keywords != '') {
			$db = $db->where('a.activity_title','like','%'.$keywords.'%');
		}
		
		if($type == 0) { // 当前的
			$db = $db->where('a.activity_start_date', 'exp', ' <= curdate()')
					->where('a.activity_end_date', 'exp', ' >= curdate()');
		} else { // 过期的
			$db = $db->where('a.activity_end_date', 'exp', ' < curdate()');
		}
		
		$db = $db->where('a.client_id', $clientId)->where('a.is_deleted', 'N');
		$list =  $db->order('a.create_time desc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		
		$db = $this->alias('a');
			
		if($keywords != '') {
			$db = $db->where('a.activity_title','like','%'.$keywords.'%');
		}
		
		if($type == 0) { // 当前的
			$db = $db->where('a.activity_start_date', 'exp', ' <= curdate()')
				->where('a.activity_end_date', 'exp', ' >= curdate()');
		} else { // 过期的
			$db = $db->where('a.activity_end_date', 'exp', ' < curdate()');
		}
		
		$db = $db->where('a.client_id', $clientId)->where('a.is_deleted', 'N');
		$total =  $db->order('a.create_time desc')->count();
			
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _all($clientId = 0) {
		$list = $this->alias('a')
			->field('a.activity_id activityId, a.activity_title activityTitle')
			->where('a.activity_start_date', 'exp', ' <= curdate()')
			->where('a.activity_end_date', 'exp', ' >= curdate()')
			->where('a.client_id', $clientId)->where('a.is_deleted', 'N')
			->order('a.create_time desc')->select();
		return $list;
	}
	
	public function _getall($clientId = 0) {
		$list = $this->alias('a')
			->field('a.client_id clientId, a.activity_id activityId, a.activity_title activityTitle')
			->field('a.activity_desc activityDesc, a.activity_file_key activityFileKey')
			->field('a.activity_start_date activityStartDate, a.activity_end_date activityEndDate')
			->field('f.file_path activityFilePath')
			->join('__FILE__ f', 'f.file_key = a.activity_file_key and f.file_type = 6')
			->where('a.activity_start_date', 'exp', ' <= curdate()')
			->where('a.activity_end_date', 'exp', ' >= curdate()')
			->where('a.client_id', $clientId)->where('a.is_deleted', 'N')
			->order('a.create_time desc')->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$activityId = (int)$request->post('activityId');
		$data = [
			'activity_title' 		=> $request->post('activityTitle'),
			'activity_desc' 			=> $request->post('activityDesc'),
			'activity_file_key' 		=> $request->post('activityFileKey'),
			'activity_start_date' 	=> $request->post('activityStartDate'),
			'activity_end_date' 		=> $request->post('activityEndDate')
		];
		
		try {
			if($activityId == 0) {
				$data['client_id'] = $request->post('clientId');
				$this->insert($data);
			} else {
				$this->where('activity_id', $activityId)->update($data);
			}
			// 提交事务
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	public function _delete($activityId = 0) {
		try{
			$this->where('activity_id', $activityId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>