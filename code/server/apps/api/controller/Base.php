<?php
namespace app\api\controller;

use think\Controller;

class Base extends Controller
{
    public function _initialize() {
    		if(!session('?profile')) {
    			header('HTTP/1.1 403 Unauthorized');
			exit;
    		}
    }
}
?>