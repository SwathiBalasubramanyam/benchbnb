import React from "react";
import { Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import SignUpFormPage from "./components/SignUpFormPage";
import HomePage from "./components/HomePage";
import LoginFormPage from "./components/LoginFormModal";

function App() {
  return (
    <>
      <Navigation />
        <Switch>
          <Route path="/signup">
            <SignUpFormPage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
    </>
  );
}

export default App;