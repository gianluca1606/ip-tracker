import "./App.css";
import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => {
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: parseFloat(props.latitude),
          lng: parseFloat(props.longitude),
        }}
      >
        {props.isMarkerShown && (
          <Marker
            position={{
              lat: parseFloat(props.latitude),
              lng: parseFloat(props.longitude),
            }}
          />
        )}
      </GoogleMap>
    );
  })
);

function App() {
  const [ipOrdomain, setIpOrDomain] = useState(null);
  const [displayIpOrDomain, setDisplayIpOrDomain] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [timeZone, setTimeZone] = useState(null);
  const [isp, setIsp] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  useEffect(() => {
    axios
      .get(
        "https://api.ipgeolocation.io/ipgeo?apiKey=8479faa2b2e4482b9360a8dfb7131888&",
        {
          headers: headers,
        }
      )
      .then(
        (response) => {
          setLatitude(response.data.latitude);
          setLongitude(response.data.longitude);
          setLocation(response.data.city + ", " + response.data.state_prov);
          setIsp(response.data.isp);
          setTimeZone(response.data.time_zone.name);
          setDisplayIpOrDomain(response.data.ip);
          setLoading(false);
        },
        (error) => {
          toast.error("Error please check your Browser Settings and your Adblocker", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
        }
      );
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getData();
    }
  };

  const getData = () => {
    axios
      .get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=8479faa2b2e4482b9360a8dfb7131888&&ip=${ipOrdomain}`,
        {
          headers: headers,
        }
      )
      .then(
        (response) => {
          setLatitude(response.data.latitude);
          setLongitude(response.data.longitude);
          setLocation(response.data.city + ", " + response.data.state_prov);
          setIsp(response.data.isp);
          setDisplayIpOrDomain(response.data.time_zone.name);
          console.log(response);
          setLoading(false);
        },
        (error) => {
          console.log(error.response.data.message);
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
        }
      );
  };

  const setInputValue = (val) => {
    setIpOrDomain(val.target.value);
  };

  if (loading) {
    return <h1>loading...</h1>;
  }
  return (
    <div className='App'>
      <div className='background'>
        <img alt='test' src='/pattern-bg.png' className='imageBackground' />
        <div className='header'>
          <h1>Ip Adress Tracker</h1>
          <div className='search'>
            <input
              type='text'
              value={ipOrdomain}
              className='ip-search'
              placeholder='Enter any Domain or IP Address'
              onChange={setInputValue}
              onKeyPress={handleKeyPress}
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='12'
              id='arrowicon'
              onClick={getData}
            >
              <path fill='none' stroke='#FFFFFF' stroke-width='3' d='M2 1l6 6-6 6' />
            </svg>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='card'>
          <div className='text'>
            <h1> IP ADDRESS</h1>
            <h2> {displayIpOrDomain}</h2>
          </div>
          <div className='border-right'></div>
          <div className='text'>
            <h1> LOCATION </h1>
            <h2>{location}</h2>
          </div>
          <div className='border-right'></div>
          <div className='text'>
            <h1> TIMEZONE </h1>
            <h2>{timeZone}</h2>
          </div>
          <div className='border-right'></div>
          <div className='text'>
            <h1> ISP</h1>
            <h2> {isp}</h2>
          </div>
        </div>
      </div>

      <MyMapComponent
        latitude={latitude}
        longitude={longitude}
        isMarkerShown
        googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} className='google-container' />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
