/**
 * @author @bxcn
 */
(function(window) {
  // 匿名函数立即执行
  var domJs = domJs || (function() {

    var readyList, readyState = false, DOMContentLoaded, document = window.document, rootDomJs,
    // domJs函数返回的是一个new对象 可以在它的上面定义静态方法，只有一份
    domJs = function(selector) {
      return new domJs.fn.init(selector);
    };

    domJs.fn = domJs.prototype = {
      constructor : domJs,
      init : function(selector) {

        // 验证是否传过来的seletor是function\
        // rootDomJs = domJs(document)
        // 实现调用方法：
        // domJs(function(){
        //   这里是匿名函数体
        // });
        if( typeof selector === "function") {
          return rootDomJs.ready(selector);
        }
        return this;
      },
      ready : function(fn) {
        // 当第一个函数加载起来时才会调用bindReady函数体，并且只调用一次
        domJs.bindReady();
        // 把fn都存到数组中
        readyList.done(fn);
      }
    };
    domJs.fn.init.prototype = domJs.fn;

    /////////////////////////////////////以下定义的方法都静态方式/////////////////////////////////////////////////////

    /*
    * Dom解析完成后执行，并且只执行一次
    */
    domJs.ready = function() {
      if(!!readyState) {
        return false;
      }
      readyState = true;
      readyList.actionCallBack();
    }

    domJs._Deferred = function() {
      var callback = [], deferred = {
        done : function(fn) {
          // 把所以加载到DomJs中的函数都放到callback数组中缓存
          callback.push(fn);
        },
        // 执行所以加载到DomJs对角中的函数
        actionCallBack : function() {
          for(var i = 0, len = callback.length; i < len; i++) {
            callback[i].call(this);
          }
        }
      }
      return deferred;
    }

    domJs.bindReady = function() {

      // 只执行一次
      if(readyList) {
        return;
      }
      // 第一次执行时
      readyList = domJs._Deferred();

      // 以下函数体只执行一次
      if(document.readyState === "complete") {
        return setTimeout(domJs.ready, 1);
      }

      if(document.addEventListener) {
        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
        window.addEventListener("load", domJs.ready, false);
      }

      if(document.attachEvent) {
        document.attachEvent("onreadystatechange", DOMContentLoaded);
        window.attachEvent("onload", domJs.ready);

      }
    }
    domJs.addEvent = function(el, type, fn) {

      if(window.addEventListener) {
        el.addEventListener(type, fn, false);
      } else if(window.attachEvent) {
        el.attachEvent("on" + type, fn);
      } else {
        el["on" + type] = fn;
      }
    }
    domJs.getId = function(id) {
      return document.getElementById(id);
    }
    // 定义DOMContentLoaded 当DOM解析完成后调用函数， 解除DOMContentLoaded绑定并且调用domJs.ready()
    if(document.addEventListener) {
      DOMContentLoaded = function() {
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        domJs.ready();
      };

    } else if(document.attachEvent) {
      DOMContentLoaded = function() {
        if(document.readyState === "complete") {
          document.detachEvent("onreadystatechange", DOMContentLoaded);
          domJs.ready();
        }
      };
    }

    // rootDomJs = domJs(document) 支持以下调用方式
    // 实现调用方法：
    // domJs(function(){
    //   这里是匿名函数体
    // });
    rootDomJs = domJs(document);

    return domJs;

  })();

  window.domJs = domJs;

})(window);
(function(window, undefined) {

  var getScrollTop = function(val) {

    var scrollTop = 0;
    if( typeof val === "undefined") {

      if( typeof window.pageYOffset != 'undefined') {//pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset;
      } else if( typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollTop = document.documentElement.scrollTop;
      } else if( typeof document.body != 'undefined') {
        scrollTop = document.body.scrollTop;
      }
    } else {
      document.body.scrollTop = val;
      document.documentElement.scrollTop = val;
      if( typeof document.body != 'undefined') {
        document.body.scrollTop = val;
      } else if( typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        document.documentElement.scrollTop = val;
      }
    }
    return scrollTop;
  }
  var HookAction = {
    hookArr : [],
    add : function(fn) {
      if( typeof fn === "function") {
        HookAction.hookArr.push(fn);
      }
    },
    action : function() {
      var fn;
      var hookArr = HookAction.hookArr;
      for(var i = 0, len = hookArr.length; i < len; i++) {
        fn = hookArr[i];
        if( typeof fn === "function") {
          fn();
        }
      }
    }
  }

  // 初始化浏览器的宽度和高度
  var CLIENTWIDTH = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
  var CLIENTHEIGHT = document.documentElement.clientHeight || document.body.clientHeight || window.innerWidth;

  var JshScrollTag = function(id, param) {
    var o = param;
    id = o.id = document.getElementById(id);
    var id = o.id;
    var baseSize = o.baseSize;
    var offsetWidth = id.offsetWidth;
    var offsetHeight = id.offsetHeight;
    var startMoveTop = o.startMoveTop;
    var startTop = o.startTop;
    var bind = o.bind;
    var posTop = o.posTop || 0;
    id.style.position = "absolute";

    var children = [];
    if( typeof bind !== "undefined") {
    
      children = $(id).children();
      children.each(function(i, data ){ 
        $(data).click(function(){
          var pos = $(data).attr("pos");
          bind[2](data, i, children, getScrollTop());
          $(window).scrollTop($("#"+pos).offset().top);
          children.removeClass("on");
          $(data).addClass("on");
        });
     });
     $(window).scroll(function(){
        var scrollTop = getScrollTop();
        children.each(function(i, data ){
          var pos = $(data).attr("pos");
          if (scrollTop >= $("#"+pos).offset().top -200 ) {
            bind[2](data, i, children, getScrollTop());
            children.removeClass("on");
          $(data).addClass("on");
          }
        });
     });
     $(window).load(function(){
      var scrollTop = getScrollTop();
      children.each(function(i, data ){
        var pos = $(data).attr("pos");
        if (scrollTop >= $("#"+pos).offset().top -200 ) {
          bind[2](data, i, children, getScrollTop());
          children.removeClass("on");
          $(data).addClass("on");
        }
      });
    });

    }
 
    var fn = function() {

      var display = JshScrollTag.getCss(id, "display");

      if(display == "none")
        return false;

      var scrollTop = getScrollTop();

      var isIE = !!window.ActiveXObject;
      var isIE6 = isIE && !window.XMLHttpRequest;

      if(!isIE6) {

        id.style.position = "fixed";
 
        // 自定义top位置
        if( typeof o.pos == "undefined") {
          scrollTop = 0;
          startTop = o.startTop;
        } else if(scrollTop <= startMoveTop) {
          startTop = o.startTop;
          scrollTop = getScrollTop();
          id.style.position = "absolute";
        } else {
          scrollTop = 0;
          startTop = posTop;
        }
      } else {
        scrollTop = getScrollTop();
      }

      JshScrollTag[o.direction](o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop);
    }
    fn.call();
    HookAction.add(fn);
  }
  JshScrollTag.prototype = {
    constructor : JshScrollTag
  }

  JshScrollTag.setClass = function(o, className) {
    if(o.className) {
      o.className = className;
    } else {
      o.setAttribute("class", className);
    }

  }
  JshScrollTag.addClass = function(o, selector) {
    if(!o)
      return false;

    var className = (o.className || o.getAttribute("class") ) + " " + selector;

    JshScrollTag.setClass(o, className);

    return true;
  }
  JshScrollTag.removeClass = function(arr, selector) {

    if(!o)
      return false;

    var className, o;
    //  图片切换时，小按钮也对应改变
    for(var i = 0, len = arr.length; i < len; i++) {
      o = arr[i];
      className = sliderButton.className || sliderButton.getAttribute("class");

      if(className.indexOf(selector) > -1) {
        className = className.replace(selector, "");
        JshScrollTag.setClass(o, className);
      }
    }
    return true;
  }
  // 重新获取浏览器的宽度和高度
  JshScrollTag.reClient = function() {
    CLIENTWIDTH = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    CLIENTHEIGHT = document.documentElement.clientHeight || document.body.clientHeight || window.innerWidth;
  }

  JshScrollTag.top = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = (CLIENTWIDTH - offsetWidth ) / 2;
    var top = 0;

    /**
     判断是否设置top的定位 如果未设置自动调整垂直居中对齐
     */
    if( typeof startMoveTop === "undefined") {
      top = scrollTop;
    } else {
      top = startTop
    }

    if(scrollTop >= startMoveTop) {
      top = scrollTop;
    }

    if(CLIENTWIDTH <= left) {
      left = CLIENTWIDTH - offsetWidth;
    }

    JshScrollTag.css(o.id, top, left);

  }
  JshScrollTag.center = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = (CLIENTWIDTH - offsetWidth ) / 2;
    var top = (CLIENTHEIGHT - offsetHeight ) / 2 + scrollTop;

    if(CLIENTWIDTH <= left) {
      left = CLIENTWIDTH - offsetWidth;
    }

    JshScrollTag.css(o.id, top, left);

  }
  JshScrollTag.bottom = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = (CLIENTWIDTH - offsetWidth ) / 2;
    var top = CLIENTHEIGHT - offsetHeight + scrollTop;

    if(CLIENTWIDTH <= left) {
      left = CLIENTWIDTH - offsetWidth;
    }

    JshScrollTag.css(o.id, top, left);

  }
  JshScrollTag.left = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = (CLIENTWIDTH - baseSize ) / 2 - offsetWidth;
    var top = 0;

    /**
     判断是否设置top的定位 如果未设置自动调整垂直居中对齐
     */
    if( typeof startTop === "undefined") {
      top = (CLIENTHEIGHT - offsetHeight) / 2 + scrollTop;
    } else {
      top = startTop
    }

    if(scrollTop >= startMoveTop) {
      top = scrollTop;
    }
    if(0 > left || typeof baseSize === "undefined") {
      left = 0;
    }

    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.right = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = (CLIENTWIDTH - baseSize ) / 2 + baseSize;
    var top = 0;

    /**
     判断是否设置top的定位 如果未设置自动调整垂直居中对齐
     */
    if( typeof startTop === "undefined") {
      top = (CLIENTHEIGHT - offsetHeight) / 2 + scrollTop;
    } else {
      top = startTop
    }

    /**
     兼容IE6
     */
    if(scrollTop >= startMoveTop) {
      top = scrollTop;
    }

    if(CLIENTWIDTH -offsetWidth <= left) {
      left = CLIENTWIDTH - offsetWidth;
    }

    if( typeof baseSize === "undefined") {
      left = CLIENTWIDTH - offsetWidth;
    }

    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.topRight = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = CLIENTWIDTH - offsetWidth;
    var top = scrollTop;
    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.topLeft = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = 0;
    var top = scrollTop;
    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.bottomLeft = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = 0;
    var top = CLIENTHEIGHT - offsetHeight + scrollTop;
    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.bottomRight = function(o, baseSize, offsetWidth, offsetHeight, startMoveTop, startTop, scrollTop) {

    var left = CLIENTWIDTH - offsetWidth;
    var top = CLIENTHEIGHT - offsetHeight + scrollTop;
    JshScrollTag.css(o.id, top, left);
  }
  JshScrollTag.css = function(id, top, left) {
    id.style.top = top + "px";
    id.style.left = left + "px";
  }
  JshScrollTag.getCss = function(obj, attr) {
    if(obj.currentStyle) {
      return obj.currentStyle[attr];
      //只适用于IE
    } else if(window.getComputedStyle) {

      return getComputedStyle(obj,false)[attr];
      //只适用于FF,Chrome,Safa
    }

    return obj.style[attr];
    //本人测试在IE和FF下没有用,chrome有用
  };
  window.JshScrollTag = function(id, param) {
    new JshScrollTag(id, param);
  };

  domJs.addEvent(window, "scroll", HookAction.action);
  domJs.addEvent(window, "resize", function() {
    JshScrollTag.reClient();
    HookAction.action();
  });
})(window);
