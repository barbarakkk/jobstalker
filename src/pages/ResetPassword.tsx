import React from "react";

const ResetPassword = () => {
  // Always print the hash
  console.log("HASH:", window.location.hash);

  // Always show the hash on the page
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      <div>DEBUG: {window.location.hash}</div>
      <div style={{ color: "red", marginTop: 20 }}>
        {window.location.hash
          ? "Hash is present! If you see this, the component is rendering."
          : "No hash present."}
      </div>
    </div>
  );
};

export default ResetPassword;
