import Animation from "./animation";

/**
 * the shape for offline animation model.
 */

export default interface OfflineAnimationsState {
  error: string | undefined;
  offlineAnimations: Array<Animation>;
  syncStatus: "pending" | "in-progress" | "completed" | "failed";
}
