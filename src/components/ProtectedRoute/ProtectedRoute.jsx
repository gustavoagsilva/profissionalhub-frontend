import { Redirect, Route } from "react-router-dom";
export default function ProtectedRoute({ user, children, ...props }) {
  return (
    <Route
      {...props}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { openLogin: true, from: location.pathname },
            }}
          />
        )
      }
    />
  );
}
