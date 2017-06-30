var user_id_str;//get
var token_str;//get
var corpid_str;//get
var target_str;

var target;
var userid;
var token;

var baseUrl = "http://temple.zjqq.mobi";
//获取get参数id
function getPar(par){
    //获取当前URL
    var local_url = document.location.href.split("#")[0];
    //获取要取得的get参数位置
    var get = local_url.indexOf(par +"=");
    if(get == -1){
        return "";
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}
//获取get参数#
function getTarget(){
    //获取当前URL
    var local_url = document.location.href;
    var get_par = local_url.lastIndexOf("#")>-1?local_url.substring(local_url.lastIndexOf("#")+1):"";
    return get_par;
}
function oauth(){
    user_id_str = getPar("userid");
    token_str = getPar("token");
    corpid_str = getPar("corpid");
    target = window.localStorage.getItem("target");
    if(user_id_str&&token_str&&corpid_str){
        window.localStorage.setItem("userid",user_id_str);
        window.localStorage.setItem("token",token_str);
        window.localStorage.setItem("corpid",corpid_str);
        window.location.href="index.html?corpid="+corpid_str+"#"+target;
    }else{
        userid = window.localStorage.getItem("userid");
        token = window.localStorage.getItem("token");
        corpid = window.localStorage.getItem("corpid");
        if(userid&&token&&corpid){
            return true;
        }else{
            redirect();
        }
    }
}
function redirect(){
    var href = window.location.href;
    // window.location.href = "http://temple.zjqq.mobi/auth/index?corpid="+corpid_str+"&url="+href;
}
function selectFileImage(fileObj){
    $.showPreloader('上传中...');
    var file = fileObj.files['0'];
    var name = file.name;
    $("#page4 .upload .name span").html(name);
    $("#page4 .upload .name i").css("opacity","1");
    //图片方向角 added by lzk
    var Orientation = null;

    if (file) {
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            showMyTips("请选择jpeg、png格式的图片");
            return;
        }
        //获取照片方向角属性，用户旋转控制
        EXIF.getData(file, function() {
            EXIF.getAllTags(this);
            Orientation = EXIF.getTag(this, 'Orientation');
        });

        var oReader = new FileReader();

        oReader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function() {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;

                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                    expectWidth = 800;
                    expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                    expectHeight = 1200;
                    expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                }
                var canvas = document.createElement("canvas");
                //var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext("2d");
                canvas.width = expectWidth;
                canvas.height = expectHeight;
                ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                var base64 = null;
                var mpImg = new MegaPixImage(image);
                mpImg.render(canvas, {
                    maxWidth: 800,
                    maxHeight: 1200,
                    quality: 1,
                    orientation: Orientation
                });
                base64 = canvas.toDataURL("image/jpeg", 0.8);
                var data = {
                    "corpid":corpid,
                    "userid":userid,
                    "token":token,
                    "code":base64
                }
                $.ajax({
                    type: "post",
                    url:baseUrl+"/campus/txl/saveimg",
                    data:data,
                    dataType:"json",
                    async: true,
                    error: function(request) {
                        $.alert("提交失败，请重试");
                        $("#page4 .upload .name i").attr("class","wrong");
                    },
                    success: function(data) {
                        console.log(data)
                        $.hidePreloader();
                        if(data.state == "ok"){

                            $("#page4 .upload .name i").attr("class","right");
                            $("#page4 .upload").attr("data-src",data.data);
                        }else{
                            $.alert(data.msg);
                        }

                    }
                });
            };
        };
        oReader.readAsDataURL(file);
    }
}

$(function(){
    var page1_flag = false;
    var page2_flag = false;
    var page1_p = 1;
    var view_user_id ;//查看的人的id
    //var typeid ;
    var ids = [];
    if(!oauth()){
        return;
    }
    $(document).on("pageInit", "#page1", function(e, id, page) {
        var loading = false;
        var maxItems = 0;
        var num = 20;
        var lastIndex = 0;
        var flag = false;//是否有过初始化
        if(!page1_flag){
            $.showPreloader();
            getData();
        }
        function getData(){
            var userData = {
                "corpid":corpid,
                "userid":userid,
                "token":token,
                "page":page1_p,
                "num":num
            }
            $.ajax({
                type: "post",
                async: false,
                data:userData,
                url:baseUrl+"/campus/txl/classlist",
                dataType: "json",
                error: function (request) {
                    console.log(request);
                },
                success: function (data) {
                    switch (data.state) {
                        case "token":
                            redirect();
                            break;
                        case "error":
                            $.alert(data.msg);
                            break;
                        case "ok":
                            window.localStorage.setItem("auth",data.data.auth);
                            page1_flag = true;
                            maxItems = data.data.count;
                            if(maxItems<=0){
                                $(page).find(".rowCon").html("<p style='line-height: 4em;text-align: center;margin: 0'>暂无信息</p>");
                                $.hidePreloader();
                                return;
                            }

                            addItemsLeft(data.data.list);
                            break;
                        default :
                            $.alert("未知错误");
                            break;
                    }
                }
            });
        }
        function addItemsLeft(d){
            var str = '';
            for(var i = 0;i<d.length;i++){
                if(i==0&&lastIndex==0){
                    str+='<li class="active" data-id="'+d[i]["class_id"]+'"><div class="inner"><div class="item-title">'+d[i]["name"]+'</div></div></li>';
                }else{
                    str+='<li data-id="'+d[i]["class_id"]+'"><div class="inner"><div class="item-title">'+d[i]["name"]+'</div></div></li>';
                }
            }
            $(page).find(".left ul").append(str);
            $(page).find(".infinite-scroll-preloader").css("opacity","0");
            loading = false;
            page1_p++;
            $.hidePreloader();
        }
        $(page).one("click",".right li",function(){
            //typeid = parseInt($(this).attr("data-type"))
            //window.localStorage.setItem("typeid",);
            window.localStorage.setItem("classid",parseInt($(".left li.active").attr("data-id")));
            window.localStorage.setItem("typeid",parseInt($(this).attr("data-type")));
            window.localStorage.setItem("target","page2");
            $.router.load("#page2",true);
        });
        $(page).on('infinite', function() {
            // 如果正在加载，则退出
            if (loading) {
                return;
            }
            loading = true;
            lastIndex = $('.left li').length;
            if(lastIndex>=maxItems){
                $.detachInfiniteScroll($('.left'));
                $('.left .infinite-scroll-preloader').remove();
                return;
            }
            $(page).find(".left .infinite-scroll-preloader").css("opacity","1");
            getData();
        });
    });
    $(document).on("beforePageSwitch","#page2",function(){
        $("#page2").find("ul").html(" ");
        $("#page2").find("header").removeClass("bar");
        $("#page2").find("header").removeClass("active");
        $("#page2").find("header").addClass("noactive");
        $("#page2").find("header .btn_send").removeClass("on");
    })
    $(document).on("pageInit", "#page2", function(e, id, page) {
        var loading = true;
        var maxItems = 0;
        var lastIndex = 0;
        var num = 20;
        var p = 1;
        var classid = parseInt(window.localStorage.getItem("classid"));
        var typeid = parseInt(window.localStorage.getItem("typeid"));
        $.showPreloader();
        getData();
        if(typeid == 2&&window.localStorage.getItem("auth")=="1"){
            $(page).find("header").addClass("bar");
            $("#page3 .send").css("display","block");
        }else{
            $("#page3 .send").hide();
        }
        function getData(){
            if(!classid||!typeid){
                $.router.load("#page1",true);
                return;
            }
            var userData = {
                "corpid":corpid,
                "userid":userid,
                "token":token,
                "class":classid,
                "type":typeid,
                "page":p,
                "num":num
            }
            //console.log(userData);
            $.ajax({
                type: "post",
                async: false,
                data:userData,
                url:baseUrl+"/campus/txl/classuser",
                dataType: "json",
                error: function (request) {
                    console.log(request);
                },
                success: function (data) {
                    //console.log(data);
                    switch (data.state) {
                        case "token":
                            redirect();
                            break;
                        case "error":
                            $.alert(data.msg);
                            break;
                        case "ok":
                            page2_flag = true;
                            maxItems = data.data.count;
                            if(maxItems<=0&&p==1){
                                //alert("111");
                                $(page).find("ul").html("<p style='line-height: 4em;text-align: center;margin: 0'>暂无信息</p>");
                                $.hidePreloader();
                                return;
                            }
                            addItems(data.data.list);
                            break;
                        default :
                            $.alert("未知错误");
                            break;
                    }
                }
            });
        }
        function addItems(d){
            var str = '';
            for(var i = 0;i<d.length;i++){
                if(d[i]["avatar"]){
                    str+='<li data-id="'+d[i]["id"]+'"><div class="inner"><div class="check"></div><div class="user"><i style="background-image: url('+d[i]["avatar"]+')"></i></div><div class="text">'+d[i]["name"]+'</div><div class="arrow"></div></div></li>';
                }else{
                    str+='<li data-id="'+d[i]["id"]+'"><div class="inner"><div class="check"></div><div class="user"><i></i></div><div class="text">'+d[i]["name"]+'</div><div class="arrow"></div></div></li>';
                }

            }
            $(page).find("ul").append(str);
            $.refreshScroller();
            $(page).find(".infinite-scroll-preloader").css("opacity","0");

            loading = false;
            p++;
            $.hidePreloader();
        }
        $(document).on('infinite',"#page2 .content", function() {
            // 如果正在加载，则退出
            if (loading) {
                return;
            }
            loading = true;
            lastIndex = $(page).find('li').length;
            //console.log(maxItems);
            if(lastIndex>=maxItems){
                //console.log("-----------------------");
                $.detachInfiniteScroll($(page).find(".content"));
                $('.infinite-scroll-preloader').remove();
                return;
            }
            $(page).find(".infinite-scroll-preloader").css("opacity","1");
            getData();
        });
    });
    $(document).on("pageInit","#page3",function(){
        var typeid = parseInt(window.localStorage.getItem("typeid"));
        if(typeid == 2&&window.localStorage.getItem("auth")=="1"){
            $("#page3 .send").css("display","block");
        }else{
            $("#page3 .send").hide();
        }
        getUserData();
        function getUserData(){
            var userData = {
                "corpid":corpid,
                "userid":userid,
                "token":token,
                "class":window.localStorage.getItem("classid"),
                "id":window.localStorage.getItem("view_user_id")
            }
            $.ajax({
                type: "post",
                async: false,
                data:userData,
                url:baseUrl+"/campus/txl/userinfo",
                dataType: "json",
                error: function (request) {
                    console.log(request);
                },
                success: function (data) {
                    switch (data.state) {
                        case "token":
                            redirect();
                            break;
                        case "error":
                            $.alert(data.msg);
                            //$.router.load("#page1",true);
                            break;
                        case "ok":
                            initData(data.data);
                            break;
                        default :
                            $.alert("未知错误");
                            break;
                    }
                }
            });
        }
        function initData(d){
            if(d.avatar){
                $("#page3 .headCon .head").css("background-image","url("+d.avatar+")");
            }else{
                $("#page3 .headCon .head").css("background-image","url(http://mat1.gtimg.com/zj/yuwanli/dzw1610/addressList/images/icon_user_default.png)");
            }
            $("#page3 .headCon .name").html(d.name);
            $("#page3 .send").attr("data-id",d.id);
            $("#page4 .head span").html(d.name);
            $("#page4 .submitCon .num span").html("1");
            $("#page3 .info .mobile .value").html(d.mobile);
            if(window.localStorage.getItem("typeid")=="1"){
                $("#page3 .info .user .value").html("内部人员");
            }else if(window.localStorage.getItem("typeid")=="2"){
                $("#page3 .info .user .value").html("香客");
            }else{
                $("#page3 .info .user .value").html("腻腻");
            }

            $("#page3 .info .tel .value").html(d.email==null?"无":d.email);
        }
    });



    $(document).on("beforePageSwitch","#page4",function(){
        $("#page4 .head span").html("XXX");
        $("#page4 .upload .name span").html(" ");
        $("#page4 .upload .name i").css("opacity","0");
        $("#page4 .upload .name i").attr("class","");
        $("#page4 .upload").attr("data-src","");
        $("#page4 .textCon textarea").val(' ');
        ids = [];
    });
    $(document).on("pageInit","#page4",function(){
        if(ids.length<=0){
            $.router.back();
        }
    });




    //page1
    $(document).on("tap","#page1 .left li",function(){
        $("#page1").find(".left li").removeClass("active");
        $(this).addClass("active");
    });
    //page1


    //page2
    $(document).on("tap","#page2 .btn_send",function(){
        $("#page2").find("header").toggleClass("active");
        $("#page2").find("header").toggleClass("noactive");
        $(this).toggleClass("on");
    });
    $(document).on("tap","#page2 .next",function(){
        var length = $("#page2 header.active~.content li.active").length;
        if(length<=0){
            $.alert("请至少选择一位");
            return;
        }
        var name = $($("#page2 header.active~.content li.active")[0]).find(".text").html();
        //$("#page4 .head span").html(name+'等<b style="font-size: 24px">'+length+'位</b>家长');
        $("#page4 .head span").html(name+'等<b style="font-size: 24px">'+length+'位</b>');
        $("#page4 .submitCon .num span").html(length);
        $.each($("#page2 header.active~.content li.active"),function(i,e){
            ids.push($(e).attr("data-id"));
        });
        //console.log(ids);
        $.router.load("#page4",true);
    });
    $(document).on("tap",'#page2 header.active .box',function(){
        $(this).toggleClass("checked");
        if($(this).hasClass("checked")){
            $("#page2 header.active~.content li").addClass("active");
        }else{
            $("#page2 header.active~.content li").removeClass("active");
        }
        $("header.active .text span").html($("#page2 header.active~.content li.active").length);
    });
    $(document).on("tap","#page2 header.active~.content li",function(){
        $(this).toggleClass("active");
        $("header.active .text span").html($("#page2 header.active~.content li.active").length);
    });
    $(document).on("tap","#page2 header.noactive~.content li",function(){
        view_user_id = $(this).attr("data-id");
        window.localStorage.setItem("view_user_id",$(this).attr("data-id"));
        ids = [];
        ids.push(view_user_id);
        $.router.load("#page3",true);
    });
    //page2


    //page3
    $(document).on("tap","#page3 .send",function(){
        var id = $(this).attr("data-id");
        ids.push(id);
        $.router.load("#page4",true);
    });
    //page3

    //page4
    $(document).on("tap","#page4 .submitCon .send",function(){
        $.showPreloader('发送中...');
        var text = $("#page4 .textCon textarea").val();
        var src = $("#page4 .upload").attr("data-src");
        if(!text&&!src){
            return;
        }
        var data = {
            "corpid":corpid,
            "userid":userid,
            "token":token,
            "class":window.localStorage.getItem("classid"),
            "text":text,
            "ids":JSON.stringify(ids),
            "image":src
        }
        $.ajax({
            type: "post",
            async: false,
            data:data,
            url:baseUrl+"/campus/txl/sendmsg",
            dataType: "json",
            error: function (request) {
                console.log(request);
            },
            success: function (data) {
                $.hidePreloader();
                switch (data.state) {
                    case "token":
                        redirect();
                        break;
                    case "error":
                        //console.log(data);
                        $.alert(data.msg);
                        break;
                    case "ok":
                        if(data.state == "ok"){
                            $.toast(data.msg,500);
                            setTimeout(function(){
                                $.router.back();
                            },500)
                        }
                        break;
                    default :
                        $.alert("未知错误");
                        break;
                }
            }
        });
    })
    //page4


    $.init();
})
