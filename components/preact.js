import { createElement, createContext } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import base from "./base";

export let { Provider, Consumer, useStore } = base(
	createElement,
	useState,
	useEffect,
	useContext,
	createContext
);
