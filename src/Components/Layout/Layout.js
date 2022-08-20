import React from "react";
import Header from "../Header/Header";

// Layout for the header and the children for the dashboard
const Layout = (props) => {
  return (
    <div>
      <Header {...props} />
      {props.children}
    </div>
  );
};

export default Layout;
