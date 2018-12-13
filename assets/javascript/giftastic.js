$(document).ready(function(){
    var person;
    
    var tagArray = ["Patrick Stewart", "Keanu Reeves", "Peter Dinklage", "Nathan Fillion"];    
    var favoriteStillImageArray = [];
    var favoriteAnimatedImageArray = [];
    var favoriteRatingArray = [];

    // Possibly can create metaDataArray so as to dry up the createGifDivs
  
    var createGifDivs = function(num) {
        var gifDiv = $('<div>');
        gifDiv.appendTo('.allGifDiv').addClass('gifDiv gif'+num);
        
        var metaDiv = $('<div>').addClass('meta');
        var metaRatingDiv = $('<div>').addClass('metaDivs rating'+num);
        // var metaTitleDiv = $('<div>').addClass('metaDivs title'+num);
        // var metaSourceDiv = $('<div>').addClass('metaDivs source'+num);
        metaDiv.append(metaRatingDiv);

        var imageDiv = $('<img>').addClass('gif image'+num);

        var manipulateDiv = $('<div>').addClass('manipulate'+num);
        var downloadButton = $('<button>').addClass('manipulateDiv download'+num).text("Download");
        var favoriteButton = $('<button>').addClass('manipulateDiv favoriteButton').text("🖤").attr('data-number',num);
        manipulateDiv.append(downloadButton, favoriteButton);
        
        $('.gif'+num).append(metaDiv, imageDiv, manipulateDiv);
    };

    var createTagButtons = function(){
        for (var i = 0; i< tagArray.length; i ++) {
            var newTag = $('<button>')
            newTag.appendTo('.tagBar').addClass('tagButton tag'+i);
            newTag.text(tagArray[i]);
            newTag.attr('data-person',tagArray[i].toLocaleLowerCase());
            $('.tagBar').on('click','.tag'+i, function(){
                $('.allGifDiv').empty();
                person = $(this).attr('data-person');
                var queryUrl = "http://api.giphy.com/v1/gifs/search?q="+ person +"&api_key=ZiPmnqc9Wm82TSbo6W9q9gthL65HkCdi&limit=10";
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                    for (var j = 0; j < response.data.length; j ++) {
                        createGifDivs(j);
                        $('.image'+j).attr("src",response.data[j].images.fixed_height_still.url).attr("data-animated", response.data[j].images.fixed_height.url).attr("data-still", response.data[j].images.fixed_height_still.url).attr("data-state", "still");
                        $('.rating'+j).text(response.data[j].rating);
                        // $('.title'+j).text(response.data[j].title);
                        // $('.source'+j).html('<a href:"'+response.data[j].source+'"> Source </a>')
                    };
                })
            })
        }
    };

    $('.addTagBar').on('click','.inputButton', function(){
        event.preventDefault();
        for(var i = 0; i< tagArray.length; i ++) {
            $('.tagBar').off('click','.tag'+i);
        };
        var userTag = $('.tagInputText').val().trim();
        tagArray.push(userTag);
        $('.tagInputText').val("");
        $('.tagBar').empty();

        createTagButtons();
    })

    $('.allGifDiv').on('click','.gif', function(){
        var currentState = $(this).attr('data-state');
        if (currentState === "still") {
            var animated = $(this).attr("data-animated");
            $(this).attr('src',animated);
            $(this).attr("data-state", "animated");
        };
        if (currentState === "animated") {
            var still = $(this).attr("data-still");
            $(this).attr("src",still);
            $(this).attr("data-state","still");
        };
    });

    $('.allGifDiv').on('click','.favoriteButton', function(){
        var gifNumber = $(this).attr('data-number');
        var favoriteRating = $('.rating'+gifNumber).text();
        var favoriteStillImage = $('.image'+gifNumber).attr('data-still');
        var favoriteAnimatedImage = $('.image'+gifNumber).attr('data-animated');
        favoriteRatingArray.push(favoriteRating);
        favoriteStillImageArray.push(favoriteStillImage);
        favoriteAnimatedImageArray.push(favoriteAnimatedImage);

        localStorage.clear();
        localStorage.setItem("ratingList",JSON.stringify(favoriteRatingArray));
        localStorage.setItem("stillImageList",JSON.stringify(favoriteStillImageArray));
        localStorage.setItem("animatedImageList",JSON.stringify(favoriteAnimatedImageArray));
    });

    $('.showFavoritesButton').on('click', function(){
        favoriteRatingArray = JSON.parse(localStorage.getItem("ratingList"));
        favoriteStillImageArray = JSON.parse(localStorage.getItem('stillImageList'));
        favoriteAnimatedImageArray = JSON.parse(localStorage.getItem("animatedImageList"));
        $('.allGifDiv').empty();
        for (var k = 0; k < favoriteRatingArray.length; k++) {
            createGifDivs(k);
            $('.image'+k).attr("src",favoriteStillImageArray[k]).attr("data-animated", favoriteAnimatedImageArray[k]).attr("data-still", favoriteStillImageArray[k]).attr("data-state", "still");
            $('.rating'+k).text(favoriteRatingArray[k]);
        }
    })
    createTagButtons();
});