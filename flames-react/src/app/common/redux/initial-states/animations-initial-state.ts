import Animation from "../../../shapes/animation";
import AnimationsState from "../../../shapes/animations-state";

export const animationsInitialState: AnimationsState = {
  status: "idle",
  error: undefined,
  animations: [],
  currentAnimation: {
    id: "",
    title: "",
    definition: "",
    description: "",
    dimension: "",
    frameRate: 0,
    duration: 0,
    layers: 0,
    totalFrames: 0,
    fileSize: "",
  } as Animation,
  networkStatus: "online",
};
