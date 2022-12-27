document.getElementById("submit").addEventListener("click", function () {
    clearDiv("searchImg");
    let city = document.getElementById("search");
    if (city.value === "") {
        alert("enter city");
    }
    else {
        let apiKey = "private key";
        fetchApi(city.value, apiKey);
    }
});


function fetchApi(city, apiKey) {
    let api = city + "&appid=" + apiKey;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + api;
    fetch(apiUrl).then(function (res) {
        res.json().then(function (responce) {
            setWeather(responce);
        });
    });
}


function setWeather(responce) {
    if (responce.cod === "404") {
        getDiv("gif");
        clearDiv("contain");
        getElement("gmap_canvas").src = "https://i.imgflip.com/3vl7c9.gif";
    }
    else {
        clearDiv("gif");
        getDiv("contain");
        getWeather(responce);
        console.log(responce)
    }
}


function setError(src, id) {
    clearDiv("contain");
    let img = document.createElement("img");
    img.id = id;
    img.src = src;
    getElement("weather").append(img);
}


function clearDiv(id) {
    document.getElementById(id).style.display = "none";
}

function getDiv(id) {
    document.getElementById(id).style.display = "block";
}

function getElement(id) {
    let el = document.getElementById(id);
    return el;
}

function getWeather(responce) {
    let id = responce.weather[0].id;
    let icon = document.getElementById("icon");

    if (id == 800) {
        icon.src = "icon/clear.svg";
    } else if (id >= 200 && id <= 232) {
        icon.src = "icon/storm.svg";
    } else if (id >= 600 && id <= 622) {
        icon.src = "icon/snow.svg";
    } else if (id >= 701 && id <= 781) {
        icon.src = "icon/haze.svg";
    } else if (id >= 801 && id <= 804) {
        icon.src = "icon/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        icon.src = "icon/rain.svg";
    }

    getElement("city").innerText = responce.name;
    getElement("temp").innerText = Math.round(responce.main.temp - 273.15) + "°C";
    getElement("feel").innerText = "Feel Likes " + Math.round(responce.main.feels_like - 273.15) + "°C" +
        ". " + responce.weather[0].main + " Clouds.";

    getElement("minTemp").innerText = "Min temp: " + Math.round(responce.main.temp_min - 273.15) + "°C";
    getElement("maxTemp").innerText = "Max temp: " + Math.round(responce.main.temp_max - 273.15) + "°C";
    getElement("sunRise").innerText = "Sunrise: " + new Date(responce.sys.sunrise * 1000);
    getElement("sunSet").innerText = "Sunset: " + new Date(responce.sys.sunset * 1000);

    getElement("h").innerText = "Humidity: " + responce.main.humidity + "%";
    getElement("p").innerText = "Pressure: " + Math.round(responce.main.pressure * 0.03) + "Hg";

    getElement("gmap_canvas").src = `https://maps.google.com/maps?q=${responce.name}&t=&z=9&ie=UTF8&iwloc=&output=embed`;

    let str = new Date().toLocaleString(`en-${responce.sys.country}`, { timeStyle: "short" });
    let str2 = new Date().toLocaleString(`en-${responce.sys.country}`, { dateStyle: "short" });

    console.log(str);
    getElement("date").innerText = str2 + " , " + str;

    fetch7dayTemp(responce.coord.lat, responce.coord.lon);

}

setError("https://c.tenor.com/5mz52kzlg6IAAAAi/bloodbros-search.gif", "searchImg");

function getCuurentCity() {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        const crd = pos.coords;
        getCurrentWeather(crd.latitude, crd.longitude);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

getCuurentCity();
function getCurrentWeather(lat, lon) {
    clearDiv("searchImg");
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=`+api;
    fetch(url).then(function (res) {
        res.json().then(function (responce) {
            setWeather(responce);
        });
    });
}


function fetch7dayTemp(lat, lon) {
    let apiKey = "privateKey";
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url).then(function (res) {
        res.json().then(function (responce) {

            setWeatherForcast(responce.list);

        });
    });
}


function setWeatherForcast(list) {
    getElement("forecast").innerText = "";
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {

        let div = document.createElement("div");
        div.id = "forcastDiv";
        let day = document.createElement("p");
        day.innerText = days[i];

        let img = document.createElement("img");
        img.id = "foreCastImg";
        let id = list[i].weather[0].id;

        if (id == 800) {
            img.src = "icon/clear.svg";
        } else if (id >= 200 && id <= 232) {
            img.src = "icon/storm.svg";
        } else if (id >= 600 && id <= 622) {
            img.src = "icon/snow.svg";
        } else if (id >= 701 && id <= 781) {
            img.src = "icon/haze.svg";
        } else if (id >= 801 && id <= 804) {
            img.src = "icon/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            img.src = "icon/rain.svg";
        }

        let temp = document.createElement("h4");
        temp.innerText = Math.round(list[i].main.temp - 273.15) + "°C";

        div.append(day, img, temp);

        getElement("forecast").append(div);

    }
}