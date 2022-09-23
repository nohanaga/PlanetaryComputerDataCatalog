import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { layerControl } from "../../../utils/layers";
import * as atlas3 from "utils/azure-maps-layer-legend";

// Setup tile layers and map controls
const useMapControls = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    var customlLayerControl = new atlas3.control.LayerControl({
      dynamicLayerGroup: {
        groupTitle: "Layers",
        layout: "checkbox"
      },
    });

    const controls: atlas.Control[] = [
      new atlas.control.CompassControl(),
      new atlas.control.ZoomControl(),
      layerControl
    ];

    if (map.controls.getControls().length < controls.length) {
      map.controls.add(controls, {
        position: atlas.ControlPosition.TopRight,
      });
      map.controls.add(customlLayerControl, {
        position: atlas.ControlPosition.BottomLeft,
      });
    }
  }, [mapReady, mapRef]);
};

export default useMapControls;
