import {Outlet,useLocation} from 'react-router-dom';import {useEffect} from 'react';import {Header} from './Header';import {Footer} from './Footer';import {pageView} from '../lib/analytics';
export function Layout(){const loc=useLocation();useEffect(()=>{window.scrollTo(0,0);pageView(loc.pathname+loc.search)},[loc]);return <><Header/><main><Outlet/></main><Footer/></>}
