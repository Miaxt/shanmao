;
(function($){
	$(function(){
			var $lis = $(".banner_pic li"),//获取所有的li，即所有的图片张数
				len = $lis.length,//图片总长度
				currentIndex = 0,//当前图片索引
				nextIndex = 1,//即将显示的的图片索引
				html = "",//空字符串
				timer = null;//计时器

				// 动态创建小圆点
				for(var i = 0;i<len;i++){
					html +="<div></div>";
				}
				//小圆点的添加，样式，点击事件
				$(html).appendTo("#pages").eq(0).addClass('curr').end()
						.on('click', function() {
							if(currentIndex === $(this).index()){//当前索引为所点击的索引
									return;
							}
							nextIndex = $(this).index();//下一张图片索引就为你点击的图片索引
							move();
						});
				//向前翻页
				$("#prev").on('click',function() {
					nextIndex = currentIndex - 1;//下一张图片的索引为当前图片索引-1
					if(nextIndex < 0){//判断当到达第一张图片时
						nextIndex = len - 1;//下一张为最后一张图片索引
					}
					move();
				});
				//向后翻页
				$("#next").on('click',function() {
					move();
				});
				//当鼠标移至图片上面图片不在滚动，即悬停事件
				//jQuery 1.7 版本前该方法触发 mouseenter 和 mouseleave 事件。
				//jQuery 1.8 版本后该方法触发 mouseover 和 mouseout 事件。
				$(".banner_pic").hover(function(){//相当于触发mouseenter
						clearInterval(timer);//清除计时器
				},function(){
						timer = setInterval(move,3000);//重新设置计时器，开始move
				}).mouseleave();//.trigger("mouseleave");

				// setInterval(move,3000);
				//运动函数，即淡入淡出
				function move(){

					$lis.eq(currentIndex).fadeOut();
					$lis.eq(nextIndex).fadeIn();
					// 小圆点样式的动态变化
					$("#pages div").eq(nextIndex).addClass('curr').siblings().removeClass('curr');

					currentIndex = nextIndex;
					nextIndex++;
					// 当切换到最后一张时
					if(nextIndex === len){
						nextIndex = 0;
					}
				}
});
})(jQuery);


(function($){
		$(function(){//在 DOM 节点加载完毕即执行 
			$(window).on("load",function(){//在页面文档内容加载完毕后执行
				var $lis = $(".banner_ad li"),//总的图片张数，获取出来的是一个jQuery对象
					len = $lis.length,//图片总长度
					liWidth = $lis.eq(0).outerWidth(),//获取li中第一张图片的宽度
					index = 2,//即将显示的图片索引
					html = "",//空字符串用来保存创建的div小圆点
					timer = null,//计时器
					//为了实现无缝滚动，在最前面和最后面再各复制一张收尾的图片
					$first = $lis.eq(0).clone(true),//复制第一张图片
					$last = $lis.eq(len - 1).clone(true);//复制最后一张

			//将复制的图片添加到最前面和最后面的位置
			$(".banner_ad ul").append($first).prepend($last);
			len +=2;//总长度加2

			//容器整个宽度:图片宽度*图片张数
			$(".banner_ad ul").width(len * liWidth) ;
			// 初始显示轮播图片，最开始那张隐藏
			$(".banner_ad ul").css("left",-liWidth);

			//向上翻页
			$("#prev_1").on('click', function(){
				if($(".banner_ad ul").is(":animated")){//判断ul是否正在执行动画，防止多次点击“前一张”按钮出现动画变乱的现象
					return;
				}
				//点击之后图片索引-2
				index -= 2;
				move();
			});
			// 向下翻页
			$("#next_1").on('click', function(){
				//判断ul是否正在执行动画，防止多次点击“下一张”按钮出现动画变乱的现象
				if($(".banner_ad ul").is(":animated")){
					return;
				}
				move();
			});

			//创建页面小圆点
			/*for (var i = 0; i < len - 2; i++) {
				html += "<div>"+(i+1)+"</div>";
			}
			// 追加显示小圆点，设置小圆点样式，绑定点击事件
			$(html).appendTo("#pages").eq(0).addClass("curr").end()
									  .on("click",function(){
									  		index = $(this).index() + 1;
									  		move();
									  });*/

			//为鼠标悬停在图片上面设置事件，即当鼠标悬停在图片上面，图片暂停滚动；当鼠标离开之后再重新滚动	  
			$(".banner_ad").hover(function(){//相当于mouseenter；
				clearInterval(timer);
			},function(){
				timer = setInterval(move,3000);
			}).trigger('mouseleave');

			function move(){
				//设置图片重新定位的位置
				var _left = -1 * index *liWidth;
				// console.log(_left);
				// 根据显示的图片索引判断并计算小圆点
				//var circleIndex = index > len - 2 ? 0 : index - 1;//当显示到最后一张图片时重新设置为0，如果index比总长度的图片索引小，小圆点的索引就为index-1
				//$("#pages div").eq(circleIndex).addClass("curr").siblings().removeClass("curr");//再重新设置相应图片的小圆点的样式和移除其他图片的小圆点样式
				//index增加
				index ++;
				//动画
				$(".banner_ad ul").animate({left:_left},function(){
						if(index === len){//判断index增长到最后一张图片之后时，还原为初始状态
							$(".banner_ad ul").css("left",-liWidth);//重新定位图片
							index = 2;
						}else if (index === 1) {//当向上移动到第一张图片的时候
							$(".banner_ad ul").css("left",-1 * (len -2) * liWidth);//图片定位
							index = len - 1; //图片索引切换至最后一张	
						}
				});
			}

		});
	});
})(jQuery);

(function($){
		$(function(){//在 DOM 节点加载完毕即执行 
			$(window).on("load",function(){//在页面文档内容加载完毕后执行
				var $lis = $(".brand_right li"),//总的图片张数，获取出来的是一个jQuery对象
					len = $lis.length,//图片总长度
					liWidth = $lis.eq(0).outerWidth(),//获取li中第一张图片的宽度
					index = 2,//即将显示的图片索引
					html = "",//空字符串用来保存创建的div小圆点
					timer = null,//计时器
					//为了实现无缝滚动，在最前面和最后面再各复制一张收尾的图片
					$first = $lis.eq(0).clone(true),//复制第一张图片
					$last = $lis.eq(len - 1).clone(true);//复制最后一张

			//将复制的图片添加到最前面和最后面的位置
			$(".brand_right ul").append($first).prepend($last);
			len +=2;//总长度加2

			//容器整个宽度:图片宽度*图片张数
			$(".brand_right ul").width(len * liWidth) ;
			// 初始显示轮播图片，最开始那张隐藏
			$(".brand_right ul").css("left",-liWidth);

			/*//向上翻页
			$("#prev_1").on('click', function(){
				if($(".brand_right ul").is(":animated")){//判断ul是否正在执行动画，防止多次点击“前一张”按钮出现动画变乱的现象
					return;
				}
				//点击之后图片索引-2
				index -= 2;
				move();
			});
			// 向下翻页
			$("#next_1").on('click', function(){
				//判断ul是否正在执行动画，防止多次点击“下一张”按钮出现动画变乱的现象
				if($(".brand_right ul").is(":animated")){
					return;
				}
				move();
			});*/

			//创建页面小圆点
			for (var i = 0; i < len - 2; i++) {
				html += "<div></div>";
			}
			// 追加显示小圆点，设置小圆点样式，绑定点击事件
			$(html).appendTo("#pages_3").eq(0).addClass("curr").end()
									  .on("click",function(){
									  		index = $(this).index() + 1;
									  		move();
									  });

			//为鼠标悬停在图片上面设置事件，即当鼠标悬停在图片上面，图片暂停滚动；当鼠标离开之后再重新滚动	  
			$(".brand_right").hover(function(){//相当于mouseenter；
				clearInterval(timer);
			},function(){
				timer = setInterval(move,3000);
			}).trigger('mouseleave');

			function move(){
				//设置图片重新定位的位置
				var _left = -1 * index *liWidth;
				// console.log(_left);
				// 根据显示的图片索引判断并计算小圆点
				var circleIndex = index > len - 2 ? 0 : index - 1;//当显示到最后一张图片时重新设置为0，如果index比总长度的图片索引小，小圆点的索引就为index-1
				$("#pages_3 div").eq(circleIndex).addClass("curr").siblings().removeClass("curr");//再重新设置相应图片的小圆点的样式和移除其他图片的小圆点样式
				//index增加
				index ++;
				//动画
				$(".brand_right ul").animate({left:_left},function(){
						if(index === len){//判断index增长到最后一张图片之后时，还原为初始状态
							$(".brand_right ul").css("left",-liWidth);//重新定位图片
							index = 2;
						}else if (index === 1) {//当向上移动到第一张图片的时候
							$(".brand_right ul").css("left",-1 * (len -2) * liWidth);//图片定位
							index = len - 1; //图片索引切换至最后一张	
						}
				});
			}

		});
	});
})(jQuery);

(function($){
		$(function(){//在 DOM 节点加载完毕即执行 
			$(window).on("load",function(){//在页面文档内容加载完毕后执行
				var $lis = $(".floor_content_left li"),//总的图片张数，获取出来的是一个jQuery对象
					len = $lis.length,//图片总长度
					liWidth = $lis.eq(0).outerWidth(),//获取li中第一张图片的宽度
					index = 2,//即将显示的图片索引
					html = "",//空字符串用来保存创建的div小圆点
					timer = null,//计时器
					//为了实现无缝滚动，在最前面和最后面再各复制一张收尾的图片
					$first = $lis.eq(0).clone(true),//复制第一张图片
					$last = $lis.eq(len - 1).clone(true);//复制最后一张

			//将复制的图片添加到最前面和最后面的位置
			$(".floor_content_left ul").append($first).prepend($last);
			len +=2;//总长度加2

			//容器整个宽度:图片宽度*图片张数
			 $(".floor_content_left ul").width(2052) ;
			// 初始显示轮播图片，最开始那张隐藏
			$(".floor_content_left ul").css("left",-liWidth);

			/*//向上翻页
			$("#prev_1").on('click', function(){
				if($(".floor_content_left ul").is(":animated")){//判断ul是否正在执行动画，防止多次点击“前一张”按钮出现动画变乱的现象
					return;
				}
				//点击之后图片索引-2
				index -= 2;
				move();
			});
			// 向下翻页
			$("#next_1").on('click', function(){
				//判断ul是否正在执行动画，防止多次点击“下一张”按钮出现动画变乱的现象
				if($(".floor_content_left ul").is(":animated")){
					return;
				}
				move();
			});*/

			//创建页面小圆点
			for (var i = 0; i < len - 2; i++) {
				html += "<div></div>";
			}
			// 追加显示小圆点，设置小圆点样式，绑定点击事件
			$(html).appendTo(".pages_4").eq(0).addClass("curr").end()
									  .on("click",function(){
									  		index = $(this).index() + 1;
									  		move();
									  });

			//为鼠标悬停在图片上面设置事件，即当鼠标悬停在图片上面，图片暂停滚动；当鼠标离开之后再重新滚动	  
			$(".floor_content_left").hover(function(){//相当于mouseenter；
				clearInterval(timer);
			},function(){
				timer = setInterval(move,3000);
			}).trigger('mouseleave');

			function move(){
				//设置图片重新定位的位置
				var _left = -1 * index *liWidth;
				// console.log(_left);
				// 根据显示的图片索引判断并计算小圆点
				var circleIndex = index > len - 2 ? 0 : index - 1;//当显示到最后一张图片时重新设置为0，如果index比总长度的图片索引小，小圆点的索引就为index-1
				
				$(".pages_4 div").eq(circleIndex).addClass("curr").siblings().removeClass("curr");//再重新设置相应图片的小圆点的样式和移除其他图片的小圆点样式
	
				//index增加
				index ++;
				//动画
				$(".floor_content_left ul").animate({left:_left},function(){
						if(index === len){//判断index增长到最后一张图片之后时，还原为初始状态
							$(".floor_content_left ul").css("left",-liWidth);//重新定位图片
							index = 2;
						}else if (index === 1) {//当向上移动到第一张图片的时候
							$(".floor_content_left ul").css("left",-1 * (len -2) * liWidth);//图片定位
							index = len - 1; //图片索引切换至最后一张	
						}
				});
			}
		});
	});
})(jQuery);