document.addEventListener("DOMContentLoaded", function() {

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var s;
    if (w > 900) {
      s = 14
    } else {
      s = 13
    }

    L.mapbox.accessToken = 'pk.eyJ1IjoiZ2thcHBlbmJlcmdlciIsImEiOiJjaXYyOGVxdjIwMDBtMm5sb3Y0Ymt6cGwyIn0.hI8650oyLtAaYPwIi09MHw';
    var map = L.mapbox.map('map');
    map.setView([52.476, 13.443], s);
    L.mapbox.styleLayer('mapbox://styles/mapbox/light-v9').addTo(map);
    map.attributionControl.setPosition('bottomleft');
    map.zoomControl.setPosition('topleft');

    if (w < 640) {
      L.control.locate({position:"bottomright"}).addTo(map);
    } else {
      L.control.locate({position:"topleft"}).addTo(map);
    }


    const bikeMap = {};


    // geojson layers

    // buegel
    var standIcon = L.icon({
      iconUrl: 'img/icon-buegel-c.png',
      iconSize: [20, 25],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });

    bikeMap.bikeParking = L.mapbox.featureLayer()
      .loadURL('./js/bikeparking.geojson')
      .on('ready', function(e) {
        bikeMap.bikeParking.clusterGroup = new L.MarkerClusterGroup({
          maxClusterRadius: 40,
          disableClusteringAtZoom: 16,
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              iconSize: [20, 25],
              html: '<div class="buegel-cluster"><div class="count">' + cluster.getChildCount() + '</div></div>'
            });
          }
        });
        bikeMap.bikeParking.eachLayer(function(layer) {
          var capacity = layer.feature.properties.capacity;
          var covered = layer.feature.properties.covered;
          layer.bindPopup('<div>Anzahl: ' + capacity + '</div>' , {
            maxWidth: 300
          });
          bikeMap.bikeParking.clusterGroup.addLayer(layer);
        });
        map.addLayer(bikeMap.bikeParking.clusterGroup);
      })
      .on('layeradd', function(e) {
          var marker = e.layer, feature = marker.feature;
          marker.setIcon(standIcon);
      });




    // bike shops
    var bikeIcon = L.icon({
      iconUrl: 'img/icon-bike-y.png',
      iconSize: [31, 19],
      iconAnchor: [16, 9],
      popupAnchor: [0, -8]
    });

    bikeMap.bikeShops = L.mapbox.featureLayer()
      .loadURL('./js/bikeshops.geojson')
      .on('ready', function(e) {
        bikeMap.bikeShops.clusterGroup = new L.MarkerClusterGroup({
          maxClusterRadius: 40,
          disableClusteringAtZoom: 16,
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              iconSize: [20, 20],
              html: '<div class="bike-cluster"><div class="count">' + cluster.getChildCount() + '</div></div>'
            });
          }
        });
        bikeMap.bikeShops.eachLayer(function(layer) {
          var shopName = layer.feature.properties.name;
          var shopHead, shopStreet, shopStreetNr;
          if (layer.feature.properties.website) {
            shopHead = '<a href="'+ layer.feature.properties.website +'" target="_blank">'+ shopName +'</a>';  
          } else {
            shopHead = shopName;
          }
          if (layer.feature.properties['addr:street']) {
            shopStreet = layer.feature.properties['addr:street'];
            shopStreetNr = layer.feature.properties['addr:housenumber'];
          } else {
            shopStreet = '';
            shopStreetNr = '';
          }
          layer.bindPopup('<div class="popupHead">' + shopHead + '</div>' + shopStreet +'&nbsp;'+ shopStreetNr, {
            maxWidth: 300
          });
          bikeMap.bikeShops.clusterGroup.addLayer(layer);
        });
        map.addLayer(bikeMap.bikeShops.clusterGroup);
      })
      .on('layeradd', function(e) {
          var marker = e.layer, feature = marker.feature;
          marker.setIcon(bikeIcon);
      });
      // .addTo(map);


    // members
    bikeMap.members = L.mapbox.featureLayer()
      .loadURL('./js/members.geojson')
      .on('ready', function(e) {
        bikeMap.members.eachLayer(function(layer) {
          var memberName = layer.feature.properties.name;
          var memberStreet, memberHead;
          if (layer.feature.properties.website) {
            memberHead = '<a href="'+ layer.feature.properties.website +'" target="_blank">'+ memberName +'</a>';  
          } else {
            memberHead = memberName;
          }
          if (layer.feature.properties.street) {
            memberStreet = layer.feature.properties.street;
          } else {
            memberStreet = '';
          }
          layer.bindPopup('<div class="popupHead">' + memberHead + '</div>' + memberStreet, {
            maxWidth: 300
          });
        });
      })
      .on('layeradd', function(e) {
          var marker = e.layer, feature = marker.feature;
          marker.setIcon(L.mapbox.marker.icon({
              'marker-symbol': 'm',
              'marker-size': 'large',
              'marker-color': '#7EC0EE' 
          }));
      })
      .addTo(map);


    // cargo bikes
    var cargoIcon = L.icon({
      iconUrl: 'img/icon-cargo-b.png',
      iconSize: [30, 17],
      iconAnchor: [15, 9],
      popupAnchor: [0, -19]
    });

    bikeMap.cargoBikes = L.mapbox.featureLayer()
      .loadURL('./js/cargobikes.geojson')
      .on('ready', function(e) {
        bikeMap.cargoBikes.eachLayer(function(layer) {
          var cargoName = layer.feature.properties.name;
          var cargoUrl = '<a href="'+ layer.feature.properties.url +'" target="_blank">Kontakt -></a>';  
          var cargoStreet = layer.feature.properties.street;
          layer.bindPopup('<div class="popupHead">' + cargoName + '</div>' + cargoStreet +'<br>' + cargoUrl, {
            maxWidth: 300
          });
        });
      })
      .on('layeradd', function(e) {
          var marker = e.layer, feature = marker.feature;
          marker.setIcon(cargoIcon);
      })
      .addTo(map);


    // neukoelln outline
    bikeMap.neukoelln = L.mapbox.featureLayer()
      .loadURL('./js/neukoelln.geojson')
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          weight: 0,
          fillColor: '#555',
          fillOpacity: '0.3'
        });
      })
      .addTo(map);


    // cobblestone
    bikeMap.cobblestone = L.mapbox.featureLayer()
      .loadURL('./js/cobblestone.geojson')
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          color:'#faad00',
          weight: 2,
          dashArray: "5, 10, 5, 10" 
        });
      })
      .addTo(map);


    bikeMap.bikepathLane = L.mapbox.featureLayer()
      .loadURL('./js/bikepathLane.geojson')
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          color:'rgba(149, 117, 205, 0.7)',
          weight: 3
        });
      })
      .addTo(map);

    bikeMap.bikepathTrack = L.mapbox.featureLayer()
      .loadURL('./js/bikepathTrack.geojson')
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          color:'rgba(102,204,102,0.7)',
          weight: 3
        });
      })
      .addTo(map);

    bikeMap.bikepathShareBus = L.mapbox.featureLayer()
      .loadURL('./js/bikepathShareBus.geojson')
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          color:'rgba(0,0,0,0.4)',
          weight: 3
        });
      })
      .addTo(map);


    // Routen
    var tracks = [], trackNames = [];  
    bikeMap.routes = L.mapbox.featureLayer()
      .loadURL('./js/routes.geojson')
      .on('ready', function(e) {
        bikeMap.routes.eachLayer(function(layer) {
          tracks.push(layer);
          trackNames.push(layer.feature.properties.name);
        });
      })
      .on('layeradd', function(e) {
        var line = e.layer;
        line.setStyle({
          color:'#f55050',
          weight: 3
        });
      });

    bikeMap.routeList = document.getElementById('route-list');

    window.setTimeout(() => {
      for (var i = 0; i < tracks.length; i++) {
        var node = document.createElement('div');
        node.className = 'track';
        var textNode = document.createTextNode(trackNames[i]);
        node.appendChild(textNode);
        bikeMap.routeList.appendChild(node);
      }

      bikeMap.routeItems = document.querySelectorAll('.track');
      bikeMap.routeItems.forEach((element, index) => {
        tracks[index].visible = false;
        // element.addEventListener('touchend', (e) => {
        //   handleTracksClick(index);
        // });
        element.addEventListener('click', (e) => {
          handleTracksClick(index);
        });
      });


      bikeMap.filterWrap = document.getElementById('filter-wrap');
      bikeMap.filterWrapHeight = bikeMap.filterWrap.offsetHeight + 'px';
      bikeMap.filterWrap.style.height = bikeMap.filterWrapHeight;
      bikeMap.routeBtn = document.getElementById('routes-btn');
      let routesOpen = false;
      // bikeMap.routeBtn.addEventListener('touchend', () => {
      //   openTracks();
      // });
      bikeMap.routeBtn.addEventListener('click', () => {
        openTracks();
      });

      const openTracks = () => {
        if (!routesOpen) {
          bikeMap.filterWrap.style.height = 0;
          bikeMap.routeList.classList.add('is-active');
          routesOpen = !routesOpen;
        } else {
          bikeMap.filterWrap.style.height = bikeMap.filterWrapHeight;
          bikeMap.routeList.classList.remove('is-active');
          routesOpen = !routesOpen;
        }
      }

    }, 1000);



    const handleTracksClick = (index) => {
      if (!tracks[index].visible) {
        tracks[index].addTo(map);
        tracks[index].visible = true;
        bikeMap.routeItems[index].classList.add('is-active');
      } else {
        map.removeLayer(tracks[index]);
        tracks[index].visible = false;
        bikeMap.routeItems[index].classList.remove('is-active');
      }
      let trackSum = document.querySelectorAll('.track.is-active').length;
      if (trackSum > 0) {
        bikeMap.routeBtn.classList.add('is-active');
      } else {
        bikeMap.routeBtn.classList.remove('is-active');
      }
    }





    // filter menu

    bikeMap.filterHead = document.querySelector('.filter-head');
    bikeMap.filterMenu = document.querySelector('.filter');
    bikeMap.menuBtn = document.querySelector('.menu-btn');
    var filterOpen;
    bikeMap.filterHead.addEventListener('click', () => {

      if (!filterOpen) {
        bikeMap.filterMenu.classList.remove('off');
        bikeMap.menuBtn.classList.add('is-active');
        filterOpen = true; 
      } else {
        bikeMap.filterMenu.classList.add('off');
        bikeMap.menuBtn.classList.remove('is-active');
        filterOpen = false;
      }
    });

    bikeMap.filterItems = bikeMap.filterMenu.querySelectorAll('.filter-item');
    // bikeMap.members.visible = true;
    bikeMap.bikeShops.visible = true;
    bikeMap.cobblestone.visible = true;
    bikeMap.cargoBikes.visible = true;
    bikeMap.bikeParking.visible = true;
    bikeMap.bikepathTrack.visible = true;
    bikeMap.bikepathLane.visible = true;
    bikeMap.bikepathShareBus.visible = true;
    bikeMap.routes.visible = false;


    bikeMap.filterItems.forEach((element, index) => { 
      // element.addEventListener('touchend', (e) => {
      //   handleFilterClick(e);
      // });
      element.addEventListener('click', (e) => {
        handleFilterClick(e);
      });
    });
    map.removeLayer(bikeMap.members);



    const handleFilterClick = (e) => {
      var layerName = e.target.getAttribute('data-layer');
      if (bikeMap[layerName].visible) {
        map.removeLayer(bikeMap[layerName]);
        if (bikeMap[layerName].clusterGroup) {
          map.removeLayer(bikeMap[layerName].clusterGroup);  
        }
        bikeMap[layerName].visible = false;
        e.target.classList.remove('is-active');
      } else {
        if (bikeMap[layerName].clusterGroup) {
          bikeMap[layerName].eachLayer(function(layer) {
            bikeMap[layerName].clusterGroup.addLayer(layer);
          });
          map.addLayer(bikeMap[layerName].clusterGroup);
        } else {
          map.addLayer(bikeMap[layerName]);
        }
        bikeMap[layerName].visible = true;
        e.target.classList.add('is-active');
      } 
    }


    // layout
    const showFilter = () => {
      var vw = window.innerWidth;
      if (vw > 1200) {
        bikeMap.filterMenu.classList.remove('off');
        bikeMap.menuBtn.classList.add('is-active');
        filterOpen = true; 
      } else {
        bikeMap.filterMenu.classList.add('off');
        bikeMap.menuBtn.classList.remove('is-active');
        filterOpen = false;
      }
    }
    showFilter();
    var resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(showFilter(), 100);
    });



    var filterMenu = document.getElementById("filter-menu");
    var myOptions;
    var hammertime = new Hammer(filterMenu, myOptions);
    hammertime.on('swiperight', function(ev) {
      bikeMap.filterMenu.classList.add('off');
      bikeMap.menuBtn.classList.remove('is-active');
      filterOpen = false;
    });







});




