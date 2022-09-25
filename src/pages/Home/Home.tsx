import { Text } from "@fluentui/react";

import Layout from "components/Layout";
import SEO from "components/Seo";
import Resource from "./components/Resource";
import BannerFooter from "./components/BannerFooter";

export const Home = () => {
  const banner = (
    <div
      className="hero"
      style={{
        background: "url(./images/planet-sunrise-wide@1.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "650px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    > 
      <div className="grid-content">
        <a href="/explore?c=138.9781%2C37.0736&z=9.69&v=2&d=sentinel-2-l2a&m=Most+recent+%28low+cloud%29&r=Natural+color&s=false%3A%3A100%3A%3Atrue&ae=0">
          <img alt="link" style={{width:'800px', height:'100%', backgroundColor: 'white'}} src="./images/hackathon_logo.svg"></img>
        </a>

      </div>
    </div>
  );

  return (
    <Layout bannerHeader={banner} bannerFooter={<BannerFooter />}>
      <SEO title="Home" />
      <div
        className="grid-content"
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          marginTop: "80px",
        }}
      >
        <Text
          block
          variant="xxLarge"
          style={{ textAlign: "center", maxWidth: "550px" }}
        >
          Supporting sustainability decision-making with the power of the cloud
        </Text>
        <Text
          block
          variant="large"
          style={{ margin: "1.8rem 0", textAlign: "center", maxWidth: "815px" }}
        >
          The Planetary Computer combines a multi-petabyte catalog of global
          environmental data with intuitive APIs, a flexible scientific environment
          that allows users to answer global questions about that data, and
          applications that put those answers in the hands of conservation
          stakeholders.
        </Text>
      </div>
      <div className="home-resources layout-container">
        <div className="layout-row grid-content">
          <Resource title="Data Catalog" iconName="ExploreData" href="/catalog">
            The Planetary Computer includes petabytes of environmental monitoring
            data, in consistent, analysis-ready formats, accessible through our APIs
            as well as directly available via Azure Storage.
          </Resource>
          <Resource title="API" iconName="Code" href="/docs">
            The Planetary Computer API makes it easy for users to find exactly the
            data they need, simplifying search and discovery across our Data Catalog.
          </Resource>
          <Resource external title="Hub" iconName="TableComputed" href="/compute">
            The Planetary Computer Hub is a development environment that makes our
            data and APIs accessible through familiar, open-source tools, and allows
            users to easily scale their analyses.
          </Resource>
          <Resource
            title="Applications"
            iconName="WebAppBuilderFragmentCreate"
            href="/applications"
          >
            Partners all over the world are building on top of the Planetary Computer
            platform, providing the actionable information that is critical to
            sustainability practitioners.
          </Resource>
        </div>
      </div>
    </Layout>
  );
};
