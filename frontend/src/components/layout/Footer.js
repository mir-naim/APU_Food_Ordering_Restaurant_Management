import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="py-1"
      style={{
        width: "80%",  // Set your desired width (e.g., 80%)
        margin: "20px auto",  // Add margin to create space above
        textAlign: "center", // Center the content
      }}
      >
        <p className="text-center mt-1">
          Developed By Mir Naimur Rahman - ©APU Cafe 2024. All Rights Reserved
        </p>
      </footer>
    </Fragment>
  );
};

export default Footer;
