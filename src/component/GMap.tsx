import React, { useEffect, useState } from "react";
import styles from "./GMap.module.scss";
import { Photo } from "../App";

const GoogleMap = require("react-google-maps").GoogleMap;
const Marker = require("react-google-maps").Marker;
const withGoogleMap = require("react-google-maps").withGoogleMap;
const withScriptjs = require("react-google-maps").withScriptjs;
const InfoWindow = require("react-google-maps").InfoWindow;

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";

interface MarkerData {
  latitude: number;
  longitude: number;
  ownerName: string;
  owner: string;
  id: number;
  date: string;
  thumbnail: string;
}

export interface Position {
  lat: number;
  lng: number;
}

interface GMapProps {
  markers: MarkerData[];
  center?: Position;
  zoom?: number;
  setSelectedMarker: React.Dispatch<
    React.SetStateAction<
      | {
          owner: string;
          id: number;
        }
      | undefined
    >
  >;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

interface RGMProps {
  markers: MarkerData[];
  center?: Position;
  zoom?: number;
  setSelectedMarker: React.Dispatch<
    React.SetStateAction<
      | {
          owner: string;
          id: number;
        }
      | undefined
    >
  >;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

const INIT_POSITION = { lat: 39.381266, lng: -97.922211 };
const INIT_ZOOM = 3;

const RGM = withScriptjs(
  withGoogleMap((props: RGMProps) => {
    const { markers, center, zoom, setSelectedMarker, setSelectedPhoto } =
      props;

    return (
      <GoogleMap center={center || INIT_POSITION} zoom={zoom || INIT_ZOOM}>
        {markers.map((marker: MarkerData) => {
          return (
            <GMarker
              marker={marker}
              center={center}
              setSelectedMarker={setSelectedMarker}
              setSelectedPhoto={setSelectedPhoto}
            />
          );
        })}
      </GoogleMap>
    );
  })
);

function GMap(props: GMapProps) {
  const { center, zoom, setSelectedMarker, setSelectedPhoto } = props;

  return (
    <RGM
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: "100%", width: "100%" }} />}
      containerElement={<div style={{ height: "100%", width: "100%" }} />}
      mapElement={<div style={{ height: "100%", width: "100%" }} />}
      markers={props.markers}
      center={center}
      zoom={zoom}
      setSelectedMarker={setSelectedMarker}
      setSelectedPhoto={setSelectedPhoto}
    />
  );
}

interface GMarkerProps {
  marker: MarkerData;
  moreDetails?: boolean;
  center?: Position;
  setSelectedMarker: React.Dispatch<
    React.SetStateAction<
      | {
          owner: string;
          id: number;
        }
      | undefined
    >
  >;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

function GMarker(props: GMarkerProps) {
  const { marker, center, setSelectedMarker, setSelectedPhoto } = props;

  const [moreDetails, setMoreDetails] = useState(false);

  useEffect(() => {
    setMoreDetails(false);

    if (center?.lat === marker.latitude && center?.lng === marker.longitude) {
      setMoreDetails(true);
    }
  }, [center, marker.longitude, marker.latitude]);

  return (
    <Marker
      position={{ lat: marker.latitude, lng: marker.longitude }}
      url={marker.thumbnail}
      key={`${marker.latitude}${marker.longitude}${marker.date}`}
      onClick={() => {
        if (moreDetails) {
          setSelectedMarker(undefined);
          setSelectedPhoto(undefined);
          setMoreDetails(false);
        } else {
          setMoreDetails(true);
          setSelectedMarker({ owner: marker.owner, id: marker.id });
        }
      }}
    >
      {moreDetails === true && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedMarker(undefined);
            setSelectedPhoto(undefined);
            setMoreDetails(false);
          }}
        >
          <MarkerPopup
            imageUrl={marker.thumbnail}
            author={marker.ownerName}
            date={marker.date}
          />
        </InfoWindow>
      )}
    </Marker>
  );
}

interface MarkerPopupProps {
  imageUrl: string;
  author: string;
  date: string;
}

function MarkerPopup(props: MarkerPopupProps) {
  const { imageUrl, author, date } = props;

  return (
    <div className={styles.markerPopup}>
      <div className={styles.thumbnailWrapper}>
        <img src={imageUrl} alt={`By ${author}`} />
      </div>
      <div className={styles.descriptionWrapper}>
        <p>{author}</p>
        <p>{date}</p>
      </div>
    </div>
  );
}

export default GMap;
