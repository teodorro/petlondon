import { create } from "zustand";

interface IErrorStore {
  message: string;
  error: unknown;
  isErrorHappened: boolean;
  setError: (msg: string, err: unknown) => void;
  setErrorHappened: (happened: boolean) => void;
}

const useErrorStore = create<IErrorStore>((set) => ({
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

export default useErrorStore;
