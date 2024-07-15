let map;





function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude);
            resolve({ latitude, longitude }); // Return an object with both values
          },
          error => {
            reject(new Error('Error occured while fetching location:', error)); // Provide more context in the error message
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }





async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const location = await getUserLocation();
  const { latitude, longitude } = location;
  let center = new google.maps.LatLng(latitude,longitude);

  map = new Map(document.getElementById("map"), {
    center: center,
    zoom: 11,
    mapId: "DEMO_MAP_ID",
  });
 
 
}

async function nearbySearch(type) {
  //@ts-ignore
  console.log('Search started for:', type); 
  const location = await getUserLocation();
  const { latitude, longitude } = location;
  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary(
    "places",
  );
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Restrict within the map viewport.
  let center = new google.maps.LatLng(latitude,longitude);
  const request = {
    // required parameters
    fields: ["displayName", "location", "businessStatus"],
    locationRestriction: {
      center: center,
      radius: 500,
    },
    // optional parameters
    includedPrimaryTypes: [type],
    maxResultCount: 20,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: "en-US",
    //region: "me",
  };
  //@ts-ignore
  const { places } = await Place.searchNearby(request);

  if (places.length) {
    console.log(places);

    const { LatLngBounds } = await google.maps.importLibrary("core");
    const bounds = new LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {
      const markerView = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });

      bounds.extend(place.location);
      console.log(place);
    });
    map.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}






initMap();



