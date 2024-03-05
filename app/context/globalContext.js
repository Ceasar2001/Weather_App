"use Client";

import axios from "axios";
import React, {useContext, createContext, useState, useEffect} from "react";
import defaultStates from "../utils/defaultStates";

const GlobalContext = createContext()
const GlobalContextUpdate = createContext()

export const GlobalContextProvider = ({children}) => {
    const [forecast, setForecast] = useState({});
    const [airQuality, setAirQuality] = useState({});
    const [fiveDayForecast, setFiveDayForecast] = useState({});
    const [uvIndex, setUvIndex] = useState({});


    const fetchForecast = async(lat, lon) => {
        try {
            const res = await axios.get(`api/weather?lat=${lat}&lon=${lon}`);
            setForecast(res.data);
        } catch (error) {
            console.log("Error fetching forecast data", error.message);
        }
    };

    //air quality fetching data
    const fetchAirQuality  = async () => {
        try {
            const res = await axios.get("api/pollution");
            setAirQuality(res.data);
        } catch (error) {
            console.log("Error fetching air quality data", error.message);
        }
    };

    //five day forecast
    const fetchFiveDayForecast = async() => {
        try {
            const res = await axios.get("api/fiveday");
            setFiveDayForecast(res.data);
        } catch (error) {
            console.log("Error fetching forecast data", error.message);
        }
    }

    //fetch uv data
    const fetchUvIndex = async() => {
        try {
            const res = await axios.get("api/uv");
            setUvIndex(res.data);
        } catch (error) {
            console.log("Error fetching uv index", error.message);
        }
    }


    useEffect(() => {
        fetchForecast();
        fetchAirQuality();
        fetchFiveDayForecast();
        fetchUvIndex();
    }, []);

    return(
        <GlobalContext.Provider value={{
            forecast,
            airQuality,
            fiveDayForecast,
            uvIndex,
        }}>
            <GlobalContextUpdate.Provider>
                {children}
            </GlobalContextUpdate.Provider>
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);