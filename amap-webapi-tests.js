// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by amap-webapi.js.
import AMapWebAPI from "./amap-webapi.js";

var mapAPI = new AMapWebAPI('50d2155c6e7e04502a5a00749a3c4be5');

Tinytest.add('amap - GetStaticMap', function (test) {
  var locations = [];
  locations.push({
    "lat": "22.533022",
    "lng": "113.968892"
  });
  // locations.push({
  //   "lat": "22.508751",
  //   "lng": "113.800193"
  // });
  locations.push({
    "lat": "22.518751",
    "lng": "113.900193"
  });

  mapAPI.getStaticMap(locations, (error, mapData) => {
    if (error) {
      console.log('error', error);
      return;
    }
    console.log('get mapData success');
  });
});

Tinytest.add('amap - GetDistance', function (test) {
  var start = { lng: 113, lat: 22 };
  var end = { lng: 114, lat: 25 };

  mapAPI.getDistance(start, end, (error, miles) => {
    console.log(miles);
  });
});

Tinytest.add('amap - Regeocode', function (test) {
  var location = { lng: 113, lat: 22 };
  mapAPI.regeocode(location, (error, address) => {
    console.log(address);
  });
});

Tinytest.add('amap - Geocode', function (test) {
  mapAPI.geocode('前海梦工场', '深圳', (error, location) => {
    console.log(location);
  });
});
