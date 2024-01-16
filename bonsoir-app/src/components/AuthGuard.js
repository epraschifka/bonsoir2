import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom';
import React from "react";

export const AuthGuard = ({ component }) => {
  const { convoID } = useParams();
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
      </div>
    ),
  });

  return <Component convoID={convoID}/>;
};