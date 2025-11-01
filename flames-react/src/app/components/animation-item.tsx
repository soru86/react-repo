import Lottie from "react-lottie-player";
import Animation from "../shapes/animation";
import { jp } from "../utils/utils";
import { LuDownload } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";

const handleDownload = (jsonData: string) => {
  const fileName = `animation-${Date.now()}.json`;
  const contentType = "application/json;charset=utf-8;";
  const a = document.createElement("a");
  a.download = fileName;
  a.href = "data:" + contentType + "," + encodeURIComponent(jsonData);
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleClickViewInfo = (
  animationId: string,
  setCurrentAnimationId: CallableFunction,
  setshowViewModal: CallableFunction
) => {
  setshowViewModal(true);
  setCurrentAnimationId(animationId);
};

const AnimationItem = ({
  animation,
  setCurrentAnimationId,
  setshowViewModal,
}: {
  animation: Animation;
  setCurrentAnimationId: CallableFunction;
  setshowViewModal: CallableFunction;
}) => {
  return (
    <li
      key={animation.id}
      className="bg-gray-100 lg:basis-1/4 sm:basis-1/2 border-2 border-gray-300 rounded-xl max-w-64 max-h-64"
    >
      <Lottie
        loop
        animationData={jp(animation.definition)}
        play
        style={{ width: 256, height: 256 }}
      />
      <div className="flex flex-row space-x-4 pt-1 pb-4 justify-between">
        <label className="justify-self: start">{animation.title}</label>
        <div className="flex flex-row justify-items-end">
          <button
            type="button"
            title="Download Animation JSON"
            className="justify-self: end mr-5"
            onClick={() => handleDownload(animation.definition)}
          >
            <LuDownload size={25} className="text-gray-800 justify-self: end" />
          </button>
          <button
            type="button"
            title="View Animation Details"
            className="justify-self: end"
            onClick={() =>
              handleClickViewInfo(
                animation.id,
                setCurrentAnimationId,
                setshowViewModal
              )
            }
          >
            <IoMdInformationCircleOutline
              size={25}
              className="text-gray-800 justify-self: end"
            />
          </button>
        </div>
      </div>
    </li>
  );
};

export default AnimationItem;
