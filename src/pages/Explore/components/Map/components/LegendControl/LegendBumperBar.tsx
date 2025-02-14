import { getTheme, IButtonStyles, IconButton, Stack } from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { pinCurrentMosaic, removeLayerById } from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";

interface LegendCmdBarProps {
  layer: ILayerState;
}

const LegendBumperBar = ({ layer }: LegendCmdBarProps) => {
  const dispatch = useExploreDispatch();

  const handlePin = () => {
    const layerId = layer.layerId;
    const isPinned = layer.isPinned;
    isPinned ? dispatch(removeLayerById(layerId)) : dispatch(pinCurrentMosaic());
  };

  const info = layer.isPinned
    ? { icon: "FluentPinFilled", title: "Unpin layer and remove from map" }
    : { icon: "FluentPinOutline", title: "Pin layer to map and perform new search" };

  const btnPin = (
    <IconButton
      aria-label={info.title}
      title={info.title}
      iconProps={{ iconName: info.icon }}
      onClick={handlePin}
      styles={bumperButtonStyles}
    />
  );

  return (
    <Stack horizontal horizontalAlign="center">
      {btnPin}
    </Stack>
  );
};

export default LegendBumperBar;

const theme = getTheme();
const bumperButtonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
    padding: "0px 12px 0px 16px",
  },
  rootHovered: {
    background: theme.semanticColors.bodyBackground,
  },
};
