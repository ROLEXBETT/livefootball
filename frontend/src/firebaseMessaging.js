import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";

const messaging = getMessaging(app);

export const requestNotificationPermission =
async () => {

  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Notifications blocked");
    return null;
  }

  const token = await getToken(
    messaging,
    {
      vapidKey: "BH3z-J77dwaPPsjrt2A0J6fR6bZoBnKLG00nrsyJZNl9GBd3C9_AkdQVGJHmabFPXMGNZ895Ye5o7UHM16LgTdM"
    }
  );

  console.log("FCM Token:", token);

  return token;
};
