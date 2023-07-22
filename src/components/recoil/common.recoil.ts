import { atom } from "recoil";

export const isPenalOpenState = atom<boolean>({
    key:'isPenalOpenState',
    default: false
})