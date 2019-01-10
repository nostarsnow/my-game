<?php
include "../../../conn/conn.0303.php";
@$action=$_REQUEST["action"];
$json = array();
$errcode = 0;
$errmsg = "";
if ( @$action == "reg" ){
    @$name = $_REQUEST["name"];
    @$tel = $_REQUEST["tel"];
    @$openid = $_REQUEST["openid"];
    @$active = $_REQUEST["active"];
    @$score = $_REQUEST["score"];
    $tsql_callSP = "{call Showpic_addUser( ?,?,?,?,? )}";
    $params = array( u2g($name),$tel,$openid,$active,$score );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result)){
         while($row = sqlsrv_fetch_array($result)){
            $errcode = $row["errcode"];
            $errmsg = g2u($row["errmsg"]);
         }
    }else{
        $errmsg = "注册成功！";
    }
}else if( $action == "queryInfo"){
    @$openid = $_REQUEST["openid"];
    @$active = $_REQUEST["active"];
    if ( !isset($openid) || !isset($active) ){
        $errcode = 1;
        $errmsg = "参数错误！";
    }else{
        $tsql_callSP = "{call Lot_queryUserInfo( ?,? )}";
        $params = array( $openid,$active );
        $result = sqlsrv_query( $conn, $tsql_callSP, $params);
        if(is_resource($result) && sqlsrv_has_rows($result)){
             while($row = sqlsrv_fetch_array($result)){
                $json["name"] = g2u($row["name"]);
                $json["tel"] = $row["tel"];
                $json["score"] = $row["score"];
                $json["note"] = $row["note"];
                $errmsg = "查询成功！";
            }
        }else{
            $errcode = 2;
            $errmsg = "查询失败！";
        }
    }
}else if( $action == "choose"){
    @$openid = $_REQUEST["openid"];
    @$active = $_REQUEST["active"];
    @$img = $_REQUEST["img"];
    @$name = $_REQUEST["name"];
    @$tel = $_REQUEST["tel"];
    @$note = $_REQUEST["note"];
    $tsql_callSP = "{call ShowPic_addDay( ?,?,?,?,?,? )}";
    $params = array( $openid,$active,$img,u2g($name),$tel,u2g($note));
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result)){
        while($row = sqlsrv_fetch_array($result)){
            if ( @$row["errcode"] == 1 ){
                @$errcode = $row["errcode"];
                @$errmsg = "今天已经领取过了，明天再来吧！";
            }else{
                @$errcode = $row["errcode"];
                @$errmsg = g2u($row["errmsg"]);
            }
         }
    }else{
        $errcode = 2;
        $errmsg = "添加失败！";
    }
}else if ( $action == "queryDetailList" ){
    @$openid = $_REQUEST["openid"];
    @$active = $_REQUEST["active"];
    $json["list"] = array();
    $tsql_callSP = "{call Lot_queryUserDetailList( ?,? )}";
    $params = array( $openid,$active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if( @is_resource($result) && sqlsrv_has_rows($result) ){
        while($row = sqlsrv_fetch_array($result)){
            $json["list"][] = array(
                "oid"=> $row["oid"],
                "light" => $row["score"],
                "num" => $row["step"],
                "gift" => $row["gift"],
                "isExchange" => $row["isExchange"]
            );
        }
    }
}else if ( $action == "queryDetail" ){
    @$oid = $_REQUEST["oid"];
    @$active = $_REQUEST["active"];
    $json["list"] = array();
    $tsql_callSP = "{call Lot_queryUserDetail( ?,? )}";
    $params = array( $oid,$active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if( @is_resource($result) && sqlsrv_has_rows($result) ){
        while($row = sqlsrv_fetch_array($result)){
            $json["list"][] = array(
                "name"=> g2u($row["name"]),
                "oid"=> $row["oid"],
                "openid"=> $row["openId"],
                "light" => $row["score"],
                "num" => $row["step"]
            );
        }
    }
}else if( $action == "activeNum"){
    @$active = $_REQUEST["active"];
    $tsql_callSP = "{call ActiveNum_add( ?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
}else if( $action == "shareNum"){
    @$active = $_REQUEST["active"];
    $tsql_callSP = "{call ShareNum_add( ?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
}else if( $action == "getActiveUserNum"){
    @$active = $_REQUEST["active"];
    $tsql_callSP = "{call GetActiveUserNum(?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result) && sqlsrv_has_rows($result)){
         while($row = sqlsrv_fetch_array($result)){
            $json["num"] = $row["num"];
            $json["activeNum"] = $row["activeNum"];
            $errmsg = "查询成功！";
        }
    }else{
        $errcode = 2;
        $errmsg = "查询失败！";
    }
}else if( $action == "refuel"){
    @$openid = $_REQUEST["openid"];
    @$oid = $_REQUEST["oid"];
    @$active = $_REQUEST["active"];
    $tsql_callSP = "{call ActiveRefuel( ?,?,? )}";
    $params = array( $openid,$active,$oid );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result)){
        while($row = sqlsrv_fetch_array($result)){
            if ( @$row["errcode"] == 1 ){
                $errcode = $row["errcode"];
                $errmsg = "您今天已经帮Ta助力过啦~";
            }else if ( @$row["errcode"] == 3 ) {
                $errcode = $row["errcode"];
                $errmsg = "活动已结束！谢谢您的参与！";
            }else{
                $json["step"] = $row["step"];
                $errmsg = "助力成功！";
            }
         }
    }else{
        $errcode = 2;
        $errmsg = "失败！";
    }
}else if ( $action == "queryGiftList"){
    @$active = $_REQUEST["active"];
    $json["list"]  = array();
    $tsql_callSP = "{call GetActiveGiftList(?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if( @is_resource($result) && sqlsrv_has_rows($result) ){
        while($row = sqlsrv_fetch_array($result)){
            $json["list"][$row["giftId"]] = g2u($row["giftName"]);
        }
    };
}else if ( $action == "queryActivePriseList"){
    @$active = $_REQUEST["active"];
    $json["list"]  = array();
    $tsql_callSP = "{call GetActivePriseList(?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if( @is_resource($result) && sqlsrv_has_rows($result) ){
        while($row = sqlsrv_fetch_array($result)){
            $json["list"][] = array(
                "name" => g2u($row["name"]),
                "tel" => $row["tel"],
                "giftName" => g2u($row["giftName"])
            );
        }
    }else{
        $errcode = 2;
        $errmsg = "查询失败！";
    }
}else if ( $action == "gift"){
    @$oid = $_REQUEST["oid"];
    @$active = $_REQUEST["active"];
    @$super = $_REQUEST["super"];
    @$openid = $_REQUEST["openid"];
    $hasPrize = rand(0,100);
    $prizeNum = 0;
    $prize = array();
    $randArr = array();
    $tsql_callSP = "{call GetActiveGiftList(?)}";
    $params = array( $active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if( @is_resource($result) && sqlsrv_has_rows($result) ){
        while($row = sqlsrv_fetch_array($result)){
            $prize[$row["giftId"]] = array(
                "giftName" => g2u($row["giftName"]),
                "giftCurNum" => $row["giftCurNum"]
            );
            if ( $row["giftCurNum"] != 0 ){
                $prizeNum = $row["giftCurNum"];
                @$randArr[$row["giftId"]] = $row["giftProbability"];
                $giftProbability = $row["activeProbability"];
            }
        }
    };
    if ( $prizeNum == 0 || $hasPrize > $giftProbability ){
        $randPrise = 0;
    }else{
        $randPrise = get_rand($randArr);
    }
    //print_r($randPrise);
    $tsql_callSP = "{call GetActiveGift(?,?,?,?,?)}";
    $params = array( $randPrise,$oid,$active,$super,$openid );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result)){
         while($row = sqlsrv_fetch_array($result)){
            $errcode = $row["errcode"];
            $errmsg = g2u($row["errmsg"]);
            @$json["gift"] = $row["gift"];
            @$json["giftName"] = $prize[$randPrise]["giftName"];
         }
    }
}else if ( @$action == "giftExchange" ){
    @$oid = $_REQUEST["oid"];
    @$pwd = $_REQUEST["pwd"];
    @$active = $_REQUEST["active"];
    $tsql_callSP = "{call UserGiftExchange( ?,?,? )}";
    $params = array( $oid,$pwd,$active );
    $result = sqlsrv_query( $conn, $tsql_callSP, $params);
    if(is_resource($result)){
         while($row = sqlsrv_fetch_array($result)){
            $errcode = $row["errcode"];
            $errmsg = g2u($row["errmsg"]);
         }
    }
}
$json["errcode"] = $errcode;
$json["errmsg"] = $errmsg;
echo json_encode($json);
?>