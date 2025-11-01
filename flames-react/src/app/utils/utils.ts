import Animation from "../shapes/animation";

const jp = (jsonString: string) => {
  return JSON.parse(jsonString);
};

const js = (jsonObj: any) => {
  return JSON.stringify(jsonObj);
};

const emptyAnimation = (): Animation => {
  return {
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
  };
};

const isConnectionAlive = async () => {
  const SERVER_URL = "https://www.google.com";
  const response = await fetch(SERVER_URL, { method: "HEAD", mode: "no-cors" });
  return response?.ok || response?.type === "opaque";
};

export { jp, js, emptyAnimation, isConnectionAlive };
