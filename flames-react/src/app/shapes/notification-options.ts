export default interface NotificationOptions {
  body: string | "Notification body";
  badge?: string;
  icon?: string;
  image?: string;
  silent: boolean | false;
}
