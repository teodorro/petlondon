import { create } from "zustand";
import { createSelectors } from "../utils/create-selectors";

interface IErrorStore {
  message: string;
  error: unknown;
  isErrorHappened: boolean;
  setError: (msg: string, err: unknown) => void;
  setErrorHappened: (happened: boolean) => void;
}

const useErrorStoreBase = create<IErrorStore>((set) => ({
  message: "",
  error: null,
  isErrorHappened: false,
  setError: (msg, err) =>
    set(() => ({
      message: msg,
      error: err,
    })),
  setErrorHappened: (happened: boolean) =>
    set(() => ({
      isErrorHappened: happened,
    })),
}));

export const useErrorStore = createSelectors(useErrorStoreBase);
