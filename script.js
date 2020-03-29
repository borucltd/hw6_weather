$(document).ready(function () {
                                                                                           
// Local Storage
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
                    console.log(weatherResponse);
                },
                error: function(){
                    console.log("API call: something went wrong.");
                }

            });
}


})
