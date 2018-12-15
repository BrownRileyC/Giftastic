$(document).ready(function(){
    var game;
    var currentGame;
    var showMoreCounter = 0 
    var favoritesExist = false;
    var downloadURLArray = [];
    var tagArray = ["God of War", "Pokemon", "Final Fantasy", "Persona"];    
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

        var manipulateDiv = $('<div>').addClass('manipulateDiv manipulate'+num);
        var downloadButton = $('<button>').addClass('manipButtons download download'+num).attr('data-number',num);
        var favoriteButton = $('<button>').addClass('manipButtons favoriteButton').text("🖤").attr('data-number',num).attr("data-favorite","false");
        manipulateDiv.append(downloadButton, favoriteButton);
        
        $('.gif'+num).append(metaDiv, imageDiv, manipulateDiv);
    };

    var createTagButtons = function(){
        for (var i = 0; i< tagArray.length; i ++) {
            var newTag = $('<button>')
            newTag.appendTo('.tagBar').addClass('tagButton tag'+i);
            newTag.text(tagArray[i]);
            newTag.attr('data-game',tagArray[i].toLocaleLowerCase());
            $('.tagBar').on('click','.tag'+i, function(){
                $('.allGifDiv').empty();
                showMoreCounter = 0;
                game = $(this).attr('data-game');
                currentGame = game;
                var queryUrl = "https://api.giphy.com/v1/gifs/search?q="+ game +"&api_key=ZiPmnqc9Wm82TSbo6W9q9gthL65HkCdi&limit=10";
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                    for (var j = 0; j < response.data.length; j ++) {
                        createGifDivs(j);
                        downloadURLArray.push(response.data[j].images.original.url)
                        $('.image'+j).attr("src",response.data[j].images.fixed_height_still.url).attr("data-animated", response.data[j].images.fixed_height.url).attr("data-still", response.data[j].images.fixed_height_still.url).attr("data-state", "still");
                        $('.rating'+j).text("Rated: "+response.data[j].rating);
                        $('.download'+j).html("<a href='"+downloadURLArray[j]+"' download>Download</a>")
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
    // Here find a way to first add the current favorites into the favorites arrays, that way adding a new favorite in a different session doesn't clear your old favorites.
    $('.allGifDiv').on('click','.favoriteButton', function(){
        var gifNumber = $(this).attr('data-number');
        var favoriteRating = $('.rating'+gifNumber).text();
        var favoriteStillImage = $('.image'+gifNumber).attr('data-still');
        var favoriteAnimatedImage = $('.image'+gifNumber).attr('data-animated');
        favoritesExist = true;
        localStorage.clear();
        localStorage.setItem('favoriteStatus', favoritesExist);
        if ($(this).attr("data-favorite") === "false"){
            
            $(this).attr('data-favorite',"true").text('X');
            favoriteRatingArray.push(favoriteRating);
            favoriteStillImageArray.push(favoriteStillImage);
            favoriteAnimatedImageArray.push(favoriteAnimatedImage);
            console.log("we reached the push");

            localStorage.setItem("ratingList",JSON.stringify(favoriteRatingArray));
            localStorage.setItem("stillImageList",JSON.stringify(favoriteStillImageArray));
            localStorage.setItem("animatedImageList",JSON.stringify(favoriteAnimatedImageArray));
            console.log(favoriteRatingArray);
            console.log("we passed the setItem");
            
        } else if($(this).attr("data-favorite") === "true") {
            $(this).attr('data-favorite',"false").text('🖤');
            favoriteRatingArray.splice(favoriteRatingArray.indexOf(favoriteRating),1);
            favoriteStillImageArray.splice(favoriteStillImageArray.indexOf(favoriteStillImage),1);
            favoriteAnimatedImageArray.splice(favoriteAnimatedImageArray.indexOf(favoriteAnimatedImage),1);

            localStorage.setItem("ratingList",JSON.stringify(favoriteRatingArray));
            localStorage.setItem("stillImageList",JSON.stringify(favoriteStillImageArray));
            localStorage.setItem("animatedImageList",JSON.stringify(favoriteAnimatedImageArray));

        }
        console.log("We ran past the ifs")
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
            // $('.download'+j).html("<a href='"+response.data[j].images.original.url+"' download>Download</a>")
            $('.favoriteButton').attr('data-favorite','true').text('X');
        }
    });

    $('.showMoreButton').on('click', function(){
        showMoreCounter ++;
        var queryUrl = "https://api.giphy.com/v1/gifs/search?q="+ currentGame +"&api_key=ZiPmnqc9Wm82TSbo6W9q9gthL65HkCdi&limit=10&offset="+showMoreCounter;
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
            for (var j = 0; j < response.data.length; j ++) {
                showMoreNumber = j + 10*showMoreCounter
                createGifDivs(showMoreNumber);
                $('.image'+showMoreNumber).attr("src",response.data[j].images.fixed_height_still.url).attr("data-animated", response.data[j].images.fixed_height.url).attr("data-still", response.data[j].images.fixed_height_still.url).attr("data-state", "still");
                $('.rating'+showMoreNumber).text("Rated: "+response.data[j].rating);
            }
        });
    });

    $('.goTopButton').on('click', function(){
        event.preventDefault();
        $('html, body').animate({scrollTop:0},1000);
    });

    createTagButtons();
    favoritesExist = localStorage.getItem("favoriteStatus");
    var oldFavoriteRatingArray = JSON.parse(localStorage.getItem("ratingList"));
    var oldFavoriteStillImageArray = JSON.parse(localStorage.getItem('stillImageList'));
    var oldFavoriteAnimatedImageArray = JSON.parse(localStorage.getItem("animatedImageList"));

    if (favoritesExist == true) {
        for (var l = 0; l < oldFavoriteRatingArray.length; l++) {
        favoriteRatingArray.push(oldFavoriteRatingArray[l]);
        favoriteStillImageArray.push(oldFavoriteStillImageArray[l]);
        favoriteAnimatedImageArray.push(oldFavoriteAnimatedImageArray[l]);
    }
}

    console.log(favoriteRatingArray);
});