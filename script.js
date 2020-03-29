$(document).ready(function () {
      
// Really cool stuff to change cursor when running API ajax calls
$(document).ajaxStart(function ()
{
    $('body').addClass('wait');

}).ajaxComplete(function () {

    $('body').removeClass('wait');

});

// Local Storage
// Check if it is defined
let lastSearch = localStorage.getItem('lastCity');

if (lastSearch === null ) {
    console.log("Local storage not initiated.");
} else {
    frenderWeather(lastSearch);
}

// Displays weather
function frenderWeather(city){

    // Open Weather API
    const apiKey = 'd6c3151200124f6b3dfdd52227d4e82c';
    const urlApi = 'http://api.openweathermap.org/data/2.5/forecast?';
    let cityQuery = 'q=' + city;
    let apiQuery = '&appid=' + apiKey;
    let unitsQuery = '&units=metric';

    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    let queryUrl = urlApi + cityQuery + apiQuery + unitsQuery;
       
    // make API call
    $.ajax({
            url: queryUrl,
            method: 'GET',
            success: function(response){

            // Update DOM
            // create DOM if it doesn't exists
            if ($('#button'+city).length === 0) {

            let newButton = $('<button>');
            newButton.attr('id', "btn"+city);
            newButton.attr('type', 'button');
            newButton.addClass('btn btn-primary m-1 city');
            newButton.text(city);

            // add button to citiesArea
            $("#citiesArea").append(newButton);

            // add city to local storage as last
            localStorage.setItem('lastCity',city);                    }
                  
            // make API call
            //frenderWeather(city);    

            // add event listener to buttons with class city
            $(".city").off().on( "click", function() {
                event.preventDefault();


            });
            
            console.log(response);
                // display weather for today
                let today= [ response.city.name, response.list[0].main.temp, response.list[0].main.temp, response.list[0].main.humidity,  response.list[0].wind.speed ];
                console.log(today); 



                // display weather for the next days

               // console.log(weatherResponse);       
            },
            error: function(){
                // write to console
                console.log("API call: something went wrong.");
            }
    });
            
}

// When search is clicked
$("#searchButton").on( "click", function() {
    event.preventDefault();
    // Read city name
    let city = $("#searchCity").val();

    // if city is empty we do nothing
    if (city === "" ) {

        // We don't want to make API calls which will not work 100%
        console.log("Empty city !!!");

    } else {
        frenderWeather(city);  
    }
});

})
