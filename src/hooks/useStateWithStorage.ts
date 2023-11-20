import {Dispatch, SetStateAction, useEffect, useState} from "react";

export const useStateWithStorage = <T>(initialState: T, key: string): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (!('window' in globalThis)) return
    const savedState = window.localStorage.getItem(key)
    if (savedState != null) {
      setState(JSON.parse(savedState))
    }
  }, [key]);

  useEffect(() => {
    if (!('window' in globalThis) || JSON.stringify(initialState) === JSON.stringify(state)) return
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [initialState, key, state]);

  return [state, setState];

}
