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

    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    let queryUrl = urlApi + cityQuery + apiQuery;
       
    // make API call
    $.ajax({
                url: queryUrl,
                method: 'GET',
                success: function(weatherResponse){
                    // when we have successful response
                    // create DOM if it doesn't exists
                    if ($('#button'+city).length === 0) {

                        // new button for the city
                        // each button has ID = btncity
                        // each button has CUSTOM class city used later
                        let newButton = $('<button>');
                        newButton.attr('id', "btn"+city);
                        newButton.attr('type', 'button');
                        newButton.addClass('btn btn-primary m-1 city');
                        
                        newButton.text(city);

                        // add button to citiesArea
                        $("#citiesArea").append(newButton);

                        // add city to local storage
                        localStorage.setItem('lastCity',city);                    }

                        // display weather
                        console.log(weatherResponse);

                        // add event listener to buttons with class city
                        $(".city").on( "click", function() {
                            console.log("Running API");
                        });
                },
                error: function(){
                    console.log("API call: something went wrong.");
                }

            });
            
}


// Add city to history 
// each save button  on click saves to local storage
$("#searchButton").on( "click", function() {
    // Read city name
    let city = $("#searchCity").val();

    if (city === "" ) {
        // We don't want to make API calls which will not work 100%
        console.log("EMPTY !!!");
    } else {
        // make API call
        frenderWeather(city);       
    }
});




})
