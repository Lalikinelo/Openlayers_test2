window.onload = init;

function init(){
const fullScreenControl = new ol.control.FullScreen();
const mousePositionControl = new ol.control.MousePosition();
const overViewMapControl = new ol.control.OverviewMap({
  collapsed: false,
  layers:[
    new ol.layer.Tile({
      source: new ol.source.OSM()
      })
    ]
  })
const scaleLineControl = new ol.control.ScaleLine()
const zoomSliderControl = new ol.control.ZoomSlider();
const zoomToExtentControl = new ol.control.ZoomToExtent()

// Map object
const map = new ol.Map({
  view: new ol.View({
    center: [0, 0],
    zoom: 2,  
    rotation:2, 
    anchor: [300000,30]
  }),    
  target: 'js-map',
  keyboardEventTarget: document,
  controls: ol.control.defaults().extend([
    // adding new controls
    fullScreenControl,
    mousePositionControl,
    overViewMapControl,
    scaleLineControl,
    zoomSliderControl,
    zoomToExtentControl
    ])
  })

  // Base Layers
  // Openstreet Map Standard
  const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),    
    visible: true,
    title: 'OSMStandard'        
  })

  // affiche les coordonnées du curseur
const popupContainerElement = document.getElementById('popup-coordinates');
const popup = new ol.Overlay({
  element: popupContainerElement,
  positioning: 'center-left'
  })
map.addOverlay(popup);

map.on('click', function(e){
  const clickedCoordinate = e.coordinate;
  popup.setPosition(undefined);
  popup.setPosition(clickedCoordinate);
  popupContainerElement.innerHTML = clickedCoordinate;
  })

  // DragRotate Interaction
const dragRotateInteraction = new ol.interaction.DragRotate({
  condition: ol.events.condition.altKeyOnly
  })
map.addInteraction(dragRotateInteraction);

// Draw on the map
const drawInteraction = new ol.interaction.Draw({
  type: 'Polygon'
  })
  
map.addInteraction(drawInteraction);

drawInteraction.on('drawend',function(e){
  let parser = new ol.format.GeoJSON();
  let drawnFeatures = parser.writeFeaturesObject([e.feature]);
  console.log(drawnFeatures);
  })

map.addLayer(openstreetMapStandard);

//////////////////////////////////////////////////////////////////////////////////

//                    Base maps

//////////////////////////////////////////////////////////////////////////////////

const OSM_Layer = new ol.layer.Tile({
  source: new ol.source.OSM({
    url:'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    zIndex:0,
    visible:false,
    extent: [12400753.576694038, -5658730.000549673, 17174426.336716905, -980228.5067132516],
    opacity: 1,
    title: 'OSM_Layer'
    })      
  });


    // IGN WMS
const IGN_France_Layer =  new ol.layer.Tile({
  opacity: 0.5,
  zIndex:1,
  transparent: false,
  preload: Infinity,
  visible:false,
  title: 'IGN_France_Layer',
  source: new ol.source.TileWMS({
    url: 'https://wxs.ign.fr/choisirgeoportail/geoportail/r/wms?',
    params : {'layers':'ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO', 'format':'image/png','dpiMode':'7'}
  }),
});


bing_Layer = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: "AtkEaWxo_i_1eW5RR5Jglhar6VKEbjYY2X2F-4-wYN5CHnvNMdahkBrW9BjUXE_T",
    imagerySet: 'CanvasGray' // Aerial, AerialWithLabels, Road, CanvasDark, CanvasGray
    }),
  visible:false,
  zIndex:2,
  opacity: 1,
  title: 'bing_Layer'
  });

    // Bing Maps Basemap Layer
 
  


// Stamen basemap layer

const stamenLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
      url:'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
    }),
  visible: false,
  zIndex:4,
  title: 'stamenLayer'
  });

const NOAAWMSLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url:'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_dailymaxairtemp_offsets/MapServer/WMSServer?',
    params:{LAYERS: 5, FORMAT: 'image/png', TRANSPARENT: true },
    attributions: '<a href=https://nowcoast.noaa.gov/>© NOAA<a/>'
    }),
  visible: false,
  zIndex:5,
  title: 'NOAAWMSLayer'
  });

    // CartoDB BaseMap Layer
const cartoDBBaseLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:'https://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    params:{VERSION : '2.0.0', REQUEST:'GetFeature',TYPENAME:'DBTOPO_V3:' ,OUTPUTFORMAT: 'application/json',COUNT:'100'},
    // pas de opacity ni de zindex
    }),
    visible: false,
    zIndex:6,
    title: 'cartoDBBaseLayer'
  });


// creation du groupe et Affichage
const baseLayerGroup = new ol.layer.Group({
  layers:[OSM_Layer, bing_Layer, stamenLayer, NOAAWMSLayer,IGN_France_Layer, cartoDBBaseLayer] //
});

map.addLayer(baseLayerGroup);




// Affichage des couches raqter avec un Bouton radio

const baseLayerElements = document.querySelectorAll('input[name=baseLayerRadioButton]');
// choix du bouton radio sélectionné
for (let baseLayerElement of baseLayerElements){
  // Changer la couche en fonction du bouton radio
  baseLayerElement.addEventListener('change', function(){
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(element, index, array){
      let baseLayerName = element.get('title');
      element.setVisible(baseLayerName === baseLayerElementValue);
      // rendre visible le layer qui a le même nom que celui dont le bouton radio est coché
    })
  })
}



//////////////////////////////////////////////////////////////////////////


//              Couches vecteur


//////////////////////////////////////////////////////////////////////////


//Vector MapTiler
const Maptiler = new ol.layer.VectorTile({
source: new ol.source.VectorTile({
    url: 'https://api.maptiler.com/tiles/v3-4326/{z}/{x}/{y}.pbf?key=Es6gWkB1kbS4O9RJyKjz',
    format: new ol.format.MVT(),
    attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
  }),
  visibile:true
})
map.addLayer(Maptiler)

/*
const EUCentralGeoJSON = new ol.layer.Vector({
  source: new ol.source.Vector({
    url:'https://download.data.grandlyon.com/wfs/rdata?',
    params:{SERVICE:'WFS',VERSION:'2.0.0',request:'GetFeature',typename:'tcl_sytral.tclstation',SRSNAME:'EPSG:4326',OUTPUTFORMAT:'application/json'}
  }),
  visible: true
  })
  map.addLayer(EUCentralGeoJSON);
*/

const VectorLayerGroup = new ol.layer.Group({
  layers:[Maptiler] //
});

map.addLayer(VectorLayerGroup);



/*
// TileDebug
const tileDebugLayer = new ol.layer.Tile({
  source: new ol.source.TileDebug()
  })
  map.addLayer(tileDebugLayer);
*/
}


