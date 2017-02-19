<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 商家
class Shop extends Model
{
	protected $type = [
        'clientId'  		=>  'integer',
        'shopId'  		=>  'integer',
        'shopType'  		=>  'integer',
    ];
    
	public function _all($clientId) {
		$list = $this->field('shop_id shopId, shop_name shopName')
			->where('is_deleted', 'N')
			->order('shop_name')
			->select();
		return $list;
	}
	
	public function _getall($clientId = 0) {
		$list = $this->alias('s')
			->field('s.client_id clientId, s.shop_id shopId, shop_type shopType, shop_name shopName, shop_en_name shopEnName, shop_index shopIndex, shop_index shopIndex, shop_icon shopIcon')
			->field('shop_image shopImage, f3.file_path shopImagePath, shop_floor shopFloor, shop_room shopRoom, shop_tel shopTel, shop_url shopUrl, service_start_time serviceStartTime, service_end_time serviceEndTime, shop_qr_code shopQRCode, shop_introduction shopIntroduction, shop_desc shopDesc')
			->field('d1.dict_value subShopTypeText, d2.dict_value mainShopTypeText')
			->field('f1.file_path shopIconPath')
			->field('f2.file_path shopQRCodePath')
			->field('f4.file_path shopNavPath, i.shop_nav_key shopNavKey')
			->join('__DICT__ d1', 's.shop_type = d1.dict_id and s.client_id = d1.client_id')
			->join('__DICT__ d2', 'd2.dict_id = d1.dict_parent_id and s.client_id = d2.client_id')
			->join('__FILE__ f1', 'f1.file_key = s.shop_icon and f1.file_type = 1')
			->join('__SHOP_INFO__ i', 'i.shop_id = s.shop_id')
			->join('__FILE__ f2', 'f2.file_key = i.shop_qr_code and f2.file_type = 2')
			->join('__FILE__ f3', 'f3.file_key = i.shop_image and f3.file_type = 9')
			->join('__FILE__ f4', 'f4.file_key = i.shop_nav_key and f4.file_type = 13')
			->where('s.is_deleted', 'N')
			->where('s.client_id', $clientId)
			->order('s.shop_sort asc')->select();
			
//		echo $this->getlastSql();
					
		return $list;
	}
	
	public function _query($clientId = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('s')
			->field('s.client_id clientId, shop_id shopId, shop_type shopType, d1.dict_value subShopTypeText, d2.dict_value mainShopTypeText, shop_name shopName, shop_en_name shopEnName, shop_icon shopIcon, file_path shopIconPath, shop_desc shopDesc')
			->join('__DICT__ d1', 's.shop_type = d1.dict_id and s.client_id = d1.client_id')
			->join('__DICT__ d2', 'd2.dict_id = d1.dict_parent_id and s.client_id = d2.client_id')
			->join('__FILE__ f', 'f.file_key = s.shop_icon and f.file_type = 1');
			
		if($keywords != '') {
			$db = $db->where('shop_name','like','%'.$keywords.'%');
		}
		
		$db = $db->where('s.client_id', $clientId)->where('s.is_deleted', 'N');
		$list =  $db->order('s.shop_sort asc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		
		$db = $this->where('client_id', $clientId)->where('is_deleted', 'N');
		if($keywords != '') {
			$db = $db->where('shop_name','like','%'.$keywords.'%');
		}
		
		$total =  $db->count();
			
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _get($shopId) {
		$shop = $this->alias('s')
			->field('s.client_id clientId, s.shop_id shopId, shop_type shopType, shop_name shopName, shop_en_name shopEnName, shop_index shopIndex, shop_index shopIndex, shop_icon shopIcon')
			->field('shop_image shopImage, f3.file_path shopImagePath, shop_floor shopFloor, shop_room shopRoom, shop_tel shopTel, shop_url shopUrl, service_start_time serviceStartTime, service_end_time serviceEndTime, shop_qr_code shopQRCode, shop_introduction shopIntroduction, shop_desc shopDesc')
			->field('d1.dict_value subShopTypeText, d2.dict_value mainShopTypeText')
			->field('f1.file_path shopIconPath')
			->field('f2.file_path shopQRCodePath')
			->field('f4.file_path shopNavPath, i.shop_nav_key shopNavKey')
			->join('__DICT__ d1', 's.shop_type = d1.dict_id and s.client_id = d1.client_id')
			->join('__DICT__ d2', 'd2.dict_id = d1.dict_parent_id and s.client_id = d2.client_id')
			->join('__FILE__ f1', 'f1.file_key = s.shop_icon and f1.file_type = 1')
			->join('__SHOP_INFO__ i', 'i.shop_id = s.shop_id')
			->join('__FILE__ f2', 'f2.file_key = i.shop_qr_code and f2.file_type = 2')
			->join('__FILE__ f3', 'f3.file_key = i.shop_image and f3.file_type = 9')
			->join('__FILE__ f4', 'f4.file_key = i.shop_nav_key and f4.file_type = 13')
			->where('s.is_deleted', 'N')
			->where('s.shop_id', $shopId)->find();
//		return $this->getLastSql();
		return $shop;
	}
	
	public function _save() {
		$request = Request::instance();
		$shopId = (int)$request->post('shopId');
		$shopdata = [
			'shop_name' 		=> $request->post('shopName'),
			'shop_en_name' 	=> $request->post('shopEnName'),
			'shop_index' 	=> strtoupper($request->post('shopIndex', '')),
			'shop_type' 		=> $request->post('shopType'),
			'shop_desc' 		=> $request->post('shopDesc'),
			'shop_icon' 		=> $request->post('shopIcon'),
		];
		
		$shopinfo = [
			'shop_image' 		=> $request->post('shopImage'),
			'shop_nav_key' 		=> $request->post('shopNavKey'),
			'shop_floor'		=> $request->post('shopFloor'),
			'shop_room'		=> $request->post('shopRoom'),
			'shop_tel'		=> $request->post('shopTel'),
			'shop_url'		=> $request->post('shopUrl'),
			'service_start_time'		=> $request->post('serviceStartTime'),
			'service_end_time'		=> $request->post('serviceEndTime'),
			'shop_qr_code'	=> $request->post('shopQRCode'),
			'shop_introduction'		=> $request->post('shopIntroduction'),
		];
		
		Db::startTrans();
		try {
			if($shopId == 0) {
				$shopdata['client_id'] = (int)$request->post('clientId');
				$shopSort = $this->where('client_id', $shopdata['client_id'])->max('shop_sort');
				if($shopSort >= 0) {
					$shopdata['shop_sort'] = $shopSort + 1;
				}
				$this->insert($shopdata);
				
				$shopId = (int)$this->getLastInsID();
				$shopinfo['shop_id'] = $shopId;
		    		Db::table('__SHOP_INFO__')->insert($shopinfo);
			} else {
				$this->where('shop_id', $shopId)->update($shopdata);
				Db::table('__SHOP_INFO__')->where('shop_id', $shopId)->update($shopinfo);
			}
			// 提交事务
		    Db::commit();
			return $shopId;
		} catch(\Exception $e) {
			Db::rollback();
//			echo dump($e);
			return -1;
		}
	}
	
	public function move($clientId, $shopId, $sort) {
		$targetSort = 0;
		if($sort < -1) {
			$sort = 0;
		}
		$current = $this->field('shop_sort')->where('shop_id', $shopId)->find();
		if(empty($current)) {
			return true;
		}
		$currentSort = $current['shop_sort'];
		
		$target = $this
			->field('shop_sort')
			->where('client_id', $clientId)
			->where('is_deleted', 'N')
			->order('shop_sort asc')
			->limit($sort, 1)->select();
		$targetSort = 0;
		if(empty($target)) {
			$targetSort = $this->where('client_id', $clientId)->max('shop_sort') + 1;
		} else {
			$targetSort = (int)$target[0]['shop_sort'];
		}
		
		if($currentSort == $targetSort) {
			return true;
		}
		
		if(is_numeric($targetSort)) {
			Db::startTrans();
			try{
				if($currentSort > $targetSort) {
					$this->where('client_id', $clientId)
						->where('shop_sort', 'egt', $targetSort)->update(['shop_sort' => ['exp','shop_sort+1']]);
				} else {
					$this->where('client_id', $clientId)
						->where('shop_sort', 'elt', $targetSort)->update(['shop_sort' => ['exp','shop_sort-1']]);
				}
				$this->where('shop_id', $shopId)->update(['shop_sort' => $targetSort]);
				Db::commit();
				return true;
			} catch (\Exception $e) {
//				echo dump($e);
				Db::rollback();
			}
		}
		return false;
	}
	
	public function _delete($shopId = 0) {
		try{
			$this->where('shop_id', $shopId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>