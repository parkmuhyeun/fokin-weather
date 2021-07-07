import React from 'react';
import { Alert } from 'react-native';
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "8dbf19dd4ff8e5b19650edcd7e8cf219";

export default class extends React.Component {
  state = {
    isLoading: true
  }

  getWeather = async(latitude, longitude) => {                                               //url으로부터 data얻어서 setState
    const {
      data:{
        main: {temp},
        weather
      }
     } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false, 
      condition: weather[0].main,
      temp
     });
  };

  getLocation = async() => {                                                                  //getLocation 성공한경우 get 실패한경우 Alert                      
    try {
      await Location.getForegroundPermissionsAsync();                                               //permission 요청
      const {
        coords: {latitude, longitude}
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude,longitude);
    } catch (error) {
      Alert.alert("Cant find you.","So sad");
    }
  }

  componentDidMount(){
    this.getLocation();
  }

  render(){
    const {isLoading, temp, condition} = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition}/>;   //isLoading? Loading Page : MainPage
  }
}