import * as atlas from "azure-maps-control";

export const layerControl = new atlas.control.StyleControl({
  mapStyles: [
    "road",
    "road_shaded_relief",
    "grayscale_light",
    "night",
    "grayscale_dark",
    "satellite",
    "satellite_road_labels",
  ],
});

export const stacItemDatasource = new atlas.source.DataSource();
export const stacCollectionDatasource = new atlas.source.DataSource();
// add custom datasource 2022/09/16
export const customDatasource = new atlas.source.DataSource();
export const customFieldDatasource = new atlas.source.DataSource();

export const collectionLineLayerName = "stac-collection-line";
export const collectionLineLayer = new atlas.layer.LineLayer(
  stacCollectionDatasource,
  collectionLineLayerName,
  {
    strokeOpacity: 0.4,
    strokeColor: "#2b88d8",
    strokeWidth: 2,
    strokeDashArray: [1, 1, 1],
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const collectionOutlineLayerName = "stac-collection-outline";
export const collectionOutlineLayer = new atlas.layer.LineLayer(
  stacCollectionDatasource,
  collectionOutlineLayerName,
  {
    strokeOpacity: 0.4,
    strokeColor: "#deecf9",
    strokeWidth: 4,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemLineLayerName = "stac-item-line";
export const itemLineLayer = new atlas.layer.LineLayer(
  stacItemDatasource,
  itemLineLayerName,
  {
    strokeColor: "rgb(0, 120, 212)",
    strokeWidth: 2,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemOutlineLayerName = "stac-item-outline";
export const itemOutlineLayer = new atlas.layer.LineLayer(
  stacItemDatasource,
  itemOutlineLayerName,
  {
    strokeColor: "#fff",
    strokeWidth: 4,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemPolyLayer = new atlas.layer.PolygonLayer(
  stacItemDatasource,
  "stac-item-fill",
  {
    fillColor: "rgba(255, 255, 255, 0.3)",
  }
);

export const itemHoverLayer = new atlas.layer.PolygonLayer(
  stacItemDatasource,
  "stac-hover-fill",
  {
    // select nothing as a base case
    filter: ["==", ["get", "id"], ""],
    fillColor: "rgba(150, 50, 255, 0.9)",
  }
);

export const getHighlightItemFn = (map: atlas.Map) => {
  return (e: atlas.MapMouseEvent) => {
    map.getCanvasContainer().style.cursor = "pointer";

    if (e?.shapes?.length) {
      const shape = e.shapes[0] as atlas.Shape;
      const stacId: string = shape.getId().toString();
      itemHoverLayer.setOptions({
        filter: ["==", ["get", "stacId"], stacId],
      });
    }
  };
};

export const getUnhighlightItemFn = (map: atlas.Map) => {
  return () => {
    map.getCanvasContainer().style.cursor = "grab";
    itemHoverLayer.setOptions({ filter: ["==", ["get", "stacId"], ""] });
  };
};

export const itemLineLayerName2 = "stac-item-line2";
export const itemLineLayer2 = new atlas.layer.LineLayer(
  customDatasource,
  itemLineLayerName2,
  {
    strokeColor: "rgb(241, 89, 212)",
    strokeWidth: 3,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemOutlineLayerName2 = "stac-item-outline2";
export const itemOutlineLayer2 = new atlas.layer.LineLayer(
  customDatasource,
  itemOutlineLayerName2,
  {
    strokeColor: "#fff",
    strokeWidth: 5,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemLineLayerName3 = "stac-item-line3";
export const itemLineLayer3 = new atlas.layer.LineLayer(
  customFieldDatasource,
  itemLineLayerName3,
  {
    strokeColor: "rgb(241, 89, 0)",
    strokeWidth: 3,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemOutlineLayerName3 = "stac-item-outline3";
export const itemOutlineLayer3 = new atlas.layer.LineLayer(
  customFieldDatasource,
  itemOutlineLayerName3,
  {
    strokeColor: "#fff",
    strokeWidth: 5,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);