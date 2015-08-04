/**
 * Created by Alex on 31.7.2015.
 */
$(document).ready(function () {
    function showWeather(el) {
        navigator.geolocation.getCurrentPosition(success, err);
        function err(e) {
            el.text('Geolocation error ' + e.code + ': ' + e.message);
        }

        function success(pos) {
            var lat = pos.coords.latitude;
            var long = pos.coords.longitude;
            // Create a url for a GET request
            var url = 'http://api.openweathermap.org/data/2.5/weather?' + 'lat=' + lat + '&lon=' + long + '&units=metric';
            $.getJSON(url)
                .done(function (data) {

                    // Create handlebars.js template
                    var img = "https://dl.dropboxusercontent.com/u/28151607/icons/" + data.weather[0].icon + '.png';
                    var source = $("#weather_display").html();
                    var template = Handlebars.compile(source);
                    var context = template({
                        city: data.name,
                        country: data.sys.country,
                        image: img,
                        temperatureC: data.main.temp.toFixed(0),
                        temperatureF: celcToFahr(data.main.temp),
                        clouds: cloudiness(data.clouds.all),
                        wind: 'Wind: ' + data.wind.speed + ' m/s'
                    });
                    el.html(context);

                })
                .fail(function () {
                    el.append($('<div id="err"></div>').text('Could not get the data at the moment. Please try again later.'));
                })
        }
    }

    // Function to convert percentage of cloudiness to its verbal description
    // source: http://www.theweatherprediction.com/habyhints/189/
    function cloudiness(cloudPercentage) {
        switch (true) {
            case (cloudPercentage <= 20):
                return 'Sunny';
            case (cloudPercentage > 20 && cloudPercentage <= 35):
                return 'Mostly Sunny';
            case (cloudPercentage > 35 && cloudPercentage <= 70):
                return 'Partly Cloudy';
            case (cloudPercentage > 70 && cloudPercentage <= 85):
                return 'Mostly Cloudy';
            default:
                return 'Cloudy';
        }
    }

    // Convert Celcius to Fahrenheit + round to integer
    function celcToFahr(celcius){
        return (celcius * (9/5) + 32).toFixed(0);
    }

    var c = $('#inner_cont');

    showWeather(c);
})
