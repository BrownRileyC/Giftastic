$(document).ready(function(){
    var person;
    
    var tagArray = ["Patrick Stewart", "Keanu Reeves", "Peter Dinklage", "Nathan Fillion"];    
    var favoriteArray = [];
    // Possibly can create metaDataArray so as to dry up the createGifDivs
  
    var createGifDivs = function(num) {
        // Runs inside a for loop in the then portion of AJAX
        // Creates a ".gif"+i div and appends it to the ".allGifDiv"
        // Next it creates three more divs, metaDiv, imageDiv, and manipulateDiv and appends them to the ".gif"+i
        var gifDiv = $('<div>');
        gifDiv.appendTo('.allGifDiv').addClass('gifDiv gif'+num);
        
        var metaDiv = $('<div>').addClass('meta');
        var metaRatingDiv = $('<div>').addClass('metaDivs rating'+num);
        var metaTitleDiv = $('<div>').addClass('metaDivs title'+num);
        var metaSourceDiv = $('<div>').addClass('metaDivs source'+num);
        metaDiv.append(metaRatingDiv, metaTitleDiv, metaSourceDiv);

        var imageDiv = $('<img>').addClass('gif image'+num);

        var manipulateDiv = $('<div>').addClass('manipulate'+num);
        var downloadButton = $('<button>').addClass('manipulateDiv download'+num).text("Download");
        var favoriteButton = $('<button>').addClass('manipulateDiv favoriteButton'+num).text("🖤");
        manipulateDiv.append(downloadButton, favoriteButton);
        // Here I need to add more divisions to separate out and place the appropriate metaData I want to use
        // Maybe separate these out into their own functions so I can keep createGifDivs small and clean looking?
        // I also need to add the buttons and onclicks for the manipulate div
        
        
        $('.gif'+num).append(metaDiv, imageDiv, manipulateDiv);
    };

   var storeFavoriteClick = function(num) {
        // Save the values of the various divs, and save them to an array, stringify the array and store in localstorage
        // 
   }

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
                        $('.image'+j).attr("src",response.data[j].images.fixed_height_still.url).attr("data-animate", response.data[j].images.fixed_height.url).attr("data-still", response.data[j].images.fixed_height_still.url).attr("data-state", "still");
                        $('.rating'+j).text(response.data[j].rating);
                        $('.title'+j).text(response.data[j].title);
                        $('.source'+j).html('<a href:"'+response.data[j].source+'"</a>')
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
            var animated = $(this).attr("data-animate");
            $(this).attr('src',animated);
            $(this).attr("data-state", "animated");
        };
        if (currentState === "animated") {
            var still = $(this).attr("data-still");
            $(this).attr("src",still);
            $(this).attr("data-state","still");
        };
    });
    createTagButtons();
});