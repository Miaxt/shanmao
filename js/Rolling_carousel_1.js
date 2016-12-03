function animates( elementsul,elementsli,elements){
//{
//	elementsul:图片ul
//	elementsli:图片li
//}
		$(window).on("load",function(){//在页面文档内容加载完毕后执行
				var $lis = elementsli,//总的图片张数，获取出来的是一个jQuery对象
					len = $lis.length,//图片总长度
					liWidth = $lis.eq(0).outerWidth(),//获取li中第一张图片的宽度
					index = 2,//即将显示的图片索引
					html = "",//空字符串用来保存创建的div小圆点
					timer = null,//计时器
					//为了实现无缝滚动，在最前面和最后面再各复制一张收尾的图片
					$first = $lis.eq(0).clone(true),//复制第一张图片
					$last = $lis.eq(len - 1).clone(true);//复制最后一张

			//将复制的图片添加到最前面和最后面的位置
			elementsul.append($first).prepend($last);
			len +=2;//总长度加2

			//容器整个宽度:图片宽度*图片张数
			elementsul.width(len * liWidth) ;
			// 初始显示轮播图片，最开始那张隐藏
			elementsul.css("left",-liWidth);

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
			$(html).appendTo(".pages_4").eq(0).addClass("curr").end()
									  .on("click",function(){
									  		index = $(this).index() + 1;
									  		move();
									  });

			//为鼠标悬停在图片上面设置事件，即当鼠标悬停在图片上面，图片暂停滚动；当鼠标离开之后再重新滚动	  
			elements.hover(function(){//相当于mouseenter；
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
				console.log($(".pages_4 div"))
				//动画
				elementsul.animate({left:_left},function(){
						if(index === len){//判断index增长到最后一张图片之后时，还原为初始状态
							elementsul.css("left",-liWidth);//重新定位图片
							index = 2;
						}else if (index === 1) {//当向上移动到第一张图片的时候
							elementsul.css("left",-1 * (len -2) * liWidth);//图片定位
							index = len - 1; //图片索引切换至最后一张	
						}
				});
			}

		});

}
$(function(){
	animates($(".floor_content_left ul"),$(".floor_content_left li"),$(".floor_content_left"));
	animates($(".floor_content_left_1 ul"),$(".floor_content_left_1 li"),$(".floor_content_left_1"));
})