
$.imgLazyLoad();
$(function () {
    /*首屏全屏*/
    var cheight = $(window).height()-30;
    $('.banner').css('height', cheight);

    /*首屏动画*/
    var direction = 'down';
    (function () {
        var css = {
            'top': '30px'
        };
        if (direction === 'down') {
            direction = 'top';
            css.top = '122px';
        } else {
            direction = 'down';
        }
        $('.arrowdown').animate(css, 800, arguments.callee);
    })();

    /*祝福数量*/
    var getNum = function () {
        var num, now = Date.now(), end = new Date(2016, 10, 6, 23, 59, 59), xi = .2;
        if (now > end) {
            xi = .02;
        }
        num = Math.ceil(600000 - (end - now) / 1000 * xi);
        if (num <= 100) {
            num = 1000;
        }
        return num;
    }

    $('#bless-count').text(getNum)

    /*大事件切换*/
    var htmlString = $('.picList').html();
    var clicknum = 0;
    $('.event-prev').click(function () {
        var length = $(".picList li[class!='clone']").length;
        clicknum++;
        $('.red').removeClass('red').parent().parent().prev().find('.event-dot').addClass('red');
        if (clicknum > length - 1) {
            $('.event-dot').removeClass('red');
            $(".picList li[class!='clone']").eq(2).find('span').addClass('red');
            clicknum = 0;
            $('.picList').html(htmlString)
        }
    })
    $('.event-next').click(function () {
        var length = $(".picList li[class!='clone']").length;
        clicknum++;
        $('.red').removeClass('red').parent().parent().next().find('.event-dot').addClass('red');
        if (clicknum > length - 1) {
            $('.event-dot').removeClass('red');
            $(".picList li[class!='clone']").eq(2).find('span').addClass('red');
            clicknum = 0;
            $('.picList').html(htmlString)
        }
    })

    /*分享功能*/
    $('.shareBtn').mouseover(function () {
        $(this).find('ul').show();
        $(this).addClass('shareHover');
    }).mouseout(function () {
        $(this).find('ul').hide();
        $(this).removeClass('shareHover');
    });

    $('.shareBtn').each(function (index) {
        $(this).find('a').click(function () {
            var shareTitle = $('.bless-detail a h2').eq(index).text();
            var shareUrl = $('.bless-detail a').eq(index).prop('href');
            switch (this.className) {
                case 's_txwb':
                    window.open('http://v.t.qq.com/share/share.php?title=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl), '转播到腾讯微博', 'width=700,height=680,top=0,left=0,toolbar=no,menubar=no, scrollbars=no,location=yes,resizable=no,status=no');
                    break;
                case 's_qzone':
                    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl), '分享到QQ空间', 'width=700,height=680,top=0,left=0,toolbar=no,menubar=no, scrollbars=no,location=yes,resizable=no,status=no');
                    break;
                case 's_qq':
                    window.open('http://connect.qq.com/widget/shareqq/index.html?title=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl), '分享给QQ好友和群组');
                    break;
                case 's_sina':
                    window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl), '转播到新浪微博', 'width=700,height=680,top=0,left=0,toolbar=no,menubar=no, scrollbars=no,location=yes,resizable=no,status=no');
                    break;
            }
        });

    });
})

    /* 第一个大轮播 */
    jQuery(".slider .bd li").first().before(jQuery(".slider .bd li").last());
jQuery(".slider").hover(function () {
    jQuery(this).find(".arrow").stop(true, true).fadeIn(300)
}, function () {
    jQuery(this).find(".arrow").fadeOut(300)
});
jQuery(".slider").slide({
    mainCell: ".bd ul",
    effect: "leftLoop",
    vis: 3,
    mouseOverStop: false,
    autoPlay: true,
    autoPage: true,
    trigger: "click"
});

jQuery(".focusBox").slide({
    mainCell: ".scontent1",
    effect: "fold",
    autoPlay: true,
    mouseOverStop: false,
    delayTime: 300
});

/*祝福轮播*/
jQuery(".bless-box").slide({
    titCell: ".num li",
    mainCell: ".pic",
    effect: "fold",
    autoPlay: true,
    trigger: "click"
});

/*历任校长轮播*/
jQuery(".TB-focus").slide({mainCell: ".bd ul", effect: "fold", autoPlay: true, trigger: "click"});

/*大事记轮播*/
jQuery(".picScroll").slide({mainCell: ".picList", effect: "leftLoop", vis: 5, scroll: 1, autoPage: true});

/*流金岁月*/
jQuery(".time-box").slide({mainCell: ".time-main", effect: "fold", autoPlay: true, trigger: "click"});
