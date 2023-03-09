import { Position } from "./App";

// Check is string number
export function isNumeric(str: string) {
  if (str.match(/^-?\d+$/) || str.match(/^\d+\.\d+$/)) {
    return true;
  }

  return false;
}

// A condition used for filtering/search
export function checkMatchPosition(position: Position, filterQuery: string) {
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

const FLICKR_ENDPOINT_URL = process.env.REACT_APP_FLICKR_ENDPOINT_URL;
export const FLICKR = {
  PHOTO_SEARCH: "flickr.photos.search",
  CAMERAS_GET_BRANDS: "flickr.cameras.getBrands",
  CAMERAS_GET_BRAND_MODELS: "flickr.cameras.getBrandModels",
};

// Generate Flickr URL
export function flickrURL(method: string, extras?: string[]) {
  const methodParam = `method=${method}`;
  const apiKeyParam = `&api_key=${process.env.REACT_APP_FLICKR_KEY}`;
  const formatKeyParam = "&format=json&nojsoncallback=1";
  const extraParam = extras ? `&${extras.join("&")}` : "";

  return `${FLICKR_ENDPOINT_URL}/rest/?${methodParam}${apiKeyParam}${formatKeyParam}${extraParam}`;
}
