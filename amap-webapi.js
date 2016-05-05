var setting = Meteor.settings.public.amap;
if (!setting) {
  console.log('error', 'Please Add amap setting.');
}
const host = 'http://restapi.amap.com/v3/';

AMapWebAPI = {};

AMapWebAPI.getDistance = function getDistance(start, end, callback) {
  var queryString = {
    origins: start,
    destination: end,
    output: 'json',
    key: setting.webapikey
  };
  
  var response = HTTP.get(host + 'distance', { params: queryString }, function (error, result) {
    callback(error, JSON.parse(result.content).results[0].distance);
  });
}

AMapWebAPI.regeocode = function (location, callback) {
  var queryString = {
    location: getPositionString(location),
    output: 'json',
    radius: 1000,
    extensions: 'base',
    key: setting.webapikey
  };

  HTTP.get(host + 'geocode/regeo', { params: queryString }, function (error, result) {
    callback(error, result.data.regeocode);
  });
}

AMapWebAPI.geocode = function (address, callback) {
  var queryString = {
    address: address,
    output: 'json',
    key: setting.webapikey
  };

  HTTP.get(host + 'geocode/geo', { params: queryString }, function (error, result) {
    callback(error, result.data.geocodes[0].location);
  });
}

AMapWebAPI.getStaticMap = function (locations, callback) {
  var query = {
    size: '500*440',
    paths: '5,0x0000FF,1,,:' + getLocationsString(locations),
    markers: getMarkersString(locations, '起', '现'),
    key: setting.webapikey
  };

  HTTP.get(host + 'staticmap?' + ConvertToQueryString(query), function (error, result) {
    callback(error, result.content);
  });
}

function getLocationsString(locations) {
  var ret = '';
  for (var index = 0; index < locations.length - 1; index++) {
    ret += getPositionString(locations[index]) + ';';
  }
  ret += getPositionString(locations[locations.length - 1]);
  return ret;
}

function getMarkersString(locations, startText, endText) {
  var startStr = 'mid,,' + startText + ':' + getPositionString(locations[0]);
  var endStr = '|mid,,' + endText + ':' + getPositionString(locations[locations.length - 1]);
  locations.shift();
  locations.pop();
  var midStr = '';
  if (locations.length > 0)
    midStr = '|small,,:' + getLocationsString(locations);
  return startStr + midStr + endStr;
}

function getPositionString(coordinates) {
  return coordinates.lng + ',' + coordinates.lat;
}

function getPositionsString(coordinatesList) {
  var result = getPositionString(coordinatesList[0]);
  for (var index = 1; index < coordinatesList.length; index++) {
    result += '|' + getPositionString(coordinatesList[index]);
  }
  return result;
}

function ConvertToQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}