;
(function($){
		$(function(){
			var pic_previewWidth = $(".pic_preview").width(),
				pic_previewHeight = $(".pic_preview").height(),

				magnifierWidth = $(".magnifier").width(),
				magnifierHeight = $(".magnifier").height(),

				bigWidth = $(".pic_preview_magnifier").width(),
				bigHeight = $(".pic_preview_magnifier").height(),

				differTop = pic_previewWidth - magnifierHeight,
				differLeft = pic_previewWidth - magnifierWidth,

				roteX = bigWidth / magnifierWidth,
				roteY = bigHeight / magnifierHeight;

				
				// console.log(roteX,roteY)
				
				$(".pic_preview_magnifier img").css({
					width:roteX * pic_previewWidth,
					height:roteY * pic_previewWidth
				});

			$(".pic_preview").hover(function() {
				$(".magnifier,.pic_preview_magnifier").show();
			}, function() {
				$(".magnifier,.pic_preview_magnifier").hide();
			}).on('mousemove',function(e) {
				e = e || event;
				var x = e.pageX,
					y = e.pageY;

				$(".magnifier").offset({
					top : y - magnifierHeight/2,
					left : x - magnifierWidth/2
				});

				var cor = $(".magnifier").position(),
					_top = cor.top,
					_left = cor.left;

				if(_left<0){
					_left = 0;
				}else if (_left > differLeft) {
					_left = differLeft;
				}
				if(_top<0){
					_top=0;
				}else if (_top > differTop) {
					_top = differTop;
				}

				$(".magnifier").css({
					top:_top,
					left:_left
				});
				
				$(".pic_preview_magnifier img").css({
					top : -1*roteY*_top,
					left:-1*roteX*_left
				});
			});
		});
})(jQuery);