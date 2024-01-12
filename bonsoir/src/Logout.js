import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  console.log(`window.location.origin = ${window.location.origin + '/login'}`);

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: (window.location.origin + '/login') } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;