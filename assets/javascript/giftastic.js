$(document).ready(function(){
    var person;
    
    var tagArray = ["Jean Luc Picard", "Neo", "Tyrion Lannister", "Malcolm Reynolds"];
    

    // Possibly can create metaDataArray so as to dry up the createGifDivs
    
    var createGifDivs = function(num) {
        // Runs inside a for loop in the then portion of AJAX
        // Creates a ".gif"+i div and appends it to the ".allGifDiv"
        // Next it creates three more divs, metaDiv, imageDiv, and manipulateDiv and appends them to the ".gif"+i
        var gifDiv = $('<div>');
        gifDiv.appendTo('.allGifDiv').addClass('gifDiv gif'+num);
        var metaDiv = $('<div>').addClass('meta'+num);
        // Here I need to add more divisions to separate out and place the appropriate metaData I want to use
        // Maybe separate these out into their own functions so I can keep createGifDivs small and clean looking?
        // I also need to add the buttons and onclicks for the manipulate div
        var imageDiv = $('<img>').addClass('image'+num);
        var manipulateDiv = $('<div>').addClass('manipulate'+num);
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
                        $('.image'+j).attr("src",response.data[j].images.fixed_height.url);
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
    createTagButtons();
});