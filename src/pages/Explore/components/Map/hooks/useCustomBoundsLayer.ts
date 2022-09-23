import React, { useRef } from 'react'
import * as atlas from "azure-maps-control";
import { drawing } from "azure-maps-drawing-tools";
//import { control } from "azure-maps-drawing-tools";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import {
  itemLineLayer2,
  itemOutlineLayer2,
  customDatasource,
} from "../../../utils/layers";
import * as geojson from "geojson-reducer";
var geojson_data = require('../../../data/minamiuonuma-data.json');

// GeoJson をロードし、その座標を囲む カスタム polygon レイヤーを追加する
// Load GeoJson and add a custom polygon layer around the coordinates

const useCustomBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const drawMgrRef = useRef<drawing.DrawingManager | null>(null);
  const {
    map: { boundaryShape },
    detail,
  } = useExploreSelector(s => s);
  const boundaryPoly = boundaryShape ?? detail.selectedItem?.geometry;

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(customDatasource)) {
      map.sources.add(customDatasource);

      var points = [
        new atlas.data.Point([138.827905468795,36.9270995640499]),
        new atlas.data.Point([138.849238100112,37.0347865765700]),
        new atlas.data.Point([138.877322796414,37.0657863950555]),
        new atlas.data.Point([138.937313627099,37.0565146523630]),
        new atlas.data.Point([138.931197440592,37.0938471161108]),
        new atlas.data.Point([138.903865371277,37.1170375291828]),
        new atlas.data.Point([138.937312481073,37.1662198804548]),
        new atlas.data.Point([138.805090303608,36.9868707669732]),
        new atlas.data.Point([138.843647956282,37.0143232533602]),
        new atlas.data.Point([138.878629816394,37.0166014062454]),
        new atlas.data.Point([138.909918456484,37.1475935315484]),
        new atlas.data.Point([138.944974856199,37.1317242484554]),
        new atlas.data.Point([138.968217247704,37.1632050456745])
    ];
      customDatasource.add(points);

      map.layers.add(itemLineLayer2, "labels");
      map.layers.add(itemOutlineLayer2, itemLineLayer2);

      //Create an image layer and add it to the map.
      map.layers.add(new atlas.layer.BubbleLayer(customDatasource, "jaoffice-layer", {
          radius: 5,
          strokeColor: "#4288f7",
          strokeWidth: 6, 
          color: "white",
          filter: ['==', ['geometry-type'], 'Point']
      }));

      var imageLayer = new atlas.layer.ImageLayer( {
        url: 'images/minamiuonuma_ja.png',
        coordinates: [
            [138.6722157631243135,37.2203711947195828], //Top Left Corner
            [139.1117476772190003,37.2203711947195828], //Top Right Corner
            [139.1117476772190003,36.8415565476457942], //Bottom Right Corner
            [138.6722157631243135,36.8415565476457942]  //Bottom Left Corner
        ],
        opacity: 0.3
      }, "minamiuonuma-layer");
      map.layers.add(imageLayer);

      var red_geojson1 = geojson.reduceGeoJson(JSON.stringify(geojson_data));
      var red_geojson2 = geojson.reduceGeoJson(JSON.stringify(red_geojson1));
      var polygon = red_geojson2.features[0].geometry.coordinates[0];
      customDatasource.add(new atlas.data.Polygon(polygon));
    }

    
  }, [mapRef, mapReady]);

};

export default useCustomBoundsLayer;
