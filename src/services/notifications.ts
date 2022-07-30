import { atom } from "recoil";

type Severity = "info" | "success" | "warning" | "error";
interface INotification {
  text: string;
  severity: Severity;
}

export const notificationState = atom({
  key: "Notification",
  default: { text: "", severity: "info" } as INotification,
});
