export const DEMO_EMAIL='demo@seoryugil.kr';
export const userStorageKey=(email:string,key:string)=>`seoryugil:${email}:${key}`;
export type Checks=Record<string,string[]>;
export function loadJSON<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}}
export function userData<T>(email:string,key:string,fallback:T){return loadJSON(userStorageKey(email,key),fallback)}
export function saveUserData<T>(email:string,key:string,value:T){localStorage.setItem(userStorageKey(email,key),JSON.stringify(value))}
export const authKey='seoryugil:auth';
export const guestRecentKey='seoryugil:guest:recent';
