import React, { useState, useEffect, useCallback } from "react";
import DrawerNavigator from "./DrawerNavigator";
import AuthStack from "./AuthStack";
import { useAuthContext } from "../context/authContext";

const Navigation = () => {
    const { isLoggedIn } = useAuthContext();
  return (
    <>
      {isLoggedIn ? <DrawerNavigator /> : <AuthStack />}
    </>
  );
};

export default Navigation;
