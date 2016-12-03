;
(function($){
$(function(){
			//点击 “添加到购物车”
			$(".middle_addtocar").on('click', function(event){
				event.preventDefault();
				//获取的数据
				var _id = $(".prod_item_number_id").text(),
					_name = $(".pic_preview_goods_name").text(),
					_price = parseFloat($(".summary_price_detail").text()),
					_imgsrc = $(".pic_preview_show").eq(0).attr("src");
				//创建对象
				var product = {
					id : _id,
					name : _name,
					price : _price,
					src : _imgsrc,
					amount : 1
				};
				/*将当前选购商品信息保存到cookie中*/
				$.cookie.json = true;//库里面的插件配置
				var products = $.cookie("products");
					if(!products)
						products = [];
					// 判断在products数组中是否已有当前选购的商品信息
					// 如果已有，则直接修改数量amount
					var index = exists(_id,products);
						if(index !== -1 ){//如果存在
							products[index].amount++;
						}else {//不存在
							products.push(product);
						}
						$.cookie("products",products,{expires:7,path:"/"});
					// 提示购买成功
					var $success = $("<div style='width:100px;height:30px;border:1px solid;background:#fff;'>添加成功,点击购买查看</div>");
					$(".purchase_success").append($success);
					setTimeout(function(){
						$success.remove();
					},500);
			});
			// 查找指定选购商品id在数组products中是否已经存在
			// 返回已存在的商品的下标
			// 如果不存在，则返回-1
			function exists(id,products){
				var idx = -1;//保存的是在数组中对应id元素存在时的下标
				// 遍历products数组
				// 每一个元素都会调用回调函数
				// 回调函数中第一个参数为遍历元素的索引
				// 第二个参数为遍历到的元素
				// return false相当于循环中break，退出循环
				$.each(products,function(index,element){
					if(element.id === id){
						idx = index;
						return false;
					}
				});
				return idx;
			}
	});
})(jQuery);

(function($){
	$(function(){
			/*从cookie中读取购物车中的所有信息，展示*/
			$.cookie.json = true;//在保存、读取购物车数据时自动装换数据类型
			var products = $.cookie("products");
				if(!products || products.length === 0){//购物车里不存在数据
					$(".products_info_list").html("购物车为空,<a href='list.html'>继续购物</a>");
					return;
				}

			//循环遍历读取到的购物车信息
			$.each(products,function(index,element){
				$(".products_info_list:first").clone(true).appendTo(".products_info").data("product",element)
				   .find('.pro_goods_msg').text(element.name).end()
				   .find('.goods_img_source').attr('src', element.src).end()
				   .find('.pro_info_goods_id').text(element.id).end()
				   .find('.pro_info_price_one').text(element.price).end()					  
				   .find('.goods_num').val(element.amount).end()
				   .find(".small_sum").text(element.price * element.amount);
			});

			$(".products_info_list:first").remove();

			/*删除行的商品*/
			$(".delate_goods").on('click',function() {
				// 获取选中删除链接所在行的product的对象
				var $row = $(this).parents('.products_info_list'),
				// console.log($row.data("product"));
					prod = $row.data('product');
					console.log(prod)
				// 查找prod在products数组中的索引
				var index = $.inArray(prod,products);
				//如果索引存在(>=0)
				if(index !== -1){
					products.splice(index,1);//从数组中移除一个元素
					// 将删除后的数组保存回cookie
					$.cookie("products",products,{expires:7,path:"/"});
					// 从页面中移除行
					$row.remove();
				}
				if(index === -1){
					$(".products_info_list_more").html("购物车为空,<a href='list.html'>继续购物</a>");
				}
			});

			/*商品数量增减操作*/
			// 商品减
			$(".goods_reduce").on('click',function() {
				//减号所在的行
				var $row = $(this).parents(".products_info_list");
				//获取行中原有的数量
				var amount = parseInt($row.find('.goods_num').val());
					if(amount <= 1){
						return;
					}	
					//计算减后的数量
					amount -= 1;
					// 将计算后的数量保存到cookie中对应的商品数量中
					$row.data("product").amount = amount;
					//更新cookie
					$.cookie("products",products,{expires:7,path:"/"});
					//将计算后的数量放回到页面中显示
					$row.find(".goods_num").val(amount);

					// 更新小计金额
					var _sub = (parseFloat($row.find(".pro_info_price_one").text()) * amount).toFixed(2);
					$row.find(".small_sum").text(_sub);
			});

			//商品加
			$(".goods_increase").on('click',function() {
				var $row = $(this).parents(".products_info_list");
				var amount = parseInt($row.find('.goods_num').val());
				if(amount >= 999){
					return;
				}
					amount += 1;
					$row.data("product").amount = amount;
					$.cookie("products",products,{expires:7,path:"/"});
					$row.find(".goods_num").val(amount);

					// 更新小计金额
					var _sub = (parseFloat($row.find(".pro_info_price_one").text()) * amount).toFixed(2);
					$row.find(".small_sum").text(_sub);
			});

			/*文本框输入,修改数量*/
			var tempNum = 0;
			$(".goods_num").on('focus',function() {
				tempNum = $(this).val();
			});

			$(".goods_num").on('blur', function() {
				// 获取输入的文本值
				// var v = this.value;//DOM获取输入框的值value
				var v = $(this).val();//jQuery获取输入框的值value
				//判断是否为数字
				if(!(/^[1-9]\d*$/.test(v))){//不为数字
					$(this).val(tempNum);
				}else {//为数字，则保存到cookie中，更新cookie

			var $row = $(this).parents(".products_info_list");
				$row.data("product").amount = v;
				$.cookie("products",products,{expires:7,path:"/"});

					// 更新小计金额
			var _sub = (parseFloat($row.find(".pro_info_price_one").text()) * parseInt(v)).toFixed(2);
				$row.find(".small_sum").text(_sub);
				}
			});

			/*全选*/
			$("#all_check,#result_select").on('click',function() {
				//获取 全选 复选框的选中状态
				//获取或者是设置诸如checked属性，要使用prop()方法
				// this.checked;
				// this.getAttribute("checked");
				var status =  $(this).prop("checked");
				//将所有商品前的复选框选中状态设置为全选的状态
				$("#select_store,#select_pro").prop("checked",status);
			});

			/*删除选中*/
			$(".del_pitchon").on('click',function() {
				//查找已选中的复选框
				var $ckProduct = $("input:checked");
				// 从数组中删除各选中行的商品对象
				$ckProduct.each(function (index,element) {
						var $row = $(this).parents(".products_info_list"),
							prod = $row.data("product"),
							index = $.inArray(prod,products);
						if(index !== -1){
							products.splice(index,1);
						}
				});
				// 存回到cookie中
				$.cookie("products",products,{expires:7,path:"/"});
				// 删除页面上的行dom元素
				$ckProduct.parents(".products_info_list").remove();
				if(products.length === 0){
					$(".products_info_list_more").html("购物车为空,<a href='list.html'>继续购物</a>");
					return;
				}
			});

			/*清空购物车*/
			$(".clear_shopcart").on('click', function() {
				//清除cookie
					$.removeCookie("products",{path:"/"});
					console.log(products);
					//清除页面商品元素
					$(".products_info_list").empty();
					$(".products_info_list").html("购物车为空,<a href='list.html'>继续购物</a>");
					return;
			});

			/*合计*/
			$(":checkbox").on('click',function() {
				//获取已选中的复选框
				var $ckProduct = $(".products_info_list input:checked");
				//获取各选中行的小计进行累加
				var total = 0;
				$ckProduct.each(function(index,element){
					total += parseFloat($(this).parents(".products_info_list").find(".small_sum").text());
				});
				// 显示合计金额
				$(".result_count_total").text(total.toFixed(2));
			});
	});
})(jQuery);
