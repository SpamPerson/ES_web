import { createContext } from "react";
import { IAuthenticationContext } from "../types";

export const AutenticationContext = createContext<IAuthenticationContext>({});