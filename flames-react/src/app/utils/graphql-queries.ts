// import * as clientCore from "@apollo/client/core/core.cjs";
// const { gql } = clientCore;

import { gql } from "@apollo/client";

const getAllAnimationsQuery = gql`
  query getAllAnimations {
    getAllAnimations {
      id
      title
      definition
      createdAt
    }
  }
`;

const getAnimationByIdQuery = gql`
  query getAnimationById($animationId: String!) {
    getAnimationById(animationId: $animationId) {
      id
      title
      description
      dimension
      frameRate
      duration
      layers
      totalFrames
      fileSize
    }
  }
`;

const getAnimationsByTitleQuery = gql`
  query getAnimationsByTitle($title: String!) {
    getAnimationsByTitle(title: $title) {
      id
      title
      definition
      createdAt
    }
  }
`;

const addNewAnimationMutation = gql`
  mutation addAnimation($animation: InputAnimation!) {
    addAnimation(animation: $animation) {
      id
      title
      definition
      description
      dimension
      frameRate
      duration
      layers
      totalFrames
      fileSize
      createdAt
      updatedAt
    }
  }
`;

const syncAnimationsMutation = gql`
  mutation syncAnimations($animations: [InputAnimation]!) {
    syncAnimations(animations: $animations) {
      id
      title
      definition
      description
      dimension
      frameRate
      duration
      layers
      totalFrames
      fileSize
      createdAt
      updatedAt
    }
  }
`;

export {
  getAllAnimationsQuery,
  getAnimationByIdQuery,
  getAnimationsByTitleQuery,
  addNewAnimationMutation,
  syncAnimationsMutation,
};
