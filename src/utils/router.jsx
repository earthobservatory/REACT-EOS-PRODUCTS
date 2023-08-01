//Entry point for the webpack and deals with the routes
import React from "react";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import RoutePaths from "utils/routes";

const WebRoute = () => {
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      return (
        <Route path={route.route} element={route.component} key={route.key} />
      );
    });

  return (
    <Router basename="/REACT-EOS-PRODUCTS">
      <Routes>
        {getRoutes(RoutePaths)}
        {/* <Route path="*" element={<Navigate to={getRoute("home")} />} /> */}
      </Routes>
    </Router>
  );
};

export default WebRoute;
