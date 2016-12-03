;
(function($){
	$(function(){
			//存放所有省市区信息的对象
			var address = {};
			$(".place").on('click',function() {
				$("#address_info").show();
				// 读取address.json文件中的内容
				$.getJSON("html/address.json",function(data){
					// console.log(data);
					var reg = data.regions;// 所有地区
						for (var i = 0; i < reg.length; i++) {
							// console.log(reg[i]);
							var province = reg[i];//获取到当前遍历到的省份
								address[province.name] = {};//相当于address["内蒙古"] = {};
							var cities = province.regions;//获取当前省份下的所有城市
							if (!cities) {
								continue;
							}
							// 遍历当前省份下的所有城市
							for (var j = 0; j < cities.length; j++) {
								var city = cities[j];//当前遍历到的城市
									address[province.name][city.name] = city.regions;//相当于address["内蒙古"]["呼伦贝尔"] = [];

							}
						}
						// 初始化省份
						initProvince();			
				});
			});

			// 初始化省份信息
			function initProvince(){
				var html="";
				for (var attr in address) {
					// console.log(attr);
					html += "<option value = '"+attr+"'>"+attr+"</option>";
				}
				$(html).appendTo(":input[name='province']");
				// 初始化城市信息
				initCity();
			}

			// 初始化城市信息
			function initCity(){
				//获取当前选择的省份名称
				var prov = $(":input[name='province']").val();
				//根据省份找到address对象中找到该属性的值
				var cities = address[prov];
				// console.log(cities);
				
				var html="";
				for (var attr in cities) {
					html+="<option value='"+attr+"'>"+attr+"</option>";
				}
				$(":input[name='city']").empty().append(html);

				initDistrict();
			}
			function initDistrict(){
				//获取当前选择的省份与城市名称
				var prov = $(":input[name='province']").val(),
					cit = $(":input[name='city']").val();
				// 根据省份与城市名称找到address对象中对应区县的属性值
				var districts = address[prov][cit];
				// console.log(districts);

				// 遍历所有区县
				var html="";

				for (var i = 0; i < districts.length; i++) {
						html += "<option value='"+districts[i].name+"'>"+districts[i].name+"</option>";				
				}

				$(":input[name='district']").empty().append(html);
			}
			//省份选择改变
			$(":input[name='province']").on('change',initCity);
			// 城市选择改变
			$(":input[name='city']").on('change',initDistrict);
		});
})(jQuery);