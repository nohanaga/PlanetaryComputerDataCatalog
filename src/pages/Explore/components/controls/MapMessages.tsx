import { Link, Stack, Text, useTheme } from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { ILayerZoomVisibility } from "pages/Explore/types";

interface MessageProps {
  onClick: () => void;
  layerVisibility: ILayerZoomVisibility;
}

const MapMessage: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      className="explorer-map-component"
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translate(-50%, 0)",
        zIndex: 1,
        padding: "7px 10px",
        borderRadius: 5,
        border: "1px solid",
        borderColor: theme.semanticColors.primaryButtonBorder,
        backgroundColor: theme.semanticColors.bodyBackground,
        boxShadow: theme.effects.elevation16,
      }}
    >
      {children}
    </div>
  );
};

export const ZoomMessage: React.FC<MessageProps> = ({
  onClick,
  layerVisibility,
}) => {
  const isCurrentLayerInvisible = Boolean(layerVisibility.current);

  return isCurrentLayerInvisible ? (
    <MapMessage>
      <Text block style={{ textAlign: "center" }}>
        <Link onClick={onClick}>Zoom in</Link> to see search results
      </Text>
    </MapMessage>
  ) : null;
};

export const ExtentMessage = ({ onClick }: MessageProps) => {
  const { collection } = useExploreSelector(selectCurrentMosaic);

  return (
    <MapMessage>
      <Stack horizontalAlign={"center"} styles={{ root: { textAlign: "center" } }}>
        <Text block>This area doesn't include data from</Text>
        <Text block styles={{ root: { fontStyle: "italic" } }}>
          {collection?.title}
        </Text>
        <Text block styles={{ root: { paddingTop: 5 } }}>
          <Link onClick={onClick}>Zoom to</Link> the valid extent.
        </Text>
      </Stack>
    </MapMessage>
  );
};
