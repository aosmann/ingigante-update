import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ location }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCNhsU6R9HsP40Xu9QTwvWKCeWAZdpSRfM",
  });

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const image =
    "https://developers.google.com/static/maps/documentation/javascript/images/default-marker.png";
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker
        position={{ lat: location.lat, lng: location.lng }}
        icon={{
          url: image,
          anchor: new google.maps.Point(5, 58),
        }}
      />
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(Map);
