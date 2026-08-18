declare global{interface Window{dataLayer:unknown[];gtag:(...args:unknown[])=>void}}
const id=import.meta.env.VITE_GA_MEASUREMENT_ID as string|undefined;
export function initAnalytics(){if(!id)return;window.dataLayer=window.dataLayer||[];window.gtag=function(...args:unknown[]){window.dataLayer.push(args)};window.gtag('js',new Date());window.gtag('config',id,{send_page_view:false});const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;document.head.appendChild(s)}
export function pageView(path:string){if(id&&window.gtag)window.gtag('event','page_view',{page_path:path})}
export function track(name:string,params:Record<string,string|number|boolean>={}){if(id&&window.gtag)window.gtag('event',name,params)}
