import { type  TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

// Typed version of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;