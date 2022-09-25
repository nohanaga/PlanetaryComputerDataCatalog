import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import {
  customFieldDatasource,
} from "../../../utils/layers";

// GeoJson をロードし、その座標を囲む カスタム polygon レイヤーを追加する
// Load GeoJson and add a custom polygon layer around the coordinates
const geojson_url = "./2022_152269.json";

//ファイルサイズが大きいので非同期処理
const fetchGeoJsonData = async (map:atlas.Map) => {
  var dataBounds = null;
  try {
    const res = await fetch(geojson_url);
    const json = await res.json();

        //Add the GeoJSON data to the data source.
        customFieldDatasource.add(json);
        
        //Calculate the bounding box of the GeoJSON data.
        var bounds = atlas.data.BoundingBox.fromData(json);

        //If data is already loaded from another GeoJSON file, merge the bounding boxes together.
        if (dataBounds) {
            dataBounds = atlas.data.BoundingBox.merge(dataBounds, bounds);
        } else {
            dataBounds = bounds;
        }

        //Update the map view to show the data.
        map.setCamera({
            bounds: dataBounds,
            padding: 50
        });

  } catch (e) {
    return "error"
  }
}

const useCustomFieldLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {

  useEffect(() => {
    const map = mapRef.current;
    var popup: atlas.Popup;
    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(customFieldDatasource)) {
      map.sources.add(customFieldDatasource);

      //Add a layer for rendering the polygons.
      var polygonLayer = new atlas.layer.PolygonLayer(customFieldDatasource, "筆ポリゴン", {
        fillColor: '#1e90ff',
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']]	//Only render Polygon or MultiPolygon in this layer.
      });
      //Add a click event to the layer.
      map.events.add('click', polygonLayer, featureClicked);

      //Add a layer for rendering line data.
      var lineLayer = new atlas.layer.LineLayer(customFieldDatasource, "筆ポリゴン(線2)", {
        strokeColor: '#1e90ff',
        strokeWidth: 4,
        filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']]	//Only render LineString or MultiLineString in this layer.
      });

      //Add a click event to the layer.
      map.events.add('click', lineLayer, featureClicked);

      //Add a layer for rendering point data.
      var pointLayer = new atlas.layer.SymbolLayer(customFieldDatasource, "筆ポリゴン(シンボル)", {
        iconOptions: {
            allowOverlap: true,
            ignorePlacement: true
        },
        filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
      });

      //Add a click event to the layer.
      map.events.add('click', pointLayer, featureClicked);

      //Add polygon and line layers to the map, below the labels..
      map.layers.add([
        polygonLayer,

        //Add a layer for rendering the outline of polygons.
        new atlas.layer.LineLayer(customFieldDatasource, "筆ポリゴン(線)", {
            strokeColor: 'black',
            filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']]	//Only render Polygon or MultiPolygon in this layer.
        }),

        lineLayer, pointLayer
      ], 'labels');

      map.layers.add(pointLayer);
      //Create a popup but leave it closed so we can update it and display it later.
      popup = new atlas.Popup({
        position: [0, 0]
      });

      // load GeoFson data async
      fetchGeoJsonData(map);

    }

    function featureClicked(e:any) {
      //Make sure the event occurred on a shape feature.
      if (e.shapes && e.shapes.length > 0) {
          //By default, show the popup where the mouse event occurred.
          var pos = e.position;
          var offset = [0, 0];
          var properties;

          if (e.shapes[0] instanceof atlas.Shape) {
              properties = e.shapes[0].getProperties();

              //If the shape is a point feature, show the popup at the points coordinate.
              if (e.shapes[0].getType() === 'Point') {
                  pos = e.shapes[0].getCoordinates();
                  offset = [0, -18];
              }
          } else {
              properties = e.shapes[0].properties;

              //If the shape is a point feature, show the popup at the points coordinate.
              if (e.shapes[0].type === 'Point') {
                  pos = e.shapes[0].geometry.coordinates;
                  offset = [0, -18];
              }
          }

          //Update the content and position of the popup.
          popup.setOptions({
              //Create a table from the properties in the feature.
              content: atlas.PopupTemplate.applyTemplate(properties),
              position: pos,
              pixelOffset: offset
          });

          //Open the popup.
          if (map) {
            popup.open(map);
          }
          
      }
    }

  }, [mapRef, mapReady]);
};

export default useCustomFieldLayer;
