<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 广告
class Ads extends Model
{
	protected $type = [
        'clientId'  		=>  'integer',
        'adsGroupId'  	=>  'integer',
        'adsTargetType'  	=>  'integer',
        'adsTargetId'  	=>  'integer',
        'adsId'  	=>  'integer',
    ];
    
	public function _query($clientId = 0, $type = 0,  $group = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('a')
			->field('a.client_id clientId, a.ads_id adsId, a.ads_title adsTitle, a.ads_group_id adsGroupId, a.ads_color adsColor, a.ads_stretch adsStretch')
			->field('a.ads_target_type adsTargetType, a.ads_target_id adsTargetId, a.ads_file_key adsFileKey')
			->field('d1.dict_value adsTarget, d2.dict_value adsGroup')
			->field('a.ads_start_date adsStartDate, a.ads_end_date adsEndDate')
			->field('f.file_path adsFilePath')
			->join('__FILE__ f', 'f.file_key = a.ads_file_key and f.file_type = 12')
			->join('__DICT__ d1', 'd1.dict_id = a.ads_target_type and d1.dict_parent_id = -5')
			->join('__DICT__ d2', 'd2.dict_id = a.ads_group_id and d2.dict_parent_id = -4', 'left');
			
		if($keywords != '') {
			$db = $db->where('a.ads_title','like','%'.$keywords.'%');
		}
		
		if($type == 0) { // 当前的
			$db = $db->where('a.ads_start_date', 'exp', ' <= curdate()')
					->where('a.ads_end_date', 'exp', ' >= curdate()');
		} else { // 过期的
			$db = $db->where('a.ads_end_date', 'exp', ' < curdate()');
		}
		
		if($group > 0) { // 分组
			$db = $db->where('a.ads_group_id', $group);
		}
		
		$db = $db->where('a.client_id', $clientId)->where('a.is_deleted', 'N');
		$list =  $db->order('a.ads_group_id asc, a.ads_start_date asc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		
		$db = $this->alias('a');
			
		if($keywords != '') {
			$db = $db->where('a.ads_title','like','%'.$keywords.'%');
		}
		
		if($type == 0) { // 当前的
			$db = $db->where('a.ads_start_date', 'exp', ' <= curdate()')
				->where('a.ads_end_date', 'exp', ' >= curdate()');
		} else { // 过期的
			$db = $db->where('a.ads_end_date', 'exp', ' < curdate()');
		}
		
		if($group > 0) { // 分组
			$db = $db->where('a.ads_group_id', $group);
		}
		
		$db = $db->where('a.client_id', $clientId)->where('a.is_deleted', 'N');
		$total =  $db->count();
			
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _getall($clientId = 0) {
		$list = $this->alias('a')
			->field('a.client_id clientId, a.ads_id adsId, a.ads_title adsTitle, a.ads_group_id adsGroupId, a.ads_color adsColor, a.ads_stretch adsStretch')
			->field('a.ads_target_type adsTargetType, a.ads_target_id adsTargetId, a.ads_file_key adsFileKey')
			->field('d1.dict_value adsTarget, d2.dict_value adsGroup')
			->field('a.ads_start_date adsStartDate, a.ads_end_date adsEndDate')
			->field('f.file_path adsFilePath')
			->join('__FILE__ f', 'f.file_key = a.ads_file_key and f.file_type = 12')
			->join('__DICT__ d1', 'd1.dict_id = a.ads_target_type and d1.dict_parent_id = -5')
			->join('__DICT__ d2', 'd2.dict_id = a.ads_group_id and d2.dict_parent_id = -4', 'left')
			->where('a.client_id', $clientId)->where('a.is_deleted', 'N')
			->where('a.ads_start_date', 'exp', ' <= curdate()')
			->where('a.ads_end_date', 'exp', ' >= curdate()')
			->order('a.ads_start_date asc, a.ads_group_id asc')->select();
		
//		echo $this->getLastSql();
		
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$adsId = (int)$request->post('adsId');
		$data = [
			'ads_title' 		=> $request->post('adsTitle'),
			'ads_group_id' 		=> $request->post('adsGroupId'),
			'ads_target_type' 	=> $request->post('adsTargetType'),
			'ads_target_id' 	=> $request->post('adsTargetId'),
			'ads_stretch' 	=> $request->post('adsStretch'),
			'ads_color' 	=> $request->post('adsColor'),
			'ads_file_key' 		=> $request->post('adsFileKey'),
			'ads_start_date' 	=> $request->post('adsStartDate'),
			'ads_end_date' 		=> $request->post('adsEndDate')
		];
		
		try {
			if($adsId == 0) {
				$data['client_id'] = $request->post('clientId');
				$this->insert($data);
			} else {
				$this->where('ads_id', $adsId)->update($data);
			}
			// 提交事务
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	public function _delete($adsId = 0) {
		try{
			$this->where('ads_id', $adsId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>