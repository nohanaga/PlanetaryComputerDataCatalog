import React, { useRef } from 'react'
import * as atlas from "azure-maps-control";
import * as atlas2 from "azure-maps-drawing-tools";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setBboxDrawMode, setDrawnBbox } from "pages/Explore/state/mapSlice";
import { getTheme } from "@fluentui/react";
const theme = getTheme();

export const useMapDrawTools = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const dispatch = useExploreDispatch();
  const drawMgrRef = useRef<atlas2.drawing.DrawingManager | null>(null);
  const { isDrawBboxMode, drawnBbox } = useExploreSelector(s => s.map);

  // Initialize the drawing manager when the map is ready
  if (!drawMgrRef.current && mapRef.current && mapReady) {
    const mgr = new atlas2.drawing.DrawingManager(mapRef.current, {
      shapeDraggingEnabled: true,
      mode: atlas2.drawing.DrawingMode.idle,
      toolbar: new atlas2.control.DrawingToolbar({
        position: "top-right",
        style: "dark",
      }),
    });

    // Styles for drawn bboxes
    const drawnLayers = mgr.getLayers();

    drawnLayers.polygonOutlineLayer?.setOptions({
      strokeColor: theme.palette.themePrimary,
      strokeDashArray: [2, 2],
      strokeWidth: 3,
    });

    //Add Drawing Tool Events
    //https://learn.microsoft.com/azure/azure-maps/drawing-tools-events
    //mapRef.current.events.add("drawingmodechanged", mgr, drawingModeChanged);
    mapRef.current.events.add("drawingcomplete", mgr, drawingCompleted);
    mapRef.current.events.add("drawingerased", mgr, drawingErased);
    drawMgrRef.current = mgr;
  }
  function drawingErased(e:any) {
    geometryCoordinates = drawMgrRef.current?.getSource().getShapes();
  }
  function drawingModeChanged(e:any) {
    console.log(e);
  }
  function drawingCompleted(e:any) {
    geometryCoordinates = drawMgrRef.current?.getSource().getShapes();
  }

  if (!drawMgrRef.current || !mapRef.current) return;

  const { mode } = drawMgrRef.current.getOptions();

  const handleShapeAdded = (shape: atlas.Shape): void => {
    const bounds = shape.getBounds();
    dispatch(setDrawnBbox(bounds));
    dispatch(setBboxDrawMode(false));

    if (drawMgrRef.current) {
      mapRef.current?.events.remove(
        "drawingcomplete",
        drawMgrRef.current,
        handleShapeAdded
      );
    }
  };

  // Enable drawing mode
  if (isDrawBboxMode && mode !== atlas2.drawing.DrawingMode.drawRectangle) {
    drawMgrRef.current.getSource().clear();
    drawMgrRef.current?.setOptions({
      mode: atlas2.drawing.DrawingMode.drawRectangle,
    });

    mapRef.current.events.add(
      "drawingcomplete",
      drawMgrRef.current,
      handleShapeAdded
    );
  }

  // Disable drawing mode
  if (!isDrawBboxMode && mode !== atlas2.drawing.DrawingMode.idle) {
    drawMgrRef.current?.setOptions({
      mode: atlas2.drawing.DrawingMode.idle,
    });
  }

};

export var geometryCoordinates:any;
