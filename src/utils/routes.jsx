import HomePage from "pages/Home/Home";
import LandingPage from "pages/Landing/Landing";
import Error404Page from "pages/Error/E404";
import LeafletPage from "pages/Leaflet/Leaflet";

const RoutePaths = [
  {
    type: "route",
    name: "Landing Page",
    key: "landing",
    route: "/",
    component: <LandingPage />,
  },

  {
    type: "route",
    name: "Home Page",
    key: "home",
    route: "/home",
    component: <HomePage />,
  },

  {
    type: "route",
    name: "Leaflet Page",
    key: "leaflet",
    route: "/leaflet",
    component: <LeafletPage />,
  },
  {
    type: "route",
    name: "Error 404",
    key: "error404",
    route: "*",
    component: <Error404Page />,
  },
];

export const getRoute = (key) => {
  return RoutePaths.find((element) => {
    return element.key === key;
  }).route;
};

export default RoutePaths;
