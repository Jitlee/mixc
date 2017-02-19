<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件

function success($data, $msg = null) {
	header('Access-Control-Allow-Origin:*');
	header('Access-Control-Allow-Methods:*');
	header('Access-Control-Allow-Headers: X-Requested-With');
	return json([
		'code'	=> 200,
		'msg'	=> $msg,
		'rst'	=> $data
	]);
}

function fail($msg, $code = 500) {
	header('Access-Control-Allow-Origin:*');
	header('Access-Control-Allow-Methods:*');
	header('Access-Control-Allow-Headers: X-Requested-With');
	return json([
		'code'	=> $code,
		'msg'	=> $msg,
		'rst'	=> null
	]);
}

/**
 * 生成UUID 单机使用
 * @access public
 * @return string
 */
function uuid() {
    $charid = md5(uniqid(mt_rand(), true));
    $uuid = substr($charid, 0, 8)
           .substr($charid, 8, 4)
           .substr($charid,12, 4)
           .substr($charid,16, 4)
           .substr($charid,20,12);
    return $uuid;
}