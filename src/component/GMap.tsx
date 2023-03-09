import React, { useEffect, useState } from "react";
import styles from "./GMap.module.scss";
import { Photo } from "../App";

const GoogleMap = require("react-google-maps").GoogleMap;
const Marker = require("react-google-maps").Marker;
const withGoogleMap = require("react-google-maps").withGoogleMap;
const withScriptjs = require("react-google-maps").withScriptjs;
const InfoWindow = require("react-google-maps").InfoWindow;

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";

export interface Position {
  lat: number;
  lng: number;
}

interface GMapProps {
  photos?: Photo[];
  center?: Position;
  zoom?: number;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

interface RGMProps {
  photos: Photo[];
  center?: Position;
  zoom?: number;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

const INIT_POSITION: Position = { lat: 39.381266, lng: -97.922211 };
const INIT_ZOOM: number = 3;

const RGM = withScriptjs(
  withGoogleMap((props: RGMProps) => {
    const { photos, center, zoom, setSelectedPhoto } = props;

    return (
      <GoogleMap center={center || INIT_POSITION} zoom={zoom || INIT_ZOOM}>
        {photos?.map((marker: Photo) => {
          return (
            <GMarker
              photo={marker}
              center={center}
              setSelectedPhoto={setSelectedPhoto}
            />
          );
        })}
      </GoogleMap>
    );
  })
);

function GMap(props: GMapProps) {
  const { center, zoom, setSelectedPhoto, photos } = props;

  return (
    <RGM
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: "100%", width: "100%" }} />}
      containerElement={
        <div style={{ height: "100%", width: "100%"}} />
      }
      mapElement={<div style={{ height: "100%", width: "100%" }} />}
      photos={photos}
      center={center}
      zoom={zoom}
      setSelectedPhoto={setSelectedPhoto}
    />
  );
}

interface GMarkerProps {
  photo: Photo;
  moreDetails?: boolean;
  center?: Position;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | undefined>>;
}

function GMarker(props: GMarkerProps) {
  const { photo, center, setSelectedPhoto } = props;

  const [moreDetails, setMoreDetails] = useState(false);

  useEffect(() => {
    setMoreDetails(false);

    if (
      center?.lat === photo.position.lat &&
      center?.lng === photo.position.lng
    ) {
      setMoreDetails(true);
    }
  }, [center, photo.position.lng, photo.position.lat]);

  return (
    <Marker
      position={{ lat: photo.position.lat, lng: photo.position.lng }}
      url={photo.thumbnailSq}
      key={`${photo.position.lat}${photo.position.lng}${photo.takenOn}`}
      onClick={() => {
        if (moreDetails) {
          setSelectedPhoto(undefined);
          setMoreDetails(false);
        } else {
          setMoreDetails(true);
          setSelectedPhoto(photo);
        }
      }}
    >
      {moreDetails === true && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedPhoto(undefined);
            setMoreDetails(false);
          }}
        >
          <MarkerPopup
            imageUrl={photo.thumbnailSq}
            author={photo.ownerName}
            date={photo.takenOn}
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
