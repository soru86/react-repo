import React, { ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import FormField from "./form-field";
import InputAnimation from "../shapes/input-animation";
import { useDispatch } from "react-redux";
import { addAnimation } from "../common/redux/reducers/animations-slice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { addOfflineAnimation } from "../common/redux/reducers/resilient-sync-slice";
import { RootState } from "../types/types";
import OfflineAnimationsState from "../shapes/offline-animations-state";
import AnimationsState from "../shapes/animations-state";
import { toast } from "react-toastify";

const getFileSizeInKB = (fileSize: number) => {
  return `${fileSize ? (fileSize * 0.001).toFixed(1) : 0} KB`;
};

const closeModal = (
  setShowUploadModal: CallableFunction,
  setFile: CallableFunction,
  setFileSize: CallableFunction
) => {
  setFile("");
  setFileSize(0);
  setShowUploadModal(false);
};

let fileReader: FileReader;

const handleFileRead = (
  setFile: CallableFunction,
  setFormData: CallableFunction
) => {
  const content = fileReader.result;
  setFile(content);
  setFormData((formData: InputAnimation) => ({
    ...formData,
    definition: content,
  }));
};

const handleFileChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFile: CallableFunction,
  setFileSize: CallableFunction,
  setFormData: CallableFunction
) => {
  const file = e?.target?.files![0];
  setFileSize(file.size);
  fileReader = new FileReader();
  fileReader.onloadend = () => handleFileRead(setFile, setFormData);
  fileReader.readAsText(file);
  setFormData((formData: InputAnimation) => ({
    ...formData,
    fileSize: getFileSizeInKB(file.size),
  }));
};

const handleFieldChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFormData: CallableFunction
) => {
  setFormData((formData: InputAnimation) => ({
    ...formData,
    [e.target.name]: e.target.value,
  }));
};

const handleFormSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  formData: InputAnimation,
  setShowUploadModal: CallableFunction,
  dispatch: ThunkDispatch<
    AnimationsState | OfflineAnimationsState,
    any,
    Action
  >,
  networkStatus: string
) => {
  event.preventDefault();
  const {
    title,
    definition,
    fileSize,
    description,
    dimension,
    frameRate,
    duration,
    layers,
    totalFrames,
  } = formData;

  if (!definition) {
    toast(
      "No JSON file selected. Please select the animation file and try again.",
      { type: "error" }
    );
  }

  const fields: InputAnimation = {
    title,
    definition,
    description,
    dimension,
    frameRate: +frameRate,
    duration: +duration,
    layers: +layers,
    totalFrames: +totalFrames,
    fileSize,
  };

  let saveSuccessul = false;
  if (networkStatus === "online") {
    const dbAnimation = await dispatch(addAnimation(fields));
    saveSuccessul = !!dbAnimation;
  } else {
    dispatch(addOfflineAnimation(fields));
    saveSuccessul = true;
  }

  if (saveSuccessul) {
    setShowUploadModal(false);
  } else {
    setShowUploadModal(true);
  }
};

const networkStatusSelector = (state: RootState) =>
  state?.animations?.networkStatus;

const UploadAnimationModal = ({
  showUploadModal,
  setShowUploadModal,
}: {
  showUploadModal: boolean;
  setShowUploadModal: CallableFunction;
}) => {
  const dispatch =
    useDispatch<
      ThunkDispatch<AnimationsState | OfflineAnimationsState, any, Action>
    >();
  const [file, setFile] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [formData, setFormData] = useState({} as InputAnimation);
  const networkStatus = useSelector(networkStatusSelector);

  const styleClasses: string = showUploadModal
    ? "fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4"
    : "fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4";

  return (
    <>
      {showUploadModal ? (
        <div id="modalUpload" className={styleClasses}>
          <div className="relative top-40 mx-auto shadow-xl rounded-md bg-gray-100 max-w-md">
            <div className="flex justify-end p-2">
              <button
                title="Close"
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() =>
                  closeModal(setShowUploadModal, setFile, setFileSize)
                }
              >
                <IoClose size={25} />
              </button>
            </div>

            <form
              onSubmit={(e) =>
                handleFormSubmit(
                  e,
                  formData,
                  setShowUploadModal,
                  dispatch,
                  networkStatus
                )
              }
            >
              <div className="p-6 pt-0 grid grid-row6 gap-6">
                <div>
                  <input
                    title="Select animation JSON file"
                    type="file"
                    accept=".json"
                    onChange={(e) =>
                      handleFileChange(e, setFile, setFileSize, setFormData)
                    }
                  />
                  <input
                    title="JSON definition"
                    type="text"
                    name="definition"
                    id="definition"
                    className="hidden"
                    readOnly
                    value={file}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <label htmlFor="fileSize" className="font-bold">
                    File Size
                  </label>
                  <input
                    title="File size"
                    type="text"
                    name="fileSize"
                    id="fileSize"
                    readOnly
                    className="col-span-3"
                    value={getFileSizeInKB(fileSize)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField
                    fieldLabel="Title"
                    fieldName="title"
                    multiSpan={true}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField
                    fieldLabel="Description"
                    fieldName="description"
                    multiSpan={true}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField
                    fieldLabel="Dimension"
                    fieldName="dimension"
                    multiSpan={true}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField
                    fieldLabel="Duration"
                    fieldName="duration"
                    multiSpan={false}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                  <FormField
                    fieldLabel="Frame Rate"
                    fieldName="frameRate"
                    multiSpan={false}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField
                    fieldLabel="# of Frames"
                    fieldName="totalFrames"
                    multiSpan={false}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                  <FormField
                    fieldLabel="# of Layers"
                    fieldName="layers"
                    multiSpan={false}
                    onChangeHandler={(e) => handleFieldChange(e, setFormData)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="text-white bg-gray-800 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-1 text-center mr-2"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      closeModal(setShowUploadModal, setFile, setFileSize)
                    }
                    className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-1 text-center"
                    data-modal-toggle="delete-user-modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UploadAnimationModal;
