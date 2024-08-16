import { useEffect, useRef, useState } from 'react'
import "./Weather.css"
import search_icon from "../assets/search.png"
import clear_icon from "../assets/clear.png"
import cloud_icon from "../assets/cloud.png"
import drizzle_icon from "../assets/drizzle.png"
import humidity_icon from "../assets/humidity.png"
import rain_icon from "../assets/rain.png"
import snow_icon from "../assets/snow.png"
import wind_icon from "../assets/wind.png"
import axios from 'axios'

interface weatherDataProps {
    humidity: number;
    windSpeed: number;
    temperature: number;
    location: string;
    icon: string,
}

type WeatherIcons = {
    "01d": string;
    "01n": string;
    "02d": string;
    "02n": string;
    "03d": string;
    "03n": string;
    "04d": string;
    "04n": string;
    "09d": string;
    "09n": string;
    "10d": string;
    "10n": string;
    "13d": string;
    "13n": string;
};

const Weather = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [weatherData, setWeatherData] = useState<weatherDataProps | null> (null);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }
    
    async function fetchData(city: string) {
        if (!city){
            alert("Enter city name");
            return;
        };
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`);
            const iconkey = response.data.weather[0].icon as keyof WeatherIcons;
            const icon = allIcons[iconkey] || clear_icon;
            console.log(response);
            setWeatherData({
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed,
                temperature: Math.floor(response.data.main.temp),
                location: response.data.name,
                icon: icon,
            });
        } catch (error) {
            console.log("Error fetching weather data", error);
            alert("Please enter correct city name")
        }
    }

    useEffect(() => {
        fetchData("London");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Search'/>
            <img src={search_icon} alt="" onClick={() => fetchData(inputRef.current?.value || "")}/>
        </div>
        <img src={weatherData?.icon} alt='' className='weather-icon'></img>
        <p className='temperature'>{weatherData?.temperature}°C</p>
        <p className='location'>{weatherData?.location}</p>
        <div className="weather-data">
            <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                    <p>{weatherData?.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                    <p>{weatherData?.windSpeed} km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Weather