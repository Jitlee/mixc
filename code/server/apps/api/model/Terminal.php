<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 终端
class Terminal extends Model
{
	protected $type = [
        'isActive'  		=>  'boolean',
        'clientId'  		=>  'integer',
        'tmlId'  		=>  'integer',
        'shutdownTime'  		=>  'integer',
    ];
    
	public function _query($clientId = 0, $pageNo = 1) {
		$list = $this->alias('t')
			->field("tml_id tmlId, t.client_id clientId, tml_name tmlName, tml_brand tmlBrand, tml_model tmlModel, tml_mac tmlMac, tml_ip tmlIp, tml_desc tmlDesc, online_time onlineTime, active_time activeTime, shutdown_time shutdownTime, f_format_time(shutdown_time) shutdownTimeText, x, y, (unix_timestamp() - unix_timestamp(active_time) < 200) isActive, ads_time adsTime")
			->field('t.floor_id floorId, f.floor_name floorName')
			->join('__FLOOR__ f','f.floor_id = t.floor_id', 'left')
			->where('t.client_id', $clientId)->order('tml_name asc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		$total = $this->where('client_id', $clientId)->count();
		return [
			'list' => $list,
			'total' => $total
		];
	}
	
	public function _save() {
		$request = Request::instance();
		$tmlId = (int)$request->post('tmlId');
		$data = [
			'tml_name' 		=> $request->post('tmlName'),
			'tml_brand' 		=> $request->post('tmlBrand'),
			'tml_model' 		=> $request->post('tmlModel'),
			'tml_mac' 		=> $request->post('tmlMac'),
			'tml_ip' 		=> $request->post('tmlIp'),
			'tml_desc' 		=> $request->post('tmlDesc'),
			'floor_id' 		=> $request->post('floorId'),
			'shutdown_time' 		=> $request->post('shutdownTime'),
			'ads_time' 		=> $request->post('adsTime'),
		];
		try {
			if($tmlId == 0) {
				$data['client_id'] = (int)$request->post('clientId');
				$this->insert($data);
			} else {
				$this->where('tml_id', $tmlId)->update($data);
			}
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	public function _active($releaseSourceId = 0) {
		$request = Request::instance();
		$mac = $request->post('mac');
		$ip = $request->post('ip');
		if(empty($mac)) {
			return -5;
		}
		$data = $this->field('unix_timestamp(active_time) active_time, tml_id, unix_timestamp() now, shutdown_time, ads_time')->where('tml_mac', $mac)->find();
		if(empty($data)) {
			$clientData = Db::table('__SCENE__')->field('client_id')->where('scene_id', $releaseSourceId)->find();
			if(empty($clientData)) {
				return -3;
			}
			
			$clientId = (int)$clientData['client_id'];
			
			$data = [
				'client_id'			=> $clientId,
				'tml_name'			=> $ip,
				'tml_mac'			=> $mac,
				'tml_ip'				=> $ip,
				'active_time'		=> date('Y-m-d H:i',time()),
				'online_time'		=> date('Y-m-d H:i',time()),
				'shutdown_time'		=> 0,
				'ads_time'		=> 0,
			];
			try {
				$this->insert($data);
				return ['shutdownTime' => 1260 ];
			} catch(\Exception $e) {
//				echo dump($e);
				return -1;
			}
		}
		
		$activeTime = (int)$data['active_time'];
		$tmlId = (int)$data['tml_id'];
		$time = (int)$data['now'];
		$shutdownTime = (int)$data['shutdown_time'];
		$adsTime = (int)$data['ads_time'];
		
		$data = [
			'active_time' => date('Y-m-d H:i:s', $time),
			'tml_ip' 		  => $ip,
		];
		if($activeTime < $time - 200) {
			$data['online_time'] = $data['active_time'];
		}
		
		try {
			$this->where('tml_id', $tmlId)->update($data);
			return [
				'shutdownTime' => $shutdownTime,
				'adsTime' => $adsTime,
			];
		} catch(\Exception $e) {
				echo dump($e);
			return -1;
		}
	}
	
	public function _delete($tmlId = 0) {
		try{
			$this->where('tml_id', $tmlId)->delete();
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>