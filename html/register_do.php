<?php  

// 当前文件作用：保存注册用户信息到数据库中
// {"status":0, "msg":"success"} -- 用户注册成功
// {"status":1, "msg":"failed"} -- 用户注册失败

header('Content-Type:text/html;charset=utf-8');
header("Access-Control-Allow-Origin:*"); //允许任何访问(包括ajax跨域) 
$host='localhost';//主机  
$user='root';//数据库账号  
$password='root';//数据库密码  
$database='smuser';//数据库名  
@mysql_connect($host,$user,$password) or die("error");//连接数据库管理系统  
@mysql_select_db($database);//选择操作数据库  
@mysql_query("SET NAMES utf8");//设置设置UTF-8编码(JSON的唯一编码)，数据库整理为：utf8_general_ci，以此达到输出中文简体的目的  

$username = $_POST['username'];
$password = $_POST['password'];
$sql = "INSERT INTO user (username, password) VALUES ('".$username."', '".$password."')";

$res = @mysql_query($sql);
if($res) { //成功
    $ret = array(
        'status' => 0, // 0成功，1失败
        'msg'   => 'success'
    );
    echo json_encode($ret);
    exit();
} else { //失败
    $ret = array(
        'status' => 1, // 0成功，1失败
        'msg'   => 'failed'
    );
    echo json_encode($ret);
    exit();
}

?>