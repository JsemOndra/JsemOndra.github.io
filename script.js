// Array to store GPS coordinates
window.gpsCoordinates = [];


function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Converts radians to degrees
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

// Function to handle layer change
function layerChange() {
  const selectedLayer = document.getElementById('layerSelect').value;  

  // Disable all existing layers
   for (var p in layers) { layers[p].disable(); }
  // Enable the selected layer based on the value
    switch (selectedLayer) {
        case "0": 
            layers[SMap.DEF_BASE].enable();
        break;
        case "1": 
            layers[SMap.DEF_OPHOTO].enable();
            layers[SMap.DEF_HYBRID].enable();
        break;
        case "2": 
            layers[SMap.DEF_RELIEF].enable();
        break;
        case "4": 
            layers[SMap.DEF_TURIST].enable();
        break;
      case "5": 
            layers[SMap.DEF_GEOGRAPHY].enable();
        break;
    }
}
// Function to calculate the destination point using magic formula, takes GPS coordinates, azimuth and distance in kilometers

function calculateDestinationPoint(latitude, longitude, azimuthDegrees, distanceKm) {
  const R = 6371.009; // Earth's radius in km

  // Convert inputs to radians
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const azimuth = toRadians(azimuthDegrees);

  // Calculate the new latitude
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceKm / R) +
    Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(azimuth));

  // Calculate the new longitude
  const lon2 = lon1 + Math.atan2(Math.sin(azimuth) * Math.sin(distanceKm / R) * Math.cos(lat1),
    Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2));

  // Convert the result back to degrees
  const newLatitude = toDegrees(lat2);
  const newLongitude = toDegrees(lon2);

  return { latitude: newLatitude, longitude: newLongitude };
}
// Function to draw a line with azimuth on the map
function drawLineWithAzimuth(latitude, longitude, azimuth, distance, uuid) {
  destination = calculateDestinationPoint(latitude, longitude, azimuth, distance);
  var points1 = [
      SMap.Coords.fromWGS84(longitude, latitude),
      SMap.Coords.fromWGS84(destination.longitude, destination.latitude)
  ];
var options1 = {
    color: "#f00",
    width: 3
};
var polyline = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, points1, options1);
layer.addGeometry(polyline);
return points1;
  
}

// Function to save a point with GPS coordinates

function savePoint(){
    // Get input elements

  const coorInput = document.getElementById('coorInput');
  const azimuthInput = document.getElementById('azimuthInput');
  const distanceInput = document.getElementById('distanceInput');
  const noteInput = document.getElementById('noteInput');
    // Get values from input elements and trim white spaces

  const coordinates = coorInput.value.trim().replace(/ +/g, ' ').replace(/′/g, "'").replace(/″/g, '"');
  const azimuth = azimuthInput.value.trim();
  const distance = distanceInput.value.trim();
  const note = noteInput.value.trim();
    // Check if the entered coordinates and azimuth are valid

  if (isValidGPSCoordinate(coordinates) && isValidAzimuth(azimuth)) {
    result= convertToScriptCoordinate(coordinates);
      gpsCoordinates.push({ latitude: result[0], longitude: result[1], azimuth:azimuth, distance:distance, note: note, uuid: uuidv4(), visible: false});
      refreshCoorList();

  } else {
    alert('Invalid GPS coordinates. Please enter valid coordinates for Coordinates (e.g. 50°12\'12"N 14°32\'55"E or 50.1109221 8.6821267) and Azimuth (e.g. 15).');
  }
}
// Function to check if GPS coordinates are valid

function isValidGPSCoordinate(coordinate) {
  const coordinateRegex = /^\d{1,3}°\d{1,2}'\d{1,2}" ?[NS] \d{1,3}°\d{1,2}'\d{1,2}" ?[EW]$/;
  const decimalCoordinateRegex = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;
  return coordinateRegex.test(coordinate) || decimalCoordinateRegex.test(coordinate);
}
// Function to check if azimuth is valid

function isValidAzimuth(azimuth) {
  // Regulární výraz pro kontrolu platného azimuthu
  const azimuthRegex = /^(?:[0-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|360)$/;
  return azimuthRegex.test(azimuth);
}
// Function to convert GPS coordinates to decimal format

function convertToScriptCoordinate(coordinate) {
  var decimalLatitude = 0;
  var decimalLongitude = 0;
  coordinate = coordinate.replace(/\s+([SJVZNEW])/g, '$1');
  const decimalCoordinateRegex = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;
  if(decimalCoordinateRegex.test(coordinate)){
    decimalLatitude = coordinate.split(" ")[0];
    decimalLongitude = coordinate.split(" ")[1];
  } else {
    const [latitude, longitude] = coordinate.split(" ");
    function convertCoordinatePart(part) {
      const [degrees, minutes, seconds] = part.split(/[°'"]/).map(parseFloat);
      return degrees + minutes / 60 + seconds / 3600;
    }
    decimalLatitude = convertCoordinatePart(latitude);
    decimalLongitude = convertCoordinatePart(longitude);
    const isSouth = latitude.includes("S");
    const isWest = longitude.includes("W");
    if (isSouth) {
      decimalLatitude *= -1;
    }
    if (isWest) {
      decimalLongitude *= -1;
    }
  }
  return [decimalLatitude, decimalLongitude];
}


// Function to refresh the coordinates list on the page

function refreshCoorList(){
  coorList = document.getElementById("coorList");
   while (coorList.firstChild) {
    coorList.removeChild(coorList.firstChild);
  }
  saveGPSPoints();
  gpsCoordinates.forEach(item => {
    const newListItem = document.createElement('li');
    newListItem.textContent = formatListItem(item);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if(item.visible){
      checkbox.checked = true;
    }
    newListItem.prepend(checkbox);
    checkbox.addEventListener('change', () => plot(item.uuid));
    newListItem.append(" | Action: ");
    const dlt = document.createElement('a');
    dlt.href="#";
    dlt.innerHTML="Delete";
    dlt.addEventListener('click', () => deletePoint(item.uuid));
    newListItem.append(dlt);
    coorList.appendChild(newListItem);
  });
}
// Function to delete a point by its UUID

function deletePoint(uuid) {
    const indexToDelete = gpsCoordinates.findIndex(item => item.uuid === uuid);
    const item = gpsCoordinates.find(item => item.uuid === uuid);

  if (indexToDelete !== -1) {
    const confirmation = confirm("Are you sure you want to delete this point? \n"+ formatListItem(item));

    if (confirmation) {
          gpsCoordinates.splice(indexToDelete, 1);
          refreshCoorList();
    } else {
          console.log("Point deletion canceled.");
    }
  } else {
    
    console.log("Point with the given UUID not found.");
  }
  redrawAllLines();
  saveGPSPoints();
  return false;
}

// Function to handle the visibility of a point

function plot(uuid){
   

   const foundItem = gpsCoordinates.find(item => item.uuid === uuid);
      if (foundItem) {
          foundItem.visible = event.target.checked;
          redrawAllLines();
          saveGPSPoints();
       } else {
          console.log("Item with this GUID was not found.");
      } 

}

// Function to redraw all lines on the map

function redrawAllLines() {
  mergedPoints = [];
          layer.removeAll();
          gpsCoordinates.forEach(item => {
            if(item.visible){
               mergedPoints = mergedPoints.concat(drawLineWithAzimuth(item.latitude,item.longitude,item.azimuth,item.distance, item.uuid));
            }
          })
  if(mergedPoints.length===0){
      m.setCenterZoom(SMap.Coords.fromWGS84(14.400307, 50.071853), 9, true);
  } else {
    var  centerZoomCalc = m.computeCenterZoom(mergedPoints,true)
    m.setCenterZoom(centerZoomCalc[0], centerZoomCalc[1], true);
  }
   
}
// Function to format a list item for display

function formatListItem(obj) {
  const { latitude, longitude, azimuth, distance, note } = obj;

  const formattedCoordinates = `Latitude: ${latitude}, Longitude: ${longitude}, Azimuth: ${azimuth}, Distance: ${distance}, Note: ${note}`;

  return formattedCoordinates;
}

// Function to generate a UUID

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
// Function to save GPS points to local storage

function saveGPSPoints(){
  const gpsCoordinatesJson = JSON.stringify(gpsCoordinates);
  localStorage.setItem('gpsData', gpsCoordinatesJson);
}
// Function to load GPS points from local storage

function loadGPSPoints(){
  const gpsCoordinatesJson = localStorage.getItem('gpsData');
  if (gpsCoordinatesJson) {
    window.gpsCoordinates = JSON.parse(gpsCoordinatesJson);
  }
}


// Function to get GPS location from the device

function getGPSLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById("coorInput").value = latitude + " " + longitude;
      },
      function(error) {
        console.error("cannot get GPS coordinates:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported in this browser.");
  }
}
// Function to prefill GPS and azimuth values



function prefillGPSandAzimuth() {
  getGPSLocation();
  getDeviceOrientation();
}
// Function to get device orientation / azimuth
function getDeviceOrientation() {
  if ("deviceorientationabsolute" in window) {
    window.addEventListener("deviceorientationabsolute", deviceAzimuthChange);
  } else {
    console.error("Azimuth acquisition is not supported in this browser.");
  }
}

function deviceAzimuthChange(event){
   if (event.absolute) {
      const alpha = Math.round(event.alpha,0);
      document.getElementById("azimuthInput").value = alpha;
      document.getElementById("azimuthAccuracy").innerHTML = "Accuracy:" + event.webkitCompassAccuracy;
       if ('webkitCompassAccuracy' in DeviceOrientationEvent.prototype) {
          if(Math.abs(event.webkitCompassAccuracy) < 10 ){
                  window.removeEventListener("deviceorientationabsolute", deviceAzimuthChange);
          }
       }else{
            window.removeEventListener("deviceorientationabsolute", deviceAzimuthChange);
      }
    }
}