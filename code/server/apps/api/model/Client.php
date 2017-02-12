<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 客户
class Client extends Model
{
	protected $type = [
        'isEnabled'    =>  'boolean',
    ];
    
	public function _query($pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this
			->field('client_id clientId, client_name clientName, client_logo clientLogo, (is_enabled = \'Y\') as isEnabled');
			
		if($keywords != '') {
			$db = $db->where('client_name','like','%'.$keywords.'%');
		}
		
		$list =  $db->where('is_enabled', 'Y')->order('client_id desc')
			->page($pageNo, config('page_size'))->select();
		return $list;
	}
	
	public function _save() {
		$request = Request::instance();
		$clientId = (int)$request->post('clientId');
		$clientdata = [
			'client_name' 		=> $request->post('clientName'),
			'client_logo' 		=> $request->post('clientLogo', 0),
			'is_enabled' 		=> (bool)$request->post('isEnabled') == true ? 'Y' : 'N',
		];
		
		$clientinfo = [
			'client_addr'		=> $request->post('clientAddr'),
			'client_contact'		=> $request->post('clientContact'),
			'client_tel'			=> $request->post('clientTel'),
			'client_phone'		=> $request->post('clientPhone'),
			'client_desc'		=> $request->post('clientDesc'),
		];
		
		// 启动事务
		Db::startTrans();
		try{
		    if($clientId == 0) {
		    		$this->insert($clientdata);
		    		$clientinfo['client_id'] = $this->getLastInsID();
		    		Db::table('__CLIENT_INFO__')->insert($clientinfo);
		    } else {
		    		$this->where('client_id', $clientId)->update($clientdata);
		    		Db::table('__CLIENT_INFO__')->where('client_id', $clientId)->update($clientinfo);
		    }
		    // 提交事务
		    Db::commit();
		    return 0;
		} catch (\Exception $e) {
			echo dump($e);
		    // 回滚事务
		    Db::rollback();
		    return -1;
		}
	}
	
	public function changeState($clientId = 0, $isEnabled) {
		try{
			$this->where('client_id', $clientId)->update(['is_enabled' => $isEnabled]);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>