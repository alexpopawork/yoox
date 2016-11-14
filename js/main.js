$(document).ready( function () {
	
	var totalNews = $(".news-article").length;
	var hiddenNews = $(".news-article.hidden").length;
	
	//Make next ant previous slides partially visible
	$('#ynapCarousel.carousel .item').each(function () {
		var next = $(this).next();
		if (!next.length) {
			next = $(this).siblings(':first');
		}
		next.children(':first-child').clone().appendTo($(this));
		if (next.next().length > 0) {
			next.next().children(':first-child').clone().appendTo($(this));
		} else {
			$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
		}
	});
	
	//If all the news but the first one are hidden, hide show-less button
	if(totalNews - hiddenNews <= 1){
		$(".show-less").hide();
	}
	
	//If there's no more article to show, hide the show-more button
	if(hiddenNews == 0){
		$(".show-more").hide();
	};
	
	//Show-more button handler
	$(".show-more").on("click", function(){
		if(hiddenNews != 0){
			$(".news-article.hidden").each(function(){
				$(this).fadeIn("slow").removeClass("hidden");
				hiddenNews--;
			});
			$(".show-less").show();
			$(this).hide();
		};
	});
	
	//Show-less button handler
	$(".show-less").on("click", function(){
		if(totalNews - hiddenNews > 1){
			$(".news-article").not(".hidden").not(".news-article:first").each(function(){
				$(this).fadeOut("slow", function(){
					$(this).addClass("hidden");
				});
				hiddenNews++;
			});
		};
		if(hiddenNews >= totalNews-1){
			$(this).hide();
		};
		if(hiddenNews > 0){
			$(".show-more").show();
		};
	});
	
	//Ajax menu handler
	$("div.yoox-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
		getJson($(this));
		
	});
	
	//Inital ajax call for menu initialization
	getJson($("div.yoox-tab-menu>div.list-group>a:first"));
	
	//Ajax call
	function getJson(obj){
		var tabName = obj.attr("href").replace("#", "");
		$.ajax({
			method: "GET",
			dataType: "text",
			url: "data/"+tabName+".json",
		}).done(function(data) {
			var product = jQuery.parseJSON(data);
			$(".yoox-tab-content .name").html(product.item.name);
			$(".yoox-tab-content .details").html(product.item.details);
			$(".yoox-tab-content .composition").html(product.item.composition);
			$(".yoox-tab-content .modelDetails").html(product.item.modelDetails.join("<br />"));
			$("#productCarousel").html("");
			for(var i = 0; i < product.item.images.length; i++){
				var active = (i == 0) ? "active" : "";
				$("#productCarousel").append('<div class="item '+active+'"><img src="'+product.item.images[i]+'" alt=""></div>');
				$("#productCarousel").carousel();
			}
		}).fail(function(){
			console.log("Errore nella chiamata ajax");
		});
	};
	
});