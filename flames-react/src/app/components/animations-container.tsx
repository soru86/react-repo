import { useEffect, useState } from "react";
import Animation from "../shapes/animation";
import ActionBar from "./action-bar";
import AnimationDetailedInfoModal from "./animation-detailed-info-modal";
import AnimationItem from "./animation-item";
import UploadAnimationModal from "./upload-animation-modal";
import { useDispatch } from "react-redux";
import { fetchAnimationById } from "../common/redux/reducers/animations-slice";
import { useSelector } from "react-redux";
import { RootState } from "../types/types";
import { ThunkDispatch } from "redux-thunk";
import AnimationsState from "../shapes/animations-state";
import { Action } from "@reduxjs/toolkit";

const currentAnimationSelector = (state: RootState) => {
  return state?.animations?.currentAnimation;
};

const AnimationsContainer = ({ animations }: { animations: Animation[] }) => {
  const dispatch = useDispatch<ThunkDispatch<AnimationsState, any, Action>>();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setshowViewModal] = useState(false);
  const [currentAnimationId, setCurrentAnimationId] = useState("");
  const animation = useSelector(currentAnimationSelector);

  useEffect(() => {
    if (currentAnimationId) {
      const fetchData = async () => {
        await dispatch(fetchAnimationById(currentAnimationId));
      };
      fetchData();
    }
  }, [currentAnimationId, dispatch]);

  return (
    <div className="bg-gray-200 h-dvh">
      <ActionBar setShowUploadModal={setShowUploadModal} />
      <ul className="p-4 grid gap-x-4 gap-y-12 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {animations.map((animation: Animation) => (
          <AnimationItem
            key={animation.id}
            animation={animation}
            setCurrentAnimationId={setCurrentAnimationId}
            setshowViewModal={setshowViewModal}
          />
        ))}
      </ul>
      <UploadAnimationModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      <AnimationDetailedInfoModal
        showViewModal={showViewModal}
        setshowViewModal={setshowViewModal}
        anim={animation}
      />
    </div>
  );
};

export default AnimationsContainer;
