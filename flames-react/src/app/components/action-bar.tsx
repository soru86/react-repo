import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import InputSearch from "../shapes/input-search";
import {
  fetchAnimations,
  searchAnimations,
} from "../common/redux/reducers/animations-slice";
import { useDispatch } from "react-redux";
import {
  Action,
  Dispatch,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { AppDispatch } from "../types/types";
import AnimationsState from "../shapes/animations-state";

const handleFieldChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: CallableFunction
) => {
  setFormData((formData: InputSearch) => ({
    ...formData,
    [e.target.name]: e.target.value,
  }));
};

const handleFormSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  formData: InputSearch,
  dispatch: ThunkDispatch<AnimationsState, any, Action>
) => {
  event.preventDefault();
  if (formData?.search.length) {
    await dispatch(searchAnimations(formData));
  } else {
    await dispatch(fetchAnimations());
  }
};

const handleKeyDown = async (
  event: React.KeyboardEvent,
  formData: InputSearch,
  dispatch: Dispatch<UnknownAction>
) => {
  const key = event.key;
  if (key === "Enter") {
    await handleFormSubmit(
      event as unknown as React.FormEvent<HTMLFormElement>,
      formData,
      dispatch
    );
  }
};

const ActionBar = ({
  setShowUploadModal,
}: {
  setShowUploadModal: CallableFunction;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({} as InputSearch);

  return (
    <div className="bg-gray-200 w-full p-4 flex items-stretch space-x-4">
      <form
        className="bg-gray-200 w-full flex items-stretch space-x-4"
        onSubmit={(e) => handleFormSubmit(e, formData, dispatch)}
      >
        <input
          type="text"
          title="Search Animations"
          placeholder="Enter search term"
          name="search"
          id="search"
          className="pl-2 w-full h-8 rounded pb-0.5"
          onKeyDown={(e) => handleKeyDown(e, formData, dispatch)}
          onChange={(e) => handleFieldChange(e, setFormData)}
        />
        <button type="submit" title="Search Animation">
          <IoSearch
            size={25}
            className="text-gray-800 mt-1 hover:cursor-pointer"
          />
        </button>
      </form>
      <button
        type="button"
        title="Create New Animation"
        className="bg-gray-800 hover:bg-gray-600 text-white pt-0.5 px-4 rounded"
        onClick={() => setShowUploadModal(true)}
      >
        New
      </button>
    </div>
  );
};

export default ActionBar;
