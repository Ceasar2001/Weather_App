"use Client";

import axios from "axios";
import React, {useContext, createContext, useState, useEffect} from "react";
import defaultStates from "../utils/defaultStates";
import { debounce } from "lodash";

const GlobalContext = createContext()
const GlobalContextUpdate = createContext()

export const GlobalContextProvider = ({children}) => {
    const [geoCodedList, setGeoCodedList] = useState(defaultStates);
    const [inputValue, setInputValue] = useState("");

    const[activeCityCoords, setActiveCityCoords] = useState([
        51.752021, -1.257726,
    ]);

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
    const fetchAirQuality  = async (lat, lon) => {
        try {
            const res = await axios.get(`api/pollution?lat=${lat}&lon=${lon}`);
            setAirQuality(res.data);
        } catch (error) {
            console.log("Error fetching air quality data", error.message);
        }
    };

    //five day forecast
    const fetchFiveDayForecast = async(lat, lon) => {
        try {
            const res = await axios.get(`api/fiveday?lat=${lat}&lon=${lon}`);
            setFiveDayForecast(res.data);
        } catch (error) {
            console.log("Error fetching forecast data", error.message);
        }
    }

    //geoCoded list
    const fetchGeoCodedList = async(search) => {
        try {
            const res = await axios.get(`/api/geoCoded?search=${search}`);

            setGeoCodedList(res.data);
        } catch (error) {
            console.log("Error fetching geoCoded list: ", error.message);
        }
    }

    //fetch uv data
    const fetchUvIndex = async(lat, lon) => {
        try {
            const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);
            setUvIndex(res.data);
        } catch (error) {
            console.log("Error fetching uv index", error.message);
        }
    }


    //handle input in search field
    const handleInput = (e) => {
        setInputValue(e.target.value);

        if(e.target.value === ""){
            setGeoCodedList(defaultStates);
        }
    };

    // debounce function
    useEffect(() => {
        const debouncedFetch = debounce((search) => {
            fetchGeoCodedList(search);
        }, 500);

        if(inputValue){
            debouncedFetch(inputValue);
        }

        //cleanup
        return () => debouncedFetch.cancel();
    }, [inputValue]);


    useEffect(() => {
        fetchForecast(activeCityCoords[0], activeCityCoords[1]);
        fetchAirQuality(activeCityCoords[0], activeCityCoords[1]);
        fetchFiveDayForecast(activeCityCoords[0], activeCityCoords[1]);
        fetchUvIndex(activeCityCoords[0], activeCityCoords[1]);
    }, [activeCityCoords]);

    return(
        <GlobalContext.Provider value={{
            forecast,
            airQuality,
            fiveDayForecast,
            uvIndex,
            geoCodedList,
            inputValue,
            handleInput,
            setActiveCityCoords,
        }}>
            <GlobalContextUpdate.Provider value={{ setActiveCityCoords,}}>
                {children}
            </GlobalContextUpdate.Provider>
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);