import {
	h,
	useState,
	useEffect,
	useContext,
	createContext
} from "@atomico/core";

import base from "./base";

export let { Provider, Consumer, useStore } = base(
	h,
	useState,
	useEffect,
	useContext,
	createContext
);
