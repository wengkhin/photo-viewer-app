import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
import axios from "axios";
import { Dropdown, Item } from "./component/Dropdown";

import GMap from "./component/GMap";

const FLICKR_ENDPOINT_URL = process.env.REACT_APP_FLICKR_ENDPOINT_URL;

const apiKeyParam = `&api_key=${process.env.REACT_APP_FLICKR_KEY}`;
const formatKeyParam = "&format=json&nojsoncallback=1";

interface Photo {
  ownerName: string;
  takenOn: string;
  latitude: string;
  longitude: string;
  thumbnail: string;
}

function App() {
  const [brands, setBrands] = useState<Item[]>();
  const [models, setModels] = useState<Item[]>();
  const [photos, setPhotos] = useState<Photo[]>();

  const [selectedBrands, setSelectedBrands] = useState<Item[]>([]);
  const [selectedModels, setSelectedModels] = useState<Item[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState();

  const fetchBrands = async () => {
    axios
      .get(
        `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.cameras.getBrands&${apiKeyParam}${formatKeyParam}`
      )
      .then(function (response) {
        const brands = response.data.brands.brand;

        setBrands(
          brands.map((brand: any) => ({
            key: brand.id,
            text: brand.name,
            value: brand.id,
          }))
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchModels = async () => {
    selectedBrands?.map((brand) => {
      axios
        .get(
          `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.cameras.getBrandModels&brand=${brand.value}&${apiKeyParam}${formatKeyParam}`
        )
        .then(function (response) {
          const cameras = response.data.cameras.camera;
          const prepModels = cameras.map((camera: any) => ({
            key: camera.id,
            text: camera.name._content,
            value: `${brand.value}/${camera.id}`,
          }));

          if (models) {
            setModels([...models, ...prepModels]);
          } else {
            setModels(prepModels);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  const searchPhotos = async () => {
    const extrasParam = `&extras=${encodeURI(
      "url_m,geo,owner_name,date_taken"
    )}`;
    const hasGeoParam = "&has_geo=1";

    selectedModels?.map((model) => {
      const cameraParam = `&camera=${model.value}`;

      axios
        .get(
          `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.photos.search&${cameraParam}${hasGeoParam}${apiKeyParam}${formatKeyParam}${extrasParam}`
        )
        .then(function (response) {
          const data = response.data.photos.photo;

          const prepPhotos: Photo[] = data.map((d: any) => ({
            ownerName: d.ownername,
            takenOn: d.datetaken,
            latitude: d.latitude,
            longitude: d.longitude,
            thumbnail: d.url_m,
          }));

          if (photos) {
            setPhotos([...photos, ...prepPhotos]);
          } else {
            setPhotos(prepPhotos);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };
  const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";
  useEffect(() => {
    fetchBrands();
  }, []);

  const [loc, setLoc] = useState([
    { latitude: 77, longitude: 99 },
    { latitude: 33, longitude: 77 },
  ]);

  useEffect(() => {
    if (selectedBrands?.length === 0) return;

    fetchModels();
  }, [selectedBrands]);

  useEffect(() => {
    if (selectedModels?.length === 0) return;

    searchPhotos();
  }, [selectedModels]);
  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.logo}>Photo Viewer App</div>
        <div className={styles.brandsDropdown}>
          <Dropdown
            items={brands}
            onChange={(items: Item[]) => {
              setSelectedBrands(items);
            }}
            label="Brand"
          />
        </div>
        <div className={styles.modelsDropdown}>
          <Dropdown
            items={models}
            onChange={(items: Item[]) => {
              setSelectedModels(items);
            }}
            label="Model"
          />
        </div>
        <div className={styles.search}>
          <button className={styles.searchButton}>Search</button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.imagesContainer}>
            {photos?.map((photo) => (
              <div className={styles.imageitem}>
                <div className={styles.location}>
                  <span style={{ float: "left" }}>
                    Lat: {photo.latitude} Lng: {photo.longitude}
                  </span>
                </div>
                <img src={photo.thumbnail} />
                <div className={styles.extraDesc}>
                  <span style={{ float: "left" }}>on {photo.takenOn}</span>
                  <span style={{ float: "right" }}>by {photo.ownerName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sidebar}>
          <GMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: "100%", width: "100%" }} />}
            containerElement={<div style={{ height: "100%", width: "100%" }} />}
            mapElement={<div style={{ height: "100%", width: "100%" }} />}
            markers={loc}
          />
        </div>
      </div>
    </>
  );
}

export default App;
