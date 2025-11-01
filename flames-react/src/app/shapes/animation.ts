/**
 * Shape for Animation model.
 */

export default interface Animation {
  id: string;
  title: string;
  definition: string;
  description: string;
  dimension: string;
  frameRate: number; // in FPS
  duration: number; // in seconds
  layers: number;
  totalFrames: number;
  fileSize: string;
  createdAt?: Date;
  updatedAt?: Date;
}
