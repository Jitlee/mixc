<?php
namespace app\api\controller;


/**
 * swagger: 版本
 */
class Release {
    /**
     * get: 获取版本列表
     * path: lst/{pageNo}
     * method: lst
     * param: pageNo - {int} 页码，从1开始
     */
    public function lst($pageNo = 1) {
        $db = model('Release');
        $list = $db->_query($pageNo);
        return success($list);
    }
    
    /**
     * get: 获取版本列表
     * path: last/{releaseSourceId}
     * method: last
     * param: releaseSourceId - {int} 版本源id
     */
    public function last($releaseSourceId = 0) {
    		$db = model('Release');
        $list = $db->_last($releaseSourceId);
        return success($list);
    }

    /**
     * post: 发布新版本
     * path: publish/{clientId}/{sceneId}
     * method: publish
     * param: clientId - {int} 客户Id
     * param: sceneId - {int} 场景Id
     */
    public function publish($clientId, $sceneId = 0) {
		$tmpId = uuid();
		$tmp = 'release/tmp/';
		$templeate = 'client_template/0.0.1/';
    		$tmpDir = $tmp.$tmpId.'/';
    		$tmpFile = $tmp.$tmpId.'.zip';
        try {
        		if(!file_exists($templeate)) {
        			return fail('发布失败：模版文件不存在');
        		}
        	
	    		if(!file_exists($tmp)) {
	    			mkdir($tmp, 0777, true);
	    		}
    		
        		$lastVersionArray = $this->get_last_version($sceneId);
        		
        		$releaseFile = 'release/mixc_'.$sceneId.'_'.join('.', $lastVersionArray).'.zip';
        		
        		if(empty($lastVersionArray)) {
        			return fail('发布失败：获取最后的版本号失败');
        		}
        	
        		// 拷贝模板
            $this->copy_dir($templeate, $tmpDir);
            
            // 下载json数据
            $this->download_data($clientId, $tmpDir, 'Shop', ['shopImagePath', 'shopIconPath', 'shopQRCodePath', 'shopNavPath']);
            $this->download_data($clientId, $tmpDir, 'Activity', ['activityFilePath']);
            $this->download_data($clientId, $tmpDir, 'Floor', ['navFilePath']);
            $this->download_data($clientId, $tmpDir, 'Ads', ['adsFilePath']);
            $this->download_data($clientId, $tmpDir, 'Album', ['filePath']);
            $this->download_data($clientId, $tmpDir, 'Article', ['articleContent']);
            $this->download_data($clientId, $tmpDir, 'Poi', ['poiIcon']);
//          $this->download_image($clientId, $tmpDir, [10]);
            $this->download_shop_types($clientId, $tmpDir);
            
			$zip = new \ZipArchive();
			if ($zip->open($tmpFile, \ZipArchive::OVERWRITE) !== TRUE) {
				$this->remove_tmp($tmpFile, $tmpDir);
				return fail('发布失败：压缩文件失败');
			}
			
			$this->add_file_to_zip($tmpDir,  $zip); //调用方法，对要打包的根目录进行操作，并将ZipArchive的对象传递给方法
			$zip->close(); //关闭处理的zip文件
			
			copy($tmpFile, $releaseFile); // 拷贝最终文件
			
			$db = model('Release');
        		if($db->_save($clientId, $sceneId, $lastVersionArray, $tmpId, $releaseFile) > -1) {
        			$this->copy_dir($tmpDir, 'release/'.join('.', $lastVersionArray).'/');
        			$this->remove_tmp($tmpFile, $tmpDir);
        			return success(true, '发布成功，最新版本号：'.join('.', $lastVersionArray));	
        		} else {
        			$this->remove_tmp($tmpFile, $tmpDir, $releaseFile);
        			return fail('发布失败: 保存发布记录失败');
        		}
        } catch (\Exception $e) {
			$this->remove_tmp($tmpFile, $tmpDir);
			echo dump($e);
			return fail('发布失败');
		}
    }
    
    function get_last_version($sceneId) {
    		$db = model('Scene');
    		return $db->getLastVersion($sceneId);
    }
    
    function remove_tmp($tmpFile, $tmpDir, $releaseFile = '') {
    		if(file_exists($tmpDir)) {
    			$this->delete_dir($tmpDir);
    		}
    		if(is_file($tmpFile)) {
    			unlink($tmpFile);
    		}
    		if(!empty($releaseFile) && is_file($tmpFile)) {
    			unlink($releaseFile);
    		}
    }
    
    function download_data($clientId, $tmpDir, $model, $fields) {
    		$db = model($model);
		$list = $db->_getall($clientId);
		foreach($list as &$row) {
			foreach($fields as $field) {
				$row[$field] = preg_replace('/\/static\/img\//', 'static/img/', preg_replace('/\/uploads\//', 'uploads/', $row[$field]));
				if($field == 'articleContent') {
					$conetent = $row[$field];
					$matches = [];
					if(preg_match_all('/uploads\/\d+\/[A-Za-z0-9]+\.\w+/', $conetent, $matches, PREG_SET_ORDER) && count($matches) > 0) {
						for($i = 0; $i < count($matches[0]); $i++) {
							$this->download_img($tmpDir, $matches[0][$i]);
						}
					}
				} else {
//					$filePath = substr($row[$field], 1);
					$filePath = $row[$field];
					if(stripos($filePath, 'uploads') != 0) {
						continue;
					}
					$this->download_img($tmpDir, $filePath);
				}
			}
		}
		$this->save_to_json($tmpDir, strtolower($model), $list);
    }
    
    function download_image($clientId, $tmpDir, $types) {
    		$db = model('File');
		$list = $db->field('file_path')->where('file_type', 'in', $types)->select();
		foreach($list as $row) {
			$filePath = substr($row['file_path'], 1);
			if(stripos($filePath, 'uploads') != 0) {
				continue;
			}
			$this->download_img($tmpDir, $filePath);
		}
    }
    
    function download_img($tmpDir, $filePath) {
    		$dst = $tmpDir.$filePath;
		if(!is_file($dst) && is_file($filePath)) {
			$dstDir = dirname($dst);
			if(!is_dir($dstDir)) {
				mkdir($dstDir, 0777, true);
			}
			copy($filePath, $dst);
		}
    }
    
    function download_shop_types($clientId, $tmpDir) {
    		$db = model('Dict');
		$list = $db->group($clientId, -1);
		$this->save_to_json($tmpDir, 'shopType', $list);
    }
    
    function save_to_json($tmpDir, $name, $list) {
		$jsonFile = fopen($tmpDir.'/data/'.$name.'.json', 'w') or die('Unable to open file!');
		$json = json_encode($list);
		fwrite($jsonFile, $json);
		fclose($jsonFile);
    }
    
    function add_file_to_zip($path, $zip, $root = null) {
    		if($root == null) {
    			$root = $path;
    		}
		$handler = opendir($path);
		while(($filename = readdir($handler)) !== false) {
			$dst = $path . "/" . $filename;
			if ($filename != "." && $filename != "..") {//文件夹文件名字为'.'和‘..’，不要对他们进行操作
				if (is_dir($dst)) {// 如果读取的某个对象是文件夹，则递归
					$this->add_file_to_zip($dst, $zip, $root);
				} else { //将文件加入zip对象
					$zip->addFile($dst, str_replace($root, '', $dst));
				}
			}
		}
		@closedir($path);
	}
	
	function delete_dir($dir) {
	    if (!file_exists($dir)) {
	        return true;
	    }
	
	    if (!is_dir($dir)) {
	        return unlink($dir);
	    }
	
	    foreach (scandir($dir) as $item) {
	        if ($item == '.' || $item == '..') {
	            continue;
	        }
	
	        if (!$this->delete_dir($dir . DIRECTORY_SEPARATOR . $item)) {
	            return false;
	        }
	
	    }
	
	    return rmdir($dir);
	}
	
    function copy_dir($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src.'/'.$file)) {
                    $this->copy_dir($src.'/'.$file, $dst.'/'.$file);
                    continue;
                } else {
                    copy($src.'/'.$file, $dst.'/'.$file);
                }
            }
        }
        closedir($dir);
    }


    /**
     * delete: 删除版本
     * path: delete/{releaseId}
     * method: delete
     * param: releaseId - {int} 版本id
     */
    public function delete($releaseId = 0) {
        $db = model('Release');
        if ($db->_delete($releaseId)) {
            return success(true, '删除成功');
        } else {
            return fail('删除失败');
        }
    }
	
	/**
	 * patch: 启用／停用设置
	 * path: enable/{releaseId}/{enabled}
	 * method: enable
	 * param: releaseId - {int} 版本id
	 * param: enabled - {int} 0停用，1启用
	 */
	public function enable($releaseId = 0, $enabled = 0) {
        $db = model('Release');
		$db->enable($releaseId, $enabled == 1);
		return success(true);
	}
}