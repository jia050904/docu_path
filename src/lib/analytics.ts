declare global{interface Window{dataLayer:unknown[];gtag:(...args:unknown[])=>void}}

export const GA_MEASUREMENT_ID='G-TGSDGEZE45';
let initialized=false;
let lastPagePath='';

export function initAnalytics(){
  if(initialized||typeof window==='undefined')return;
  initialized=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){
    // Google의 공식 gtag 스니펫과 동일하게 arguments 객체를 큐에 넣습니다.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  const initialPath=window.location.pathname+window.location.search;
  lastPagePath=initialPath;
  const script=document.createElement('script');
  script.async=true;
  script.src=`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.gtag('js',new Date());
  window.gtag('config',GA_MEASUREMENT_ID,{
    page_path:initialPath,
    page_location:window.location.href,
    page_title:document.title,
  });
}

export function pageView(path:string){
  if(!window.gtag||path===lastPagePath)return;
  lastPagePath=path;
  window.gtag('event','page_view',{
    page_path:path,
    page_location:`${window.location.origin}${path}`,
    page_title:document.title,
  });
}

export function track(name:string,params:Record<string,string|number|boolean>={}){
  if(window.gtag)window.gtag('event',name,params);
}
