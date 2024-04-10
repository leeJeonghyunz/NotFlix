import { atom } from "recoil";

interface IkeywordState {
  keyState: string;
}

export const keywordState = atom({
  key: "keyword",
  default: "",
});
