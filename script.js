$(document).ready(function () {

// Really cool stuff (googled) to change cursor when running API ajax calls
// Each time we start ANY ajax call
// we add class wait to the body
// ajaxStart is global handler, same as ajaxComplete
$(document).ajaxStart(function ()
{
    $('body').addClass('wait');
// when ajax call finishes, we remove class wait
}).ajaxComplete(function () {

    $('body').removeClass('wait');

});

// Local Storage
// Check if it is defined
let lastSearch = localStorage.getItem('lastCity');

if (lastSearch === null ) {
    console.log("Local storage not initiated.");
} else {
    frenderWeather(lastSearch,false);
}

// Displays weather
function frenderWeather(city,skip){

    // Open Weather API
    const apiKey = 'd6c3151200124f6b3dfdd52227d4e82c';
    const urlApi = 'http://api.openweathermap.org/data/2.5/forecast?';
    // open weather icons are here .. googled that stackoverflow
    const urlIcon = 'http://openweathermap.org/img/w/';
    let cityQuery = 'q=' + city;
    let apiQuery = '&appid=' + apiKey;
    let unitsQuery = '&units=metric';
    
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    let queryUrl = urlApi + cityQuery + apiQuery + unitsQuery;

    let updateDOM = skip;

    console.log(updateDOM);
       
    // make API call
    $.ajax({
            url: queryUrl,
            method: 'GET',

            success: function(response) {
                console.log(response);
                // Because API call can be triggered by clicking search button
                // or button with the city name
                // we need to check when we add new button                
                if ($('#button'+city).length === 0 && updateDOM === false ) {

                    let newButton = $('<button>');
                    newButton.attr('id', "btn"+city);
                    newButton.attr('type', 'button');
                    newButton.addClass('btn btn-primary m-1 city');
                    newButton.text(city);

                    // add button to citiesArea
                    $("#citiesArea").append(newButton);

                    // add city to local storage as last
                    localStorage.setItem('lastCity',city);

                    // add event listener to buttons with class city
                    // we use off/on to run this once only
                    // in addition to that we add event.preventDefault
                    // this is becasue we invocate click event per class and not id
                    $(".city").off().on( "click", function() {
                        event.preventDefault();
                        // make API call
                        frenderWeather($(this).text(),true); 
                    });
                }                 
                       
            console.log(response);
            // use resposne to print weather
            let cityName = response.city.name;
            // starting same for each day
            let hour = ' 15:00:00';
            // offset specific to Adelaide ()
            let timeshift = 5400; 
            // pick up the actual date
            let today = moment().format('YYYY-MM-DD');
            // here we will have 6 unix timestamps for 6 days
            // today and 5 next days
            // each timestamp is for 3 PM + timeshift
            // by doing this we will obtian weather for the time of the day
            let timestamps = [];
            let day;
            
            for (let i = 0; i<6; i ++){

                // calculate date of the subsequent day + add 15:00:00
                day = moment().add(i,'days').format('YYYY-MM-DD') + hour;
                // calculate unix timestamp + timeshift (SECONDS)
                timestamps[i] = day;

                // today
                if (i===0) {
                    // remove child elements
                    $("#todayWeather").empty();

                    let todayHeader = $("<h2>");
                    let todayTemperature = $("<p>");
                    let todayHumidity = $("<p>");
                    let todayWind = $("<p>");
                    let todayIcon = $("<img>");
                
                   

                    
                    // response.cnt is the number of results from API
                    // by default this is 40
                    // we need to find result for our timestamp
                    for (let j = 0; j < response.cnt; j++) 
                    {
                        // responde.X.dt is timestamp in GMT
                        // timestamp is timestamp in GMT
                        if (response.list[j].dt_txt === timestamps[i]) {

                            
                            todayIcon.attr("src", urlIcon + response.list[j].weather[0].icon + ".png"  );
                            todayIcon.addClass("img-responsive icon");
                            todayHeader.text(cityName + " " + timestamps[i]);
                            todayTemperature.text("Temperature: " + response.list[j].main.temp +   String.fromCharCode(176) + "C");
                            todayHumidity.text("Humidity: " + response.list[j].main.humidity + " %");
                            todayWind.text("Wind: " + response.list[j].wind.speed + " mps " );
                            // run OpenUV API 
                            //getUV(lat,lng,dt);
                            let timeUV = timestamps[i].replace(/\s/g,'T');
                            console.log(response.city.coord.lat);
                            console.log(response.city.coord.lon);
                            console.log(timeUV);
                            $("#todayWeather").append(todayHeader);
                            $("#todayWeather").append(todayIcon);
                            $("#todayWeather").append(todayTemperature);
                            $("#todayWeather").append(todayHumidity);
                            $("#todayWeather").append(todayWind);

                            // check UV and add to DOM
                            getUV(response.city.coord.lat,response.city.coord.lon,timeUV);
                                                  
                            // this means we found weather for to today for time 15:00:00
                            // we can break from the loop
                            break;
                        }
                    }                                  

                } else {
                    // next days
                    if (i === 1) {
                        // remove all DOM elements from the previous city
                        $("#nextDaysWeather").empty();
                    }
                   
                    // date, temp, humidity
                    let nextdaySection = $("<section>");
                    let nextdayDate = $("<p>");
                    let nextdayTemperature = $("<p>");
                    let nextdayHumidity = $("<p>");
                    let ndayIcon = $("<img>");

                    ndayIcon.attr("src", urlIcon + response.list[i].weather[0].icon + ".png"  );
                    ndayIcon.addClass("img-responsive nicon");

                    nextdayDate.text(timestamps[i].split(" ",1));
                    nextdayTemperature.text("Temp.: " + response.list[i].main.temp +  String.fromCharCode(176) + "C");
                    nextdayHumidity.text("Humidity: " + response.list[i].main.humidity + " %");

                    nextdaySection.append(nextdayDate);
                    nextdaySection.append(ndayIcon);
                    nextdaySection.append(nextdayTemperature);
                    nextdaySection.append(nextdayHumidity);
                    nextdaySection.addClass("bg-info col-xs-1 mx-3 my-2");
                    $("#nextDaysWeather").append(nextdaySection);

                }

            }     
            },

            error: function(){
                // write to console
                console.log("API call: something went wrong.");
            }
    });
            
}

// search button on click
$("#searchButton").on( "click", function() {

    event.preventDefault();

    // read city name
    let city = $("#searchCity").val();

    // if city is empty we do nothing
    if (city === "" ) {

        // We don't want to make API calls which will not work 100%
        $("#searchCity").addClass("bg-danger");

    } else {

        // once there is city provided we can fire up api
        $("#searchCity").removeClass("bg-danger");
        // provide city name
        // second argument means we will create DOM
        frenderWeather(city,false);  
    }
});


// we need to use different API to get UV index
function getUV(lat,lng,dt) {

    let urlUV = 'https://api.openuv.io/api/v1/uv';
    let tokenUV = '1c5c77e7762002273011c3361fd25485';
    let indexUV;
    let latUV = lat;
    let lngUV = lng;
    let dtUV = dt;
 
    $.ajax({
        // break async in order to wait for API...
        url: 'https://api.openuv.io/api/v1/uv?lat=' + latUV + '&lng=' + lngUV + '&dt=' + dtUV,
        type: 'GET',
        dataType: 'json',
        // token needs to be send inside the header
        beforeSend: function(request) {
          request.setRequestHeader('x-access-token', tokenUV);
        },
        success: function(response) {
            console.log(response);
            indexUV = response.result.uv_max;
            let todayUV = $("<p>");
            todayUV.text("UV: " + indexUV);
            $("#todayWeather").append(todayUV);
            
        },
        error: function(response) {
            let todayUV = $("<p>");
            todayUV.text("UV: " + "N/A");
            $("#todayWeather").append(todayUV);
        }
    });
    
}

})
