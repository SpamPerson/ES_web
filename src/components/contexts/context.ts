import { createContext } from "react";
import { IAuthenticationContext } from "../types";

export const AuthenticationContext = createContext<IAuthenticationContext>({});