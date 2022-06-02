import React, { useState, useEffect } from 'react'
import axios from "axios"

import { GoogleMap, withScriptjs, withGoogleMap,Marker,InfoWindow  } from 'react-google-maps'
import mapstyle from '../mapStyle';
 
function Map() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [selectedHotel, setSelectedHotel] = useState(null);
  useEffect(() => {
    async function fetchData() {
        try {
            const data = (await axios.get('/api/rooms/getallrooms')).data;
            setrooms(data);
            setloading(false);
        }
        catch (error) {
            seterror(true);
            console.log(error);
            setloading(false);
        }

    }
    fetchData();
}, []);
  return (
    <GoogleMap defaultZoom={15} 
    defaultCenter={{ lat: 27.7097158, lng: 85.3223556 }} 
    defaultOptions={{ styles: mapstyle }}>
      {rooms.map((room) => (
        <Marker
          key={room._id} position={{
            lat: room.lat,
            lng: room.lng
          }}
          onClick={() => {
            setSelectedHotel(room);
          }}
          icon={{
            url: `/hotel.png`,
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}
      {selectedHotel && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedHotel(null);
          }}
          position={{
            lat: selectedHotel.lat,
            lng: selectedHotel.lng
          }}
        >
          <div>
            <h2>{selectedHotel.name}</h2>
            <p>{selectedHotel.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
const WrappedMap = withScriptjs(withGoogleMap(Map));


export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC7IPsqWebybWGYtkaQgAWQUNWE0Ogs8MY`}

        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  )
}