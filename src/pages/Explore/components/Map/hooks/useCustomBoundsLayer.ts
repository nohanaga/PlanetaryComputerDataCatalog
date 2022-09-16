import * as atlas from "azure-maps-control";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import {
  itemLineLayer2,
  itemOutlineLayer2,
  customDatasource,
} from "../../../utils/layers";
import * as geojson from "geojson-reducer";
var geojson_data = require('../../../data/minamiuonuma-data.json');

// Show highlighted stac item result footprint on the map

const useCustomBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const {
    map: { boundaryShape },
    detail,
  } = useExploreSelector(s => s);

  const boundaryPoly = boundaryShape ?? detail.selectedItem?.geometry;

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(customDatasource)) {
      console.log("### customDatasource")
      map.sources.add(customDatasource);
      map.layers.add(itemLineLayer2, "labels");
      map.layers.add(itemOutlineLayer2, itemLineLayer2);

      var red_geojson1 = geojson.reduceGeoJson(JSON.stringify(geojson_data));
      var red_geojson2 = geojson.reduceGeoJson(JSON.stringify(red_geojson1));
      var polygon = red_geojson2.features[0].geometry.coordinates[0];
      console.log(polygon.length);
      //var point1 = new atlas.Shape(new atlas.data.Point([ 138.935823086666346, 37.208455026978072 ]));
      //stacItemDatasource.add([point1, point2]);
      //map.layers.add(new atlas.layer.SymbolLayer(stacItemDatasource, ""));
      customDatasource.add(new atlas.data.Polygon(polygon));
    } else {
      console.log(map.sources.getSources())
    }



  }, [mapRef, mapReady]);

/*
  useEffect(() => {
    console.log("useEffect is not use.")
    
    if (!boundaryPoly) {
      //stacItemDatasource.clear();
      console.log("### stacItemDatasource.clear() #1")
    } else {
      const geom = boundaryPoly as atlas.data.MultiPolygon;
      stacItemDatasource.clear();
      stacItemDatasource.add(geom);
      console.log("### stacItemDatasource.clear() #2")
      
      if (detail.showAsLayer) {
        mapRef.current?.setCamera({
          bounds: atlas.data.BoundingBox.fromData(geom),
          padding: 100,
          duration: 500,
          type: "ease",
        });
      }
    }
    
    
  }, [mapRef, boundaryPoly, detail.showAsLayer]);
*/

};

export default useCustomBoundsLayer;
