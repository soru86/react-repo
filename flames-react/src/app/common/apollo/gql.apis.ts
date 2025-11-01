import { apolloClient } from "./apollo.client";
import InputAnimation from "../../shapes/input-animation";
import {
  addNewAnimationMutation,
  getAllAnimationsQuery,
  getAnimationByIdQuery,
  getAnimationsByTitleQuery,
  syncAnimationsMutation,
} from "../../utils/graphql-queries";

const queryAllAnimations = async () => {
  const animations = await apolloClient.query({
    query: getAllAnimationsQuery,
  });
  return animations?.data?.getAllAnimations;
};

const queryAnimationById = async (animationId: string) => {
  const animation = await apolloClient.query({
    query: getAnimationByIdQuery,
    variables: {
      animationId: animationId,
    },
  });
  return animation?.data?.getAnimationById;
};

const queryAnimationsByTitle = async (title: string) => {
  const animations = await apolloClient.query({
    query: getAnimationsByTitleQuery,
    variables: {
      title: title,
    },
  });
  return animations?.data?.getAnimationsByTitle;
};

const createAnimation = async (animation: InputAnimation) => {
  const dbAnimation = await apolloClient.mutate({
    mutation: addNewAnimationMutation,
    variables: {
      animation: animation,
    },
  });
  return dbAnimation;
};

const syncAnimations = async (animations: Array<InputAnimation>) => {
  const dbAnimation = await apolloClient.mutate({
    mutation: syncAnimationsMutation,
    variables: {
      animations: animations,
    },
  });
  return dbAnimation;
};

export {
  queryAllAnimations,
  queryAnimationById,
  createAnimation,
  queryAnimationsByTitle,
  syncAnimations,
};
