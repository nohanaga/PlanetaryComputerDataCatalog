import { useEffect, useMemo } from "react";
import { IStackStyles, Stack, StackItem } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { resetMosaic } from "pages/Explore/state/mosaicSlice";
import { resetDetail } from "pages/Explore/state/detailSlice";
import MinimizeButton from "../controls/ToggleSidebarButton";
import { SIDEBAR_WIDTH } from "../../utils/constants";
import AnimationExporter from "./AnimationExporter";
import { CollectionItemFilter } from "./CollectionItemFilter/CollectionItemFilter";

export const Sidebar = () => {
  const dispatch = useExploreDispatch();
  const isSidebarVisible = useExploreSelector(s => s.map.showSidebar);
  const { showAsLayer: isItemLayerVisible } = useExploreSelector(s => s.detail);
  const { showAnimationPanel } = useExploreSelector(s => s.map);

  const { width, sidebarVisibility } = useMemo(() => {
    return {
      width: isSidebarVisible ? SIDEBAR_WIDTH : 0,
      sidebarVisibility: isSidebarVisible ? "visible" : "hidden",
    };
  }, [isSidebarVisible]);

  useEffect(() => {
    return () => {
      // When Explore unmounts, reset the mosaic state so it's fresh when the
      // user navigates back
      dispatch(resetMosaic());
      dispatch(resetDetail());
    };
  }, [dispatch]);

  const sidebarStyles: Partial<IStackStyles> = {
    root: {
      width: width,
      visibility: sidebarVisibility,
      transition: "width 0.3s",
      minWidth: 8,
    },
  };

  // Classes used to sync state via responsive media queries in css
  let visibilityClass =
    !isSidebarVisible || isItemLayerVisible ? "explorer-sidebar-hidden" : "";

  const registeredPanels = {
    itemSearch: <CollectionItemFilter sidebarVisibility={sidebarVisibility} />,
    animationExport: <AnimationExporter />,
  };
  const selectedPanel = showAnimationPanel ? "animationExport" : "itemSearch";
  return (
    <>
      <StackItem
        styles={sidebarStyles}
        className={`explorer-sidebar ${visibilityClass}`}
      >
        <Stack id="explorer-sidebar-content" styles={sidebarStackStyles}>
          {registeredPanels[selectedPanel]}
        </Stack>
      </StackItem>
      <MinimizeButton />
    </>
  );
};

const sidebarStackStyles: Partial<IStackStyles> = {
  root: {
    height: "100%",
  },
};
