<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 字典
class Dict extends Model
{
	protected $type = [
        'dictSort'  	=>  'integer',
        'clientId'  	=>  'integer',
        'dictId'  	=>  'integer',
        'dictParentId'  	=>  'integer',
        'dictSort'  	=>  'integer',
        'canDelete'  	=>  'boolean'
    ];
	public function _query($clientId = 0, $parentId = 0) {
		$db = $this->alias('d')
			->field('d.client_id clientId, dict_id dictId, dict_value dictValue, dict_parent_id dictParentId, dict_icon dictIcon, (can_delete = \'Y\') canDelete, dict_remark dictRemark')
			->field('file_path dictIconPath')
			->join('__FILE__ f', 'f.file_key = d.dict_icon');
		$list = $db->where('d.client_id', $clientId)
			->where('dict_parent_id', $parentId)
			->where('d.is_deleted', 'N')
			->order('d.dict_sort asc')
			->select();
			
//		echo $this->getLastSql();
		return $list;
	}
	
	public function group($clientId = 0, $parentId = 0) {
		$list = $this->alias('d1')
			->field('d1.dict_id groupId, d1.dict_value groupName')
			->field('d2.dict_id dictId, d2.dict_value dictValue')
			->join('__DICT__ d2', 'd2.dict_parent_id = d1.dict_id', 'left')
			->where('d1.client_id', $clientId)
			->where('d1.dict_parent_id', $parentId)
			->where('d1.is_deleted', 'N')
			->where('d2.is_deleted', 'N')
			->order('d1.dict_sort asc, d2.dict_sort asc')
			->select();
			
		$group = [];
		$lastGroupId = -1;
		$lastGroup = [];
		$count = -1;
		foreach ($list as $row) {
			if($lastGroupId !=  $row['groupId']) {
				$lastGroupId = $row['groupId'];
				$lastGroup = [
					'clientId' => $clientId,
					'dictId' => $row['groupId'],
					'dictValue' => $row['groupName'],
					'children' => []
				];
				array_push($group, $lastGroup);
				$count++;
			}
			
			array_push($group[$count]['children'], [
				'clientId' => $clientId,
				'dictId' =>  $row['dictId'],
				'dictValue' =>  $row['dictValue']
			]);
		}
		
		return $group;
	}
	
	public function _save() {
		$request = Request::instance();
		$clientId = (int)$request->post('clientId');
		$dictId = (int)$request->post('dictId');
		$parentId = (int)$request->post('dictParentId');
		$dictdata = [
			'dict_value' 		=> $request->post('dictValue'),
			'dict_icon' 			=> $request->post('dictIcon'),
			'dict_remark' 		=> $request->post('dictRemark')
		];
		Db::startTrans();
		try {
			if($dictId == 0) {
				$dictdata['client_id'] = $clientId;
				$dictdata['dict_parent_id'] = $parentId;
				$this->insert($dictdata);
				
				$lastInsId = $this->getLastInsID();
				if($lastInsId > 0) {
					$this->where('dict_id', $lastInsId)->update(['dict_sort' => (int)$lastInsId]);
				}
			} else {
				$this->where('dict_id', $dictId)->update($dictdata);
			}
			Db::commit();
			return 0;
		} catch(\Exception $e) {
			Db::rollback();
//			echo dump($e);
			return -1;
		}
	}
	
	public function moveUp($dictId) {
		$current = $this->where('dict_id', $dictId)->field('dict_parent_id, client_id, dict_sort')->find();
		if(empty($current)) {
			return -1;
		}
		$clientId = (int)$current['client_id'];
		$currentSort = (int)$current['dict_sort'];
		$parentId = (int)$current['dict_parent_id'];
		
		$up = $this->field('dict_id, dict_sort')
			->where('dict_parent_id', $parentId)
			->where('client_id', $clientId)
			->where('dict_sort', 'lt', $currentSort)
			->where('is_deleted', 'N')
			->order('dict_sort desc')->find();
		if(empty($up)) {
			return 0;
		}
		
		$upSort = (int)$up['dict_sort'];
		$upDictId = (int)$up['dict_id'];
		Db::startTrans();
		try {
			$this->where('dict_id', $dictId)->update(['dict_sort' => $upSort]);
			$this->where('dict_id', $upDictId)->update(['dict_sort' => $currentSort]);
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function moveDown($dictId) {
		$current = $this->where('dict_id', $dictId)->field('dict_parent_id, client_id, dict_sort')->find();
		if(empty($current)) {
			return -1;
		}
		
		$clientId = (int)$current['client_id'];
		$currentSort = (int)$current['dict_sort'];
		$parentId = (int)$current['dict_parent_id'];
		
		$down = $this->field('dict_id, dict_sort')
			->where('dict_parent_id', $parentId)
			->where('client_id', $clientId)
			->where('dict_sort', 'gt', $currentSort)
			->where('is_deleted', 'N')
			->order('dict_sort asc')->find();
		if(empty($down)) {
			return 0;
		}
		
		$downSort = (int)$down['dict_sort'];
		$upDictId = (int)$down['dict_id'];
		Db::startTrans();
		try {
			$this->where('dict_id', $dictId)->update(['dict_sort' => $downSort]);
			$this->where('dict_id', $upDictId)->update(['dict_sort' => $currentSort]);
			Db::commit();
			return 0;
		} catch(\Exception $e) {
//			echo dump($e);
			Db::rollback();
			return -1;
		}
	}
	
	public function _delete($dictId) {
		try{
			$this->where('dict_id', $dictId)
					->where('can_delete', 'Y')
					->update(['is_deleted' => 'Y']);
//			echo $this->getLastSql();
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>