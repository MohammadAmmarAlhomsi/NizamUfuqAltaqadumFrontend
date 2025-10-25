import { writable } from "svelte/store";

export const studentRefresh = writable(0)

export function triggerStudentRefresh() {
    studentRefresh.update(n => n + 1);
}