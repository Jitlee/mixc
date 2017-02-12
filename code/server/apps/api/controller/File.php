<?php
namespace app\api\controller;

/**
 * swagger: 文件上传
 */
class File {
	/**
	 * post: 获取商家列表
	 * path: uploadImage/{clientId}/{type}
	 * method: uploadImage
	 * param: clientId - {int} 客户id
	 * param: type - {int} 模块类型
	 * param: key - {string} 键值
	 * param: image - {int} 数据
	 */
	public function uploadImage($clientId = 0, $type = 0, $key = '0') {
	    // 获取表单上传文件 例如上传了001.jpg
	    $file = request()->file('image');
	    if(empty($file)) {
	    		return fail("上传失败1");
	    }
	    
	    try {
		    // 移动到框架应用根目录/public/uploads/ 目录下
		    $size = $this->getSizeByType($type);
		    $info = $file->validate(['size'=>$size,'ext'=>'jpg,jpeg,png,gif'])->move(ROOT_PATH . 'public' . DS . 'uploads');
		    if($info){
		        // 成功上传后 获取上传信息
		        $data = [
		        		'client_id' => $clientId,
		        		'file_type' => $type,
		        		'client_id' => $clientId,
		        		'file_name' => $info->getFilename(),
		        		'file_path'	=> '/uploads/'.$info->getSaveName()
		        ];
		        $data['file_key'] = uuid();
		        $db = model('File');
		        $rst = $db->_save($data);
		        if($rst < 0) {
		        		return fail("上传失败2");
		        }
		        
//		        if($key != '0') {
//		        		$this->delete($key);
//		        }
		        
				return success([
					'fileKey' => $data['file_key'],
					'fileName' => $data['file_name'],
					'filePath' => $data['file_path']
				]);
		    } else {
		        // 上传失败获取错误信息
		        echo $file->getError();
				return fail("上传失败3");
		    }
	    } catch(\Exception $e) {
	    		return fail(dump($e));
	    		return fail("上传失败4");
		}
	}
	
	private function getSizeByType($type) {
		switch($type) {
			case 1:
				return 5242880;
			default:
				return 10485760;  
		}
	}
	
	/**
	 * get: 下载文件
	 * path: downlaod/{key}
	 * method: downlaod
	 * param: key - {string} 键值
	 */
	public function download($key) {
		$db = model('File');
		$data = $db->_get($key);
		if(empty($data)) {
			return fail('要下载的文件不存在');
		}
		$filename = $data['file_name'];
		$filepath = $data['file_path'];
		// http headers for zip downloads
		header("Pragma: public");
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"".$filename."\"");
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: ".filesize($filepath.$filename));
		ob_end_flush();
		@readfile($filepath.$filename);
		exit;
	}
	
	/**
	 * post: 删除文件
	 * path: delete/{key}
	 * method: delete
	 * param: key - {string} 键值
	 */
	public function delete($key) {
		$db = model('File');
		$rst = $db->_delete($key);
		if($rst == 0) {
			return sucess(true);
		} else {
			return fail('删除文件失败');
		}
	}
}
?>