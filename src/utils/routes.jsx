import ProductsPage from "pages/Products/Products";
import Error404Page from "pages/Error/E404";
import LeafletPage from "pages/Leaflet/Leaflet";
import AboutUsPage from "pages/AboutUs/AboutUs";
import FAQPage from "pages/FAQ/FAQ";

const RoutePaths = [
  // {
  //   type: "route",
  //   name: "Landing Page",
  //   key: "landing",
  //   route: "/",
  //   component: <LandingPage />,
  // },

  {
    type: "route",
    name: "About Us",
    key: "aboutus",
    route: "/about-us",
    component: <AboutUsPage />,
  },

  {
    type: "route",
    name: "FAQ",
    key: "faq",
    route: "/faq",
    component: <FAQPage />,
  },

  {
    type: "route",
    name: "Products Page",
    key: "products",
    route: "/",
    component: <ProductsPage />,
  },

  {
    type: "dynamic route",
    name: "Leaflet Page",
    key: "leaflet",
    route: "/leaflet/:event_name",
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

export const getDynamicRoute = (key, data) => {
  return RoutePaths.find((element) => {
    return element.key === key && element.type === "dynamic route";
  }).route.replace(/:\S+/, data);
};

export default RoutePaths;
