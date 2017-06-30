$(function () {
    'use strict';

    //����ˢ��ҳ��
    $(document).on("pageInit", "#page-ptr", function(e, id, page) {
        var $content = $(page).find(".content").on('refresh', function(e) {
            // ģ��2s�ļ��ع���
            setTimeout(function() {
                var cardHTML = '<div class="card">' +
                    '<div class="card-header">����</div>' +
                    '<div class="card-content">' +
                    '<div class="card-content-inner">����������������������������������������������������������������������������������������' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $content.find('.card-container').prepend(cardHTML);
                // $(window).scrollTop(0);
                // ���������Ҫ����
                $.pullToRefreshDone($content);
            }, 2000);
        });
    });

    //���޹���
    $(document).on("pageInit", "#page-infinite-scroll-bottom", function(e, id, page) {
        var loading = false;
        // ÿ�μ�����Ӷ�����Ŀ
        var itemsPerLoad = 20;
        // ���ɼ��ص���Ŀ
        var maxItems = 100;
        var lastIndex = $('.list-container li').length;
        function addItems(number, lastIndex) {
            // ��������Ŀ��HTML
            var html = '';
            for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
                html += '<li class="item-content"><div class="item-inner"><div class="item-title">����Ŀ</div></div></li>';
            }
            // �������Ŀ
            $('.infinite-scroll .list-container').append(html);
        }
        $(page).on('infinite', function() {
            // ������ڼ��أ����˳�
            if (loading) return;
            // ����flag
            loading = true;
            // ģ��1s�ļ��ع���
            setTimeout(function() {
                // ���ü���flag
                loading = false;
                if (lastIndex >= maxItems) {
                    // ������ϣ���ע�����޼����¼����Է�����Ҫ�ļ���
                    $.detachInfiniteScroll($('.infinite-scroll'));
                    // ɾ��������ʾ��
                    $('.infinite-scroll-preloader').remove();
                    return;
                }
                addItems(itemsPerLoad,lastIndex);
                // ���������ص����
                lastIndex = $('.list-container li').length;
                $.refreshScroller();
            }, 1000);
        });
    });

    //�������޹���
    $(document).on("pageInit", "#page-infinite-scroll-top", function(e, id, page) {
        function addItems(number, lastIndex) {
            // ��������Ŀ��HTML
            var html = '';
            for (var i = lastIndex+ number; i > lastIndex ; i--) {
                html += '<li class="item-content"><div class="item-inner"><div class="item-title">��Ŀ'+i+'</div></div></li>';
            }
            // �������Ŀ
            $('.infinite-scroll .list-container').prepend(html);

        }
        var timer = false;
        $(page).on('infinite', function() {
            var lastIndex = $('.list-block li').length;
            var lastLi = $(".list-container li")[0];
            var scroller = $('.infinite-scroll-top');
            var scrollHeight = scroller[0].scrollHeight; // ��ȡ��ǰ����Ԫ�صĸ߶�
            // ������ڼ��أ����˳�
            if (timer) {
                clearTimeout(timer);
            }

            // ģ��1s�ļ��ع���
            timer = setTimeout(function() {

                addItems(20,lastIndex);

                $.refreshScroller();
                //  lastLi.scrollIntoView({
                //     behavior: "smooth",
                //     block:    "start"
                // });
                // ����������λ������Ϊ���¹���Ԫ�ظ߶Ⱥ�֮ǰ�ĸ߶Ȳ�
                scroller.scrollTop(scroller[0].scrollHeight - scrollHeight);
            }, 1000);
        });

    });
    //test demo js

    //�����ǩҳ�µ����޹���
    $(document).on("pageInit", "#page-fixed-tab-infinite-scroll", function(e, id, page) {
        var loading = false;
        // ÿ�μ�����Ӷ�����Ŀ
        var itemsPerLoad = 20;
        // ���ɼ��ص���Ŀ
        var maxItems = 100;
        var lastIndex = $('.list-container li')[0].length;
        function addItems(number, lastIndex) {
            // ��������Ŀ��HTML
            var html = '';
            for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
                html += '<li class="item-content""><div class="item-inner"><div class="item-title">����Ŀ</div></div></li>';
            }
            // �������Ŀ
            $('.infinite-scroll.active .list-container').append(html);
        }
        $(page).on('infinite', function() {
            // ������ڼ��أ����˳�
            if (loading) return;
            // ����flag
            loading = true;
            var tabIndex = 0;
            if($(this).find('.infinite-scroll.active').attr('id') == "tab2"){
                tabIndex = 0;
            }
            if($(this).find('.infinite-scroll.active').attr('id') == "tab3"){
                tabIndex = 1;
            }
            lastIndex = $('.list-container').eq(tabIndex).find('li').length;
            // ģ��1s�ļ��ع���
            setTimeout(function() {
                // ���ü���flag
                loading = false;
                if (lastIndex >= maxItems) {
                    // ������ϣ���ע�����޼����¼����Է�����Ҫ�ļ���
                    //$.detachInfiniteScroll($('.infinite-scroll').eq(tabIndex));
                    // ɾ��������ʾ��
                    $('.infinite-scroll-preloader').eq(tabIndex).hide();
                    return;
                }
                addItems(itemsPerLoad,lastIndex);
                // ���������ص����
                lastIndex =  $('.list-container').eq(tabIndex).find('li').length;
                $.refreshScroller();
            }, 1000);
        });
    });

    //ͼƬ�����
    $(document).on("pageInit", "#page-photo-browser", function(e, id, page) {
        var myPhotoBrowserStandalone = $.photoBrowser({
            photos : [
                '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
                '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
                '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
            ]
        });
        //���ʱ��ͼƬ�����
        $(page).on('click','.pb-standalone',function () {
            myPhotoBrowserStandalone.open();
        });
        /*=== Popup ===*/
        var myPhotoBrowserPopup = $.photoBrowser({
            photos : [
                '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
                '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
                '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
            ],
            type: 'popup'
        });
        $(page).on('click','.pb-popup',function () {
            myPhotoBrowserPopup.open();
        });
        /*=== �б��� ===*/
        var myPhotoBrowserCaptions = $.photoBrowser({
            photos : [
                {
                    url: '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
                    caption: 'Caption 1 Text'
                },
                {
                    url: '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
                    caption: 'Second Caption Text'
                },
                // ���û�б���
                {
                    url: '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
                },
            ],
            theme: 'dark',
            type: 'standalone'
        });
        $(page).on('click','.pb-standalone-captions',function () {
            myPhotoBrowserCaptions.open();
        });
    });


    //�Ի���
    $(document).on("pageInit", "#page-modal", function(e, id, page) {
        var $content = $(page).find('.content');
        $content.on('click','.alert-text',function () {
            $.alert('����һ����ʾ��Ϣ');
        });

        $content.on('click','.alert-text-title', function () {
            $.alert('����һ����ʾ��Ϣ', '�����Զ���ı���!');
        });

        $content.on('click', '.alert-text-title-callback',function () {
            $.alert('�����Զ�����İ�', '�����Զ���ı���!', function () {
                $.alert('������ȷ����ť!')
            });
        });
        $content.on('click','.confirm-ok', function () {
            $.confirm('��ȷ����?', function () {
                $.alert('������ȷ����ť!');
            });
        });
        $content.on('click','.prompt-ok', function () {
            $.prompt('���ʲô����?', function (value) {
                $.alert('�������������"' + value + '"');
            });
        });
    });

    //������
    $(document).on("pageInit", "#page-action", function(e, id, page) {
        $(page).on('click','.create-actions', function () {
            var buttons1 = [
                {
                    text: '��ѡ��',
                    label: true
                },
                {
                    text: '����',
                    bold: true,
                    color: 'danger',
                    onClick: function() {
                        $.alert("��ѡ���ˡ�������");
                    }
                },
                {
                    text: '����',
                    onClick: function() {
                        $.alert("��ѡ���ˡ����롰");
                    }
                }
            ];
            var buttons2 = [
                {
                    text: 'ȡ��',
                    bg: 'danger'
                }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups);
        });
    });

    //������ʾ��
    $(document).on("pageInit", "#page-preloader", function(e, id, page) {
        $(page).on('click','.open-preloader-title', function () {
            $.showPreloader('������...')
            setTimeout(function () {
                $.hidePreloader();
            }, 2000);
        });
        $(page).on('click','.open-indicator', function () {
            $.showIndicator();
            setTimeout(function () {
                $.hideIndicator();
            }, 2000);
        });
    });


    //ѡ����ɫ����
    $(document).on("click", ".select-color", function(e) {
        var b = $(e.target);
        document.body.className = "theme-" + (b.data("color") || "");
        b.parent().find(".active").removeClass("active");
        b.addClass("active");
    });

    //picker
    $(document).on("pageInit", "#page-picker", function(e, id, page) {
        $("#picker").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      ��ť\
      </button>\
      <button class="button button-link pull-right close-picker">\
      ȷ��\
      </button>\
      <h1 class="title">����</h1>\
      </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3'],
                    cssClass: 'picker-items-col-normal'
                }
            ]
        });
        $("#picker-name").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">ȷ��</button>\
      <h1 class="title">��ѡ��ƺ�</h1>\
      </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: ['��', 'Ǯ', '��', '��', '��', '��', '֣', '��']
                },
                {
                    textAlign: 'center',
                    values: ['����', '��', '��', 'С��', '����', '�Ʒ�', 'Baby']
                },
                {
                    textAlign: 'center',
                    values: ['����', 'С��']
                }
            ]
        });
    });
    $(document).on("pageInit", "#page-datetime-picker", function(e) {
        $("#datetime-picker").datetimePicker({
            toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">ȷ��</button>\
      <h1 class="title">ѡ�����ں�ʱ��</h1>\
      </header>'
        });
    });

    $(document).on("pageInit", "#page-city-picker", function(e) {
        $("#city-picker").cityPicker({
            value: ['���', '�Ӷ���']
            //value: ['�Ĵ�', '�ڽ�', '������']
        });
    });

    $.init();
});
