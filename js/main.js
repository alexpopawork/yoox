$(document).ready( function () {
	
	var totalNews = $(".news-article").length;
	var hiddenNews = $(".news-article.hidden").length;
	
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
			console.log(data);
			var product = jQuery.parseJSON(data);
			$(".yoox-tab-content .name").html(product.item.name);
			$(".yoox-tab-content .details").html(product.item.details);
			$(".yoox-tab-content .composition").html(product.item.composition);
			$(".yoox-tab-content .modelDetails").html(product.item.modelDetails.toString().replace(/(?:\r\n|\r|\n)/g, '<br />'));
		}).fail(function(){
			console.log("Errore nella chiamata ajax");
		});
	};
	
});