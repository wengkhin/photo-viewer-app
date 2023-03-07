import React, { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { Dropdown, Item } from "./component/Dropdown";

const FLICKR_ENDPOINT_URL = process.env.REACT_APP_FLICKR_ENDPOINT_URL;
const apiKeyParam = `&api_key=${process.env.REACT_APP_FLICKR_KEY}`;

function App() {
  const [brands, setBrands] = useState<Item[]>();

  useEffect(() => {
    axios
      .get(
        `${FLICKR_ENDPOINT_URL}/rest/?method=flickr.cameras.getBrands&${apiKeyParam}&format=json&nojsoncallback=1`
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
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);

  return (
    <div>
      <h1>Photo Viewer</h1>
      Text below here
      {brands && (
        <Dropdown
          items={brands}
          onChange={() => {
            console.log("On change");
          }}
        />
      )}
    </div>
  );
}

export default App;
