import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const EditState = atom({
  key: "EditmodalState",
  default: false,
});

export const DeleteState = atom({
  key: "DeletemodalState",
  default: false,
});
export const SearchState = atom({
  key: "SearchmodalState",
  default: false,
});
