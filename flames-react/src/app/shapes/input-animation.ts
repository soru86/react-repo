/**
 * Shape of input animation, this to keep consistent with mutation input type.
 */

type InputAnimation = {
  title: string;
  definition: string;
  description: string;
  dimension: string;
  frameRate: number;
  duration: number;
  layers: number;
  totalFrames: number;
  fileSize: string;
};

export default InputAnimation;
