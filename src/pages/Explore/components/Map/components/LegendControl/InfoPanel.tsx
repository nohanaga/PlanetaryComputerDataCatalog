import { useState } from "react";
import axios from "axios";
import { geometryCoordinates } from "pages/Explore/components/Map/hooks/useMapDrawTools"
import { fetchGeoJsonData } from "pages/Explore/components/Map/hooks/useCustomFieldLayer"
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Text,
  Spinner,
  SpinnerSize
 } from "@fluentui/react";
import {
  stacFormatter,
} from "utils/stac";

const fetchNDVIJson = async (
  url: string,
  geometry: any
) => {
  const headers = {
    'x-functions-key': process.env.REACT_APP_FUNCIONS_KEY ?? ""
  }

  const resp = await axios.post(url, {
    data: geometry
  },
  {
    headers: headers
  })
  .then((response) => response.data)
  .catch((error) => {
    console.log(`Error! code: ${error.response.status}, message: ${error.message}`);
    return error.response.data;
  });
  return resp;
};

const InfoPanel = (values:any) => {
  const [items, setItems] = useState([{}]);
  const [items2, setItems2] = useState([{}]);

  const [visible, setSpinnerVisible] = useState("none");
  const [polygonSpinner, setpolygonSpinnerVisible] = useState("none");

  function mkStat(key: string, values: any) {
    var retdict = {"key": key, "values": values }

    return retdict
  }

  const handleClick = () => {
    var stats: any;
    if (geometryCoordinates && geometryCoordinates.length > 0) {
      var shapelist = [];
      var coords = [];
      var itemdict = {};
      setSpinnerVisible("inline-block")

      for (let key in geometryCoordinates) {
        coords = geometryCoordinates[key]['data']['geometry']['coordinates'][0]
        itemdict  = {"id": geometryCoordinates[key]['data']['id'], "coords": coords}
        shapelist.push(itemdict)
      }
      
      const restapiurl = "https://space-hackathon-api.azurewebsites.net/api/Analyze"
      let res = fetchNDVIJson(restapiurl, shapelist)

      res.then((returnVal) => {
        stats = returnVal.data;

        if(stats.length===2){
          setItems([
            mkStat("count", stats[0].stats.count[0]),
            mkStat("min", stats[0].stats.min[0]),
            mkStat("max", stats[0].stats.max[0]),
            mkStat("mean", stats[0].stats.mean[0]),
            mkStat("median", stats[0].stats['25%'][0]),
            mkStat("datetime", stats[0].datetime)]);

          setItems2([
            mkStat("count", stats[1].stats.count[0]),
            mkStat("min", stats[1].stats.min[0]),
            mkStat("max", stats[1].stats.max[0]),
            mkStat("mean", stats[1].stats.mean[0]),
            mkStat("median", stats[1].stats['25%'][0]),
            mkStat("datetime", stats[1].datetime)]);
        } else {
          setItems([
            mkStat("count", stats[0].stats.count[0]),
            mkStat("min", stats[0].stats.min[0]),
            mkStat("max", stats[0].stats.max[0]),
            mkStat("mean", stats[0].stats.mean[0]),
            mkStat("median", stats[0].stats['25%'][0]),
            mkStat("datetime", stats[0].datetime)]);

          setItems2([
            mkStat("count", ""),
            mkStat("min", ""),
            mkStat("max", ""),
            mkStat("mean", ""),
            mkStat("median", ""),
            mkStat("datetime", "")]);
        }

        setSpinnerVisible("none")
      })
      .catch(err => {
        console.log("Axios err: ", err);
        setSpinnerVisible("none")
      })
      
    } else {
      console.log("no data");
      setItems([
        mkStat("count", ""),
        mkStat("min", ""),
        mkStat("max", ""),
        mkStat("mean", ""),
        mkStat("median", ""),
        mkStat("datetime", "")]);

      setItems2([
        mkStat("count", ""),
        mkStat("min", ""),
        mkStat("max", ""),
        mkStat("mean", ""),
        mkStat("median", ""),
        mkStat("datetime", "")]);
    }
  };

  const loadClick = () => {
    setpolygonSpinnerVisible("inline-block")
    //load additional GeoJSON file
    fetchGeoJsonData().then((value) => {
      setpolygonSpinnerVisible(value)
    });    
  };

/*
  const handleMessageChange = (event:any) => {
    console.log(event.target.value);
  };
*/

  const defaultWidth = 50;
  const columnWidths: Record<string, { min?: number; max?: number }> = {
    title: { min: 100, max: 300 },
    gsd: { max: 30 },
    roles: { max: 70 },
    stac_key: { max: 150 },
    "values": { max: 50 },
    "key": { max: 50 },
  };

  let columnKeys = ["key", "values"];

  const columns = columnKeys.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key]?.min || defaultWidth,
      maxWidth: columnWidths[key]?.max || undefined,
      fieldName: key,
      isResizable: false,
      isPadded: false,
      isMultiline: false,
    };
  });

  const style = {
    root: {
      fontSize: "12px",
      fontWeight: "700",
      paddingLeft: "45px",
      display: "inline-block",
      margin: "5px",
      textAlign: "center"
    },
  };

//<textarea value={message} onChange={handleMessageChange}/>
  return (
    <div className="hanapanel ms-Stack">
      <button className="btnAnalyze" onClick={handleClick}>analyze</button>
      <button className="btnLoad" onClick={loadClick}>load polygon</button>
      <Spinner className="polygonSpinner" size={SpinnerSize.xSmall} style={{display: polygonSpinner}}/>
      <div className="" style={{display:'flex', overflow: 'auto'}}>
        <div style={{ marginTop: 0, width: '50%', borderRight: '1px solid #cdcdcd', overflow: 'auto'}}>
          <Text styles={style}>
            Area 1 NDVI
          </Text>
          <Spinner size={SpinnerSize.xSmall} style={{display: visible}}/>
          <DetailsList
            items={items}
            compact={true}
            columns={columns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={false}
          />

      </div>
      <div style={{ marginTop: 0, width: '50%', borderRight: '1px solid #cdcdcd', overflow: 'auto'}}>
          <Text styles={style}>
            Area 2 NDVI
          </Text>
          <Spinner size={SpinnerSize.xSmall} style={{display: visible}}/>
          <DetailsList
            items={items2}
            compact={true}
            columns={columns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={false}
          />

      </div>
      </div>
    </div>
  );
};

export default InfoPanel;