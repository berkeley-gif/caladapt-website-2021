import { writable } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";

export const categoryListStore = writable(null);
export const indicatorListStore = writable(null);
export const indicatorStore = writable(null);
