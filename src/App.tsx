import { useEffect, useState } from "react";
import axios from "axios";

import { Dropdown, Item } from "./component/Dropdown";
import styles from "./App.module.scss";

import GMap, { Position } from "./component/GMap";

const FLICKR_ENDPOINT_URL = process.env.REACT_APP_FLICKR_ENDPOINT_URL;

const apiKeyParam = `&api_key=${process.env.REACT_APP_FLICKR_KEY}`;
const formatKeyParam = "&format=json&nojsoncallback=1";

export interface Photo {
  id: number;
  owner: string;
  ownerName: string;
  takenOn: string;
  position: Position;
  thumbnailM: string;
  thumbnailSq: string;
}

function App() {
  const [brands, setBrands] = useState<Item[]>();
  const [models, setModels] = useState<Item[]>();
  const [photos, setPhotos] = useState<Photo[]>();
  const [photosToDisplay, setPhotosToDisplay] = useState<Photo[]>();

  const [selectedBrands, setSelectedBrands] = useState<Item[]>([]);
  const [selectedModels, setSelectedModels] = useState<Item[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>();
  const [filterQuery, setFilterQuery] = useState<string>("");

  function isNumeric(str: string) {
    if (str.match(/^-?\d+$/) || str.match(/^\d+\.\d+$/)) {
      return true;
    }

    return false;
  }

  function matchedPosition(position: Position, filterQuery: string) {
    if (isNumeric(filterQuery)) {
      return false;
    }

    const lat = position.lat.toString();
    const lng = position.lng.toString();

    if (lat.includes(filterQuery) || lng.includes(filterQuery)) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (!photos) return;

    if (filterQuery?.length <= 0) {
      setPhotosToDisplay(photos);
      return;
    }

    const newFilteredPhotos = photos.filter(
      (photo) =>
        photo.ownerName.toLowerCase().includes(filterQuery) ||
        photo.takenOn.toLowerCase().includes(filterQuery) ||
        matchedPosition(photo.position, filterQuery)
    );

    setPhotosToDisplay(newFilteredPhotos);
  }, [filterQuery]);

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
    selectedBrands?.forEach((brand) => {
      axios
        .get(
          `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.cameras.getBrandModels&brand=${brand.value}&${apiKeyParam}${formatKeyParam}`
        )
        .then(function (response) {
          const cameras = response.data.cameras.camera;
          const prepModels = cameras.map((camera: any) => ({
            key: `${brand.value}-${camera.id}`,
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
      "url_sq,url_m,geo,owner_name,date_taken"
    )}`;
    const hasGeoParam = "&has_geo=1";

    selectedModels?.forEach((model) => {
      const cameraParam = `&camera=${model.value}`;

      axios
        .get(
          `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.photos.search&${cameraParam}${hasGeoParam}${apiKeyParam}${formatKeyParam}${extrasParam}&per_page=30`
        )
        .then(function (response) {
          const data = response.data.photos.photo;

          const prepPhotos: Photo[] = data.map((d: any) => ({
            id: d.id,
            owner: d.owner,
            ownerName: d.ownername,
            takenOn: d.datetaken,
            position: {
              lat: parseFloat(d.latitude),
              lng: parseFloat(d.longitude),
            },
            thumbnailM: d.url_m,
            thumbnailSq: d.url_sq,
          }));

          if (photos) {
            const newPhotos = [...photos, ...prepPhotos];
            setPhotos(newPhotos);
            setPhotosToDisplay(newPhotos);
          } else {
            setPhotos(prepPhotos);
            setPhotosToDisplay(prepPhotos);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrands?.length === 0) {
      return;
    }
    setModels(undefined);

    fetchModels();
  }, [selectedBrands]);

  const center = selectedPhoto
    ? ({
        lat: selectedPhoto.position.lat,
        lng: selectedPhoto.position.lng,
      } as Position)
    : undefined;

  const zoom = selectedPhoto ? 9 : undefined;

  return (
    <div>
      <div className={styles.navigation}>
        <div className={styles.logo}>
          <a href="/">Photo Viewer App</a>
        </div>
        <div className={styles.buffer}></div>
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
          <button
            className={styles.searchButton}
            onClick={() => {
              if (selectedModels?.length === 0) return;
              searchPhotos();
            }}
          >
            Get
          </button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.filterContainer}>
            {photos && (
              <input
                type="text"
                placeholder="Search for photographer name, photo taken date time and coordinates now"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFilterQuery(event.target.value.toLowerCase())
                }
              />
            )}
          </div>
          <div className={styles.imagesContainer}>
            {photosToDisplay?.map((photo) => {
              let isSelected = false;
              if (selectedPhoto) {
                if (
                  selectedPhoto.owner === photo.owner &&
                  selectedPhoto.id === photo.id
                ) {
                  isSelected = true;
                }
              }

              return (
                <div
                  className={styles.imageitem}
                  onClick={() => {
                    setSelectedPhoto(photo);
                  }}
                >
                  <div className={styles.location}>
                    <span style={{ float: "left" }}>
                      Lat: {photo.position.lat} Lng: {photo.position.lng}
                    </span>
                  </div>
                  <img
                    src={photo.thumbnailM}
                    className={isSelected ? styles.selected : undefined}
                  />
                  <div className={styles.extraDesc}>
                    <span style={{ float: "left" }}>on {photo.takenOn}</span>
                    <span style={{ float: "right" }}>by {photo.ownerName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.sidebar}>
          <GMap
            photos={photosToDisplay}
            center={center}
            zoom={zoom}
            setSelectedPhoto={setSelectedPhoto}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
