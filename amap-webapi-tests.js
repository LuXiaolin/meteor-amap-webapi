// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by amap-webapi.js.
import AMapWebAPI from "./amap-webapi.js";

var mapAPI = new AMapWebAPI('316941719a6cb142ea8e0c4967be5434');

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

  var staticMap = mapAPI.getStaticMap(locations);
  test.isNotNull(staticMap, '值不为空');
});

Tinytest.add('amap - GetDistance', function (test) {
  var start = { lng: 113, lat: 22 };
  var end = { lng: 114, lat: 25 };

  var miles = mapAPI.getDistance(start, end);
  test.isNotNull(miles, '值不为空');
});

Tinytest.add('amap - Regeocode', function (test) {
  var location = { lng: 113, lat: 22 };
  var address = mapAPI.regeocode(location);
  test.isNotNull(address, '值不为空');
});

Tinytest.add('amap - Geocode', function (test) {
  var location = mapAPI.geocode('前海梦工场', '深圳');
  test.isNotNull(location, '值不为空');
});
