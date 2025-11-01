import Animation from "./animation";

/**
 * Shape of Animations state
 */
export default interface AnimationsState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  animations: Array<Animation>;
  currentAnimation: Animation;
  networkStatus: string; // possible values: "online" | "offline"
}
