var drawMap = function() {

  var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  );
  var map=L.map('map',  {
          center : [48.42623893795082, -123.35449218750001],
          zoom : 13,
          minZoom : 8,
          layers : [baseLayer]
      }
  );
  var forkKnive = L.icon({
      iconUrl: 'public/images/mappin.png',
      iconSize:     [20, 20],
      iconAnchor:   [10, 0]
  });
  L.popup()
      .setLatLng([48.42623893795082, -123.35449218750001])
      .setContent('<h1>Welcome to Forks & Knives Victoria </h1><h3>Use this map to find restaurants in Victoria. Click on a pin to learn more about a restaurant. </h3><p>Data derived from Business License 2018 dataset courtesy of: http://opendata.victoria.ca. This dataset was filtered for redistribution by this Express API: </p>')
      .openOn(map);

  return {

      setFeatures : (features) => {
        features = JSON.parse(features);
        features.forEach(function(feature){
          addEvents(feature);
        })
          function addEvents(feature) {
            var marker = L.marker(feature.latlng, {icon: forkKnive}).addTo(map);
            marker.on("click", function(){

              L.popup()
                .setLatLng(feature.latlng)
                .setContent(L.Util.template('<h1>{a}</h1><h3>{b}</h3>', {a: feature.name, b: feature.addr}))
                .openOn(map);
              map.setView(feature.latlng, 15);
          });
        }
      }
  }
}

var map = drawMap();
fetchIt("https://salty-thicket-52158.herokuapp.com/poi", map.setFeatures)

function fetchIt (url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       callback(xhttp.responseText);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}
