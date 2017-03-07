<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 文章
class Article extends Model
{
	protected $type = [
        'clientId'  		=>  'integer',
        'articleId'  		=>  'integer',
        'articleGroupId'  		=>  'integer',
    ];
    
	public function _query($clientId = 0, $group = 0, $pageNo = 1) {
		$request = Request::instance();
		$keywords = $request->get('keywords', '');
		$db = $this->alias('a')
			->field('a.client_id clientId, a.article_id articleId, a.article_group_id articleGroupId, a.article_title articleTitle')
			->field('d.dict_value articleGroup')
			->join('__DICT__ d','d.dict_id = a.article_group_id and d.dict_parent_id = -3', 'left');
			
		if($keywords != '') {
			$db = $db->where('a.article_title','like','%'.$keywords.'%');
		}
		
		if($group > 0) { // 当前的
			$db = $db->where('a.article_group_id', $group);
		}
		
		$db = $db->where('a.client_id', $clientId)->where('a.is_deleted', 'N');
		$list =  $db->order('a.create_time desc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		
		$db = $this->alias('a');
			
		if($keywords != '') {
			$db = $db->where('a.article_title','like','%'.$keywords.'%');
		}
		
		if($group > 0) { // 当前的
			$db = $db->where('a.article_group_id', $group);
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
			->field('a.article_id articleId, a.article_title articleTitle')
			->where('a.client_id', $clientId)->where('a.is_deleted', 'N')
			->order('a.create_time desc')->select();
		return $list;
	}
	
	public function _getall($clientId = 0) {
		$list = $this->alias('a')
			->field('a.client_id clientId, a.article_id articleId, a.article_group_id articleGroupId, a.article_title articleTitle, article_content articleContent')
			->field('d.dict_value articleGroup')
			->join('__DICT__ d', 'd.dict_id = a.article_group_id and d.dict_parent_id = -3', 'left')
			->where('a.client_id', $clientId)->where('a.is_deleted', 'N')
			->order('a.create_time desc')->select();
		return $list;
	}
	
	public function _get($articleId = 0) {
		$data = $this->alias('a')
			->field('a.client_id clientId, a.article_id articleId, a.article_group_id articleGroupId, a.article_title articleTitle, article_content articleContent')
			->field('d.dict_value articleGroup')
			->join('__DICT__ d', 'd.dict_id = a.article_group_id and d.dict_parent_id = -3', 'left')
			->where('a.article_id', $articleId)->where('a.is_deleted', 'N')->find();
//		echo $this->getLastSql();
		return $data;
	}
	
	public function _save() {
		$request = Request::instance();
		$articleId = (int)$request->post('articleId');
		$content = $request->post('articleContent');
		$content = preg_replace('/href\=("|\')[^"^\']+("|\')/i', '', $content);
		$content = $this->del_script($content);
		$data = [
			'article_group_id' 		=> $request->post('articleGroupId'),
			'article_title' 		=> $request->post('articleTitle'),
			'article_content' 	=> $content
		];
		
		try {
			if($articleId == 0) {
				$data['client_id'] = $request->post('clientId');
				$this->insert($data);
			} else {
				$this->where('article_id', $articleId)->update($data);
			}
			// 提交事务
			return 0;
		} catch(\Exception $e) {
			echo dump($e);
			return -1;
		}
	}
	
	//去除 script 脚 本  
	function del_script($string){  
	   $pregfind = array('/<script.*>.*<\/script>/siU','/on(mousewheel|mouseover|click|load|onload|submit|focus|blur)="[^"]*"/i');  
	   $pregreplace = array('','');  
	   $string = preg_replace($pregfind, $pregreplace, $string);  
	   return $string;  
	}  
	
	public function _delete($articleId = 0) {
		try{
			$this->where('article_id', $articleId)->update(['is_deleted' => 'Y']);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}
}
?>