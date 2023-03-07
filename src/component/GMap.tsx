import React, { useState } from "react";

const GoogleMap = require("react-google-maps").GoogleMap;
const Marker = require("react-google-maps").Marker;
const withGoogleMap = require("react-google-maps").withGoogleMap;
const withScriptjs = require("react-google-maps").withScriptjs;
const InfoWindow = require("react-google-maps").InfoWindow;
const Maps = require("react-google-maps").Maps;
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const {
  MarkerWithLabel,
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
// const { Size } = require("react-google-maps").Core;
const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";
// console.log(Marker);
interface MarkerData {
  latitude: number;
  longitude: number;
  owner: string;
  date: string;
  thumbnail: string;
}

interface GMapProps {
  markers: MarkerData[];
  moreDetails?: boolean;
}

const RGM = withScriptjs(
  withGoogleMap((props: GMapProps) => {
    return (
      <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
        {props.markers.map((marker: MarkerData) => {
          return (
            <Marker
              position={{ lat: marker.latitude, lng: marker.longitude }}
              url={marker.thumbnail}
              key={`${marker.latitude}${marker.longitude}${marker.date}`}
            ></Marker>
          );
        })}
        <InfoBox options={{ closeBoxURL: ``, enableEventPropagation: true }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              opacity: 0.75,
            }}
          >
            Hello
            {/* <img src={marker.thumbnail} />
            <ul>
              <li>{marker.owner}</li>
              <li>{marker.date}</li>
            </ul> */}
          </div>
        </InfoBox>
      </GoogleMap>
    );
  })
);

function GMap(props: GMapProps) {
  const [moreDetails, setMoreDetails] = useState(false);

  return (
    <RGM
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: "100%", width: "100%" }} />}
      containerElement={<div style={{ height: "100%", width: "100%" }} />}
      mapElement={<div style={{ height: "100%", width: "100%" }} />}
      markers={props.markers}
    />
  );
}

export default GMap;
