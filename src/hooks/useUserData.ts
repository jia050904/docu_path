import {useCallback,useMemo,useSyncExternalStore} from 'react';
import {useAuth} from './useAuth';
import {guestRecentKey,userStorageKey} from '../lib/storage';

const listeners=new Set<()=>void>();
const subscribe=(listener:()=>void)=>{listeners.add(listener);return()=>listeners.delete(listener)};
const notify=()=>listeners.forEach(listener=>listener());
if(typeof window!=='undefined')window.addEventListener('storage',notify);

export function useUserData<T>(key:string,fallback:T){
  const {email}=useAuth();
  const storageKey=email?userStorageKey(email,key):key==='recent'?guestRecentKey:`seoryugil:guest:${key}`;
  const getSnapshot=useCallback(()=>localStorage.getItem(storageKey)||'',[storageKey]);
  const raw=useSyncExternalStore(subscribe,getSnapshot,()=> '');
  const value=useMemo(()=>{try{return raw?JSON.parse(raw) as T:fallback}catch{return fallback}},[raw,fallback]);
  const setValue=useCallback((next:T|((old:T)=>T))=>{
    let old=fallback;
    try{const saved=localStorage.getItem(storageKey);if(saved)old=JSON.parse(saved) as T}catch{old=fallback}
    const value=typeof next==='function'?(next as (previous:T)=>T)(old):next;
    localStorage.setItem(storageKey,JSON.stringify(value));
    notify();
  },[fallback,storageKey]);
  return [value,setValue] as const;
}
