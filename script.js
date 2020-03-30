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
                  
            // add event listener to buttons with class city
            $(".city").off().on( "click", function() {
                event.preventDefault();

                console.log($(this).text());

                // make API call
                //frenderWeather(city); 


            });
            
            console.log(response);
           
           
            // display weather
            let cityName = response.city.name;
            let hour = ' 15:00:00';
            let timeshift = 5400; // seconds, difference between GMT and Adelaide
            let today = moment().format('YYYY-MM-DD');
            // here we will have 6 unix timestamps for 6 days
            // each timestamp is for 3 PM
            let timestamps = [];
            let day;
            

            for (let i = 0; i<6; i ++){
                day = moment().add(i,'days').format('YYYY-MM-DD') + hour;
                timestamps[i] = moment(day).unix() + timeshift;

                // today
                if (i===0) {
                    // remove child elements
                    $("#todayWeather").empty();

                    let todayHeader = $("<h2>");
                    let todayTemperature = $("<p>");
                    let todayHumidity = $("<p>");
                    let todayWind = $("<p>");
                    let todayUV = $("<p>");

                    todayHeader.text(cityName + " " + moment.unix(timestamps[i]).format('DD/MM/YYYY'));
                    todayTemperature.text("Temperature:");
                    todayHumidity.text("Humidity:");
                    todayWind.text("Wind:");
                    todayUV.text("UV:");

                    for (let j = 0; j < response.cnt; j++) 
                    {
                        console.log(response.list[j].dt + "=== " + timestamps[i]);
                        if (response.list[j].dt === timestamps[i]) {
                            console.log("HERRE");
                            todayTemperature.text("Temp.: " + response.list[j].main.temp +   String.fromCharCode(176) + "C");
                            todayHumidity.text("Humidity: " + response.list[j].main.humidity + " %");
                            todayWind.text("Wind: " + response.list[j].wind.speed + " mps " );
                            todayUV.text("UV: ");
                            break

                        }
                    }
                    
                  
                    
                    
                    $("#todayWeather").append(todayHeader);
                    $("#todayWeather").append(todayTemperature);
                    $("#todayWeather").append(todayHumidity);
                    $("#todayWeather").append(todayWind);
                    $("#todayWeather").append(todayUV);

                } else {
                    // next days
                    if (i === 1) {
                        $("#nextDaysWeather").empty();
                    }
                   
                    // date, temp, humidity
                    let nextdaySection = $("<section>");
                    let nextdayDate = $("<p>");
                    let nextdayTemperature = $("<p>");
                    let nextdayHumidity = $("<p>");

                    nextdayDate.text(moment.unix(timestamps[i]).format('DD/MM/YYYY'));
                    nextdayTemperature.text("Temp.: " + response.list[i].main.temp +  String.fromCharCode(176) + "C");
                    nextdayHumidity.text("Humidity: " + response.list[i].main.humidity + " %");

                    nextdaySection.append(nextdayDate);
                    nextdaySection.append(nextdayTemperature);
                    nextdaySection.append(nextdayHumidity);
                    nextdaySection.addClass("bg-info col-xs-1 mx-2");
                    $("#nextDaysWeather").append(nextdaySection);

                }

            }
        



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
