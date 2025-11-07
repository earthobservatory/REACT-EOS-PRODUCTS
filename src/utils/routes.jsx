import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Redirect component
const RedirectComponent = ({ newUrl }) => {
  useEffect(() => {
    window.location.href = newUrl;
  }, [newUrl]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Redirecting to our new site...</p>
    </div>
  );
};

// Leaflet redirect with dynamic parameter
const LeafletRedirect = () => {
  const { event_name } = useParams();

  useEffect(() => {
    window.location.href = `https://sf.earthobservatory.sg/event/${event_name}`;
  }, [event_name]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>Redirecting...</div>
  );
};

const RoutePaths = [
  {
    type: "route",
    name: "About Us",
    key: "aboutus",
    route: "/about-us",
    component: <RedirectComponent newUrl="https://sf.earthobservatory.sg" />,
  },

  {
    type: "route",
    name: "FAQ",
    key: "faq",
    route: "/faq",
    component: (
      <RedirectComponent newUrl="https://sf.earthobservatory.sg/faq" />
    ),
  },

  {
    type: "route",
    name: "Products Page",
    key: "products",
    route: "/",
    component: (
      <RedirectComponent newUrl="https://sf.earthobservatory.sg/products" />
    ),
  },

  {
    type: "dynamic route",
    name: "Leaflet Page",
    key: "leaflet",
    route: "/leaflet/:event_name",
    component: <LeafletRedirect />,
  },
  {
    type: "route",
    name: "Error 404",
    key: "error404",
    route: "*",
    component: <RedirectComponent newUrl="https://sf.earthobservatory.sg" />,
  },
];

// Keep these functions unchanged - they're still being used
export const getRoute = (key) => {
  return RoutePaths.find((element) => {
    return element.key === key;
  }).route;
};

export const getDynamicRoute = (key, data) => {
  return RoutePaths.find((element) => {
    return element.key === key && element.type === "dynamic route";
  }).route.replace(/:\S+/, data);
};

export default RoutePaths;
