<?php
 // 仅限于form表单形式， json形式无法获取 
    // $username = $_GET["username"];
	// $pass = $_GET["password"];
	// echo $pass;
	// echo $username;
	// 	$username = trim($_GET["username"]);
 // 修改传输到php数据为json格式
 header("Content-Type: application/json");
//允许所有跨域
 header("Access-Control-Allow-Origin:*");

 // 引用另外一个文件
 include "public/connect_db.php";
 //获取ajax，post请求的json格式数据
 $json = json_decode(file_get_contents("php://input"));
 //得到json里的相应属性
    $username = $json -> username;
    $password = $json -> password;
//链接数据库
	$link = new db();
	$sql = "SELECT * from xinxi where name='$username' and password='$password'";
	//调用该实例方法
	$row = $link->Query($sql,2);

	if($row){
		//存在
		$arr = array("msg"=>"用户密码正确","code"=>"200","data"=>array("token"=>$row['token'],"user-id"=>$row['id'],"img"=>$row['img']));
	}else {
		$arr = array("msg"=>"用户密码输入错误","code"=>"100");
	}
	echo json_encode($arr);
?>