import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import flagemojiToPNG from "./FlagToPng";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const [mapPosition, setMapPosition] = useState([17.35, 78.49]);

  const { cities } = useCities();

  const {
    position: geolocationPosition,
    isLoading: isLoadingPosition,
    getPosition,
  } = useGeolocation();

  //Programatic navigation using useNavigate
  // const navigate = useNavigate(); // this returns a function that can be used to navigate.

  //reading data from query param in route.
  // const [searchParams, setSearchParams] = useSearchParams(); //returns an array like useState : we can and set also.
  // const mapLat = searchParams.get("lat"); //searchParams consistes of an object which we need to read using get function.
  // const mapLng = searchParams.get("lng");

  //using same above code from cutom hook
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition?.lat, geolocationPosition?.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {/* onClick={() => navigate("form")} */}

      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading" : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city?.position?.lat, city?.position?.lng]}
            key={city.id}
          >
            <Popup>
              <span>{flagemojiToPNG(city?.emoji)}</span>{" "}
              <span>{city?.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>

      {/* <h1>Map</h1>
      <h1>
        Position : {lat} , {lng}
      </h1> */}

      {/* Setting the queryParam */}
      {/* <button onClick={() => setSearchParams({ lat: 50, lng: 23 })}>
        Change Position
      </button> */}
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
