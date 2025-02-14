import { useCallback, useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import atlas from "azure-maps-control";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setCamera } from "pages/Explore/state/mapSlice";
import {
  collectionLineLayer,
  collectionLineLayerName,
  collectionOutlineLayer,
  itemLineLayerName,
  itemOutlineLayerName,
  itemLineLayerName2,
  itemOutlineLayerName2,
} from "pages/Explore/utils/layers";
import { makeLayerId } from "./useMosaicLayer";

const useMapEvents = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const { height, width } = useWindowSize();
  const [areTilesLoading, setTilesLoading] = useState<boolean>(false);
  const layerOrder = useExploreSelector(s => s.mosaic.layerOrder);
  const bottomLayer = makeLayerId(layerOrder[layerOrder.length - 1]);

  useEffect(() => {
    // Some actions that resize the map that occur from browser chrome (show
    // bookmark bar, devtools, etc) are animated and don't have the new height
    // set when this fires. Timeout for a bit to make sure the map is resized to
    // the correct size.
    setTimeout(() => {
      mapRef.current?.resize();
    }, 100);
  }, [height, width, mapRef]);

  // Update state when map moves end
  const onMapMove = useCallback(
    (e: atlas.MapEvent) => {
      const camera = e.map.getCamera();
      dispatch(setCamera(camera));
    },
    [dispatch]
  );

  // When the basemap style is changed, it changes the order of all loaded layers
  // which need to be manually reset.
  const onStyleDataLoaded = useCallback(
    (e: atlas.MapDataEvent) => {
      if (e.dataType === "style") {
        const layerMgr = e.map.layers;
       
        if (layerMgr.getLayers()[0].getId() !== "base") {
          const hasOutlineLayer = layerMgr.getLayerById(itemLineLayerName);
          if (hasOutlineLayer) {
            layerMgr.move(itemLineLayerName, "labels");
            layerMgr.move(itemOutlineLayerName, itemLineLayerName);
          }

          const hasOutlineLayer2 = layerMgr.getLayerById(itemLineLayerName2);
          if (hasOutlineLayer2) {
            layerMgr.move(itemLineLayerName2, "labels");
            layerMgr.move(itemOutlineLayerName2, itemLineLayerName2);
            console.log("### onStyleDataLoaded2");
          }

          const hasCollectionLayer = layerMgr.getLayerById(collectionLineLayerName);
          if (hasCollectionLayer) {
            layerMgr.move(collectionLineLayer, "labels");
            layerMgr.move(collectionOutlineLayer, collectionLineLayer);
          }

          const mosaicLayer = layerMgr.getLayerById(bottomLayer);
          if (hasOutlineLayer && mosaicLayer) {
            layerMgr.move(mosaicLayer, itemLineLayerName);
          }

          // To prevent runaway re-renders, move the base layer under the first
          // layer if it isn't already. This likely means a custom layer hasn't been
          // handled above.
          const firstLayerId = layerMgr.getLayers()[0].getId();
          if (firstLayerId !== "base") {
            layerMgr.move("base", firstLayerId);
          }
        }
      }
    },
    [bottomLayer]
  );

  // Loading indicator for mosaic tiles
  const onDataEvent = useCallback((e: atlas.MapDataEvent) => {
    const { map, isSourceLoaded, source, tile } = e;
    if (map.areTilesLoaded() && isSourceLoaded && source === undefined && tile) {
      setTilesLoading(false);
    } else if (!map.areTilesLoaded() && source === undefined && tile) {
      setTilesLoading(true);
    }
  }, []);

  return { onMapMove, onStyleDataLoaded, onDataEvent, areTilesLoading };
};

export default useMapEvents;
