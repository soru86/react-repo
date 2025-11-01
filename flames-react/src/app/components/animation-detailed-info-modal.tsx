import { IoClose } from "react-icons/io5";
import Animation from "../shapes/animation";

const AnimationDetailedInfoModal = ({
  showViewModal,
  setshowViewModal,
  anim,
}: {
  showViewModal: boolean;
  setshowViewModal: CallableFunction;
  anim: Animation;
}) => {
  const styleClasses: string = showViewModal
    ? "fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4"
    : "fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4";

  return (
    <>
      {showViewModal && anim ? (
        <div id="modalAnimationInfo" className={styleClasses}>
          <div className="relative pl-5 top-40 mx-auto shadow-xl rounded-md bg-gray-100 max-w-md">
            <div className="flex justify-end p-2">
              <button
                title="Close"
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setshowViewModal(false)}
              >
                <IoClose size={25} />
              </button>
            </div>

            <div className="p-6 pt-0 grid grid-row6 gap-6">
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  Title
                </label>
                <span>{anim.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  File Size
                </label>
                <span>{anim.fileSize}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  Description
                </label>
                <span>{anim.description}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  Dimension
                </label>
                <span>{anim.dimension}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  Duration
                </label>
                <span>{anim.duration}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  Frame Rate
                </label>
                <span>{anim.frameRate}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  # of Frames
                </label>
                <span>{anim.totalFrames}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="fileSize" className="font-bold">
                  # of Layers
                </label>
                <span>{anim.layers}</span>
              </div>
              <div>
                <button
                  onClick={() => setshowViewModal(false)}
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-1 text-center mr-2"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setshowViewModal(false)}
                  className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-1 text-center"
                  data-modal-toggle="delete-user-modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AnimationDetailedInfoModal;
