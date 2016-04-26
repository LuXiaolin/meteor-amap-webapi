AMapWebAPI.prototype.getDistance = function getDistance(start, end) {
  var queryString = {
    origins: getPositionString(start),
    destination: getPositionString(end),
    output: 'json',
    key: this.key
  };
  var response = HTTP.get(this.host + 'distance', { params: queryString });
  if (response.statusCode === 200)
    return JSON.parse(response.content).results[0].distance;
  else
    Meteor.Error(response);
}

AMapWebAPI.prototype.regeocode = function (location, callback, errorCallback) {
  var queryString = {
    location: getPositionString(location),
    output: 'json',
    radius: 1000,
    extensions: 'base',
    key: this.key
  };

  var response = HTTP.get(this.host + 'geocode/regeo', { params: queryString });
  if (response.statusCode === 200)
    return response.data.regeocode;
  else
    Meteor.Error(response);
}

AMapWebAPI.prototype.geocode = function (address, city) {
  var queryString = {
    address: address,
    output: 'json',
    key: this.key
  };

  var response = HTTP.get(this.host + 'geocode/geo', { params: queryString });
  if (response.statusCode === 200)
    return response.data.geocodes[0].location;
  else
    Meteor.Error(response);
}

AMapWebAPI.prototype.getStaticMap = function (locations) {
  var query = {
    size: '500*440',
    paths: '5,0x0000FF,1,,:' + getLocationsString(locations),
    markers: getMarkersString(locations, '起', '现'),
    key: this.key
  };

  response = HTTP.get(this.host + 'staticmap?' + ConvertToQueryString(query));

  if (response.statusCode === 200)
    return response.content;
  else
    Meteor.Error(response);
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
    result += '|' + this.getPositionString(coordinatesList[index]);
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

export default function AMapWebAPI(key) {
  this.key = key;
  this.host = 'http://restapi.amap.com/v3/';
}