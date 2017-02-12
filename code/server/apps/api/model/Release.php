<?php
namespace app\api\model;

use think\Model;
use think\Db;
use think\Request;

// 版本
class Release extends Model
{
	protected $type = [
        'isDeleted'  	=>  'boolean',
        'releaseId'  	=>  'integer',
    ];
	public function _query($pageNo = 1) {
		$list = $this->alias('r')
			->field('release_id releaseId, release_version releaseVersion, release_desc releaseDesc, release_file releaseFile, create_time createTime, (is_deleted = \'Y\') isDeleted')
			->order('r.create_time desc')
			->page($pageNo, config('page_size'))->select();
		
//		echo $this->getLastSql();
		
		$total = $this->alias('r')->where('is_deleted', 'N')->count();
		
		return [
			'list' => $list,
			'total' => $total
		];
	}
	public function _last($sceneId = 0) {
		return $this->alias('r')
			->field('release_id releaseId, release_version releaseVersion, release_desc releaseDesc, release_file releaseFile, create_time createTime')
			->where('r.scene_id', $sceneId)
			->where('r.is_deleted', 'N')
			->order('r.create_time desc')
			->find();
	}
	
	public function _save($clientId, $sceneId, $versionArray, $fileKey, $releaseFile) {
		
		// 启动事务
		Db::startTrans();
		try{
			$data = [
				'scene_id' => $sceneId,
				'release_file' => $releaseFile,
				'release_version' => join('.', $versionArray)
			];
	    		$this->insert($data);
	    		Db::table('__SCENE__')
	    			->where('scene_id', $sceneId)
	    			->update(['thrid_version' =>  $versionArray[2]]);
	    		
		    // 提交事务
		    Db::commit();
		    return 1;
		} catch (\Exception $e) {
		    // 回滚事务
		    echo dump($e);
		    Db::rollback();
		    return -1;
		}
	}
	
	public function _delete($releaseId = 0) {
		try{
			$this->where('release_id', $releaseId)->update(['is_deleted' => 'Y']);
//			echo $this->getLastSql();
			return true;
		} catch (\Exception $e) {
		    // 回滚事务
//		    echo dump($e);
		    return false;
		}
	}
}
?>