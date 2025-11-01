import { SNACKBAR_VARIANTS } from "../../data/constants";

export const getSnackbarVariant = (variant) => {
    return SNACKBAR_VARIANTS.includes(variant) ? variant : SNACKBAR_VARIANTS[0];
};
