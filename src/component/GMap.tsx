import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";

const GoogleMap = require('react-google-maps').GoogleMap;
const Marker = require('react-google-maps').Marker;
const withGoogleMap = require('react-google-maps').withGoogleMap;
const withScriptjs = require('react-google-maps').withScriptjs;
const InfoWindow = require('react-google-maps').InfoWindow;
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

interface Marker {
    latitude: number;
    longitude: number;
}

interface GMapProps {
    markers: Marker[];
}

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";

const GMap = withScriptjs(withGoogleMap((props: GMapProps) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        {props.markers.map((marker: Marker) => {
            return <Marker position={{ lat: marker.latitude, lng: marker.longitude }}>
               <InfoBox
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
          <div>
            Hello, Kaohsiung<img src="https://www.flickr.com/images/opensearch-flickr-logo.png"/>
          </div>
        </div>
      </InfoBox>
                </Marker>;
        })}
    </GoogleMap>
));

export default GMap;
