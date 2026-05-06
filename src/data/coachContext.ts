import { mockStaff } from "./mockStaff";

// The signed-in coach (demo: Faris Al-Mutairi presented as "Ahmed Coach")
export const COACH_ID = "st-001";
export const COACH_DISPLAY_NAME = "Ahmed Coach";

export function getCoach() {
  return mockStaff.find((s) => s.id === COACH_ID)!;
}
