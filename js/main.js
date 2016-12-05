$(document).ready( function () {
	
	//Selectors
	var mainCarousel = "#ynapCarousel";
	var showLessBtn = ".show-less";
	var showMoreBtn = ".show-more";
	var contactForm = "#contact-form";
	var productCarousel = "#productCarousel";
	var newsArticles = ".news-article";
	var hiddenNewsArticles = ".news-article.hidden";
	var ajaxMenuItems = "div.yoox-tab-menu>div.list-group>a";
	var errorImg = "<img src=\"img\\field_warning.png\" alt=\"\" />";
	var tabData = ".tab-data";
	
	//Make next and previous slides from the main slider partially visible
	$(mainCarousel+'.carousel .item').each(function () {
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
	
	//Initialize main carousel
	$(mainCarousel).carousel();
	
	var totalNews = $(newsArticles).length;
	var hiddenNews = $(hiddenNewsArticles).length;
	
	//If all the news but the first one are hidden, hide show-less button
	if(totalNews - hiddenNews <= 1){
		$(showLessBtn).hide();
	}
	
	//If there's no more article to show, hide the show-more button
	if(hiddenNews == 0){
		$(showMoreBtn).hide();
	};
	
	//Show-more button handler
	$(showMoreBtn).on("click", function(){
		if(hiddenNews != 0){
			$(hiddenNewsArticles).each(function(){
				$(this).fadeIn("slow").removeClass("hidden");
				hiddenNews--;
			});
			$(showLessBtn).show();
			$(this).hide();
		};
	});
	
	//Show-less button handler
	$(showLessBtn).on("click", function(){
		if(totalNews - hiddenNews > 1){
			$(newsArticles).not(".hidden").not(newsArticles+":first").each(function(){
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
			$(showMoreBtn).show();
		};
	});
	
	//Ajax menu handler
	$(ajaxMenuItems).click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
		getJson($(this));
		
	});
	
	//Inital ajax call for menu initialization
	getJson($(ajaxMenuItems+":first"));
	
	//Ajax call
	function getJson(obj){
		var tabName = obj.attr("href").replace("#", "");
		$.ajax({
			method: "GET",
			dataType: "text",
			url: "data/"+tabName+".json"
		}).done(function(data) {
			var product = jQuery.parseJSON(data);
			$.ajax({
				url: "templates/product.info.template.html"
			}).done(function(template) {
				//Sending data to mustache template to render the info box
				var rendered = Mustache.render(template, {
					prodName: product.item.name,
					prodDetails: product.item.details,
					prodComposition: product.item.composition,
					prodModelDetails: product.item.modelDetails.join("<br />")
				});
				$(tabData).html(rendered);
				
				//Creating image carousel for each product
				$(productCarousel).find(".carousel-inner").html("");
				for(var i = 0; i < product.item.images.length; i++){
					var active = (i == 0) ? "active" : "";
					$(productCarousel).find(".carousel-inner").append('<div class="item '+active+'"><img src="'+product.item.images[i]+'" alt=""></div>');
					$(productCarousel).carousel();
				}
			});
		}).fail(function(xhr, status, error){
			console.log("Errore nella chiamata ajax", xhr);
		});
	};
	
	//Form validation
	$(contactForm).validate({
		rules: {
			name: "required",
			email: {
				required: true,
				email: true
			},
			phone: {
				required: false,
				digits: true,
				maxlength: 11
			}
		},
		messages: {
			name: errorImg,
			email: errorImg,
			phone: errorImg
		},
		//Demo submission
		submitHandler: function (form, e) {
			e.preventDefault();
            $(contactForm).html("<h2 class=\"knockLight\">Thank you for your message. We'll get back to you soon.</h2>");
            //form.submit();
        }
	});
	
});