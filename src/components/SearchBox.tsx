import {Search} from 'lucide-react';
import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {track} from '../lib/analytics';
import {searchProcedures,suggestions} from '../lib/search';
import {useUserData} from '../hooks/useUserData';

export function SearchBox({hero=false,initial=''}:{hero?:boolean;initial?:string}){
  const [query,setQuery]=useState(initial);
  const [active,setActive]=useState(-1);
  const [open,setOpen]=useState(false);
  const list=suggestions(query);
  const nav=useNavigate();
  const [,setRecent]=useUserData<string[]>('recent',[]);
  const wrap=useRef<HTMLDivElement>(null);

  useEffect(()=>{const close=(event:MouseEvent)=>{if(!wrap.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[]);

  const submit=(value=query)=>{
    const normalized=value.trim();
    if(!normalized)return;
    const found=searchProcedures(normalized);
    const categories=[...new Set(found.map(item=>item.category))].join(',')||'none';
    const eventData={result_count:found.length,has_results:found.length>0,category:categories};
    setRecent(old=>[normalized,...old.filter(item=>item!==normalized)].slice(0,5));
    track('search',eventData);
    track('search_submit',eventData);
    setOpen(false);
    nav(`/search?q=${encodeURIComponent(normalized)}`);
  };

  const selectSuggestion=(value:string)=>{
    const service=searchProcedures(value)[0];
    const suggestionType=service?.aliases.includes(value)?'similar_term':'autocomplete';
    track('search_suggestion_click',{suggestion_type:suggestionType,service_id:service?.id||'none',category:service?.category||'none'});
    setQuery(value);
    submit(value);
  };

  const key=(event:KeyboardEvent<HTMLInputElement>)=>{
    if(!open||!list.length)return;
    if(event.key==='ArrowDown'){event.preventDefault();setActive(index=>(index+1)%list.length)}
    if(event.key==='ArrowUp'){event.preventDefault();setActive(index=>(index-1+list.length)%list.length)}
    if(event.key==='Enter'&&active>=0){event.preventDefault();selectSuggestion(list[active])}
    if(event.key==='Escape')setOpen(false);
  };

  return <div className={hero?'search-wrap hero-search':'search-wrap'} ref={wrap}>
    <form className="search-form" onSubmit={(event:FormEvent)=>{event.preventDefault();submit()}}>
      <label className="sr-only" htmlFor={hero?'hero-query':'search-query'}>행정업무 검색</label>
      <Search className="search-icon" aria-hidden/>
      <input id={hero?'hero-query':'search-query'} value={query} onChange={event=>{setQuery(event.target.value);setOpen(true);setActive(-1)}} onFocus={()=>setOpen(true)} onKeyDown={key} placeholder="예: 자취, 알바, 장학금, 증명서" autoComplete="off" role="combobox" aria-expanded={open&&!!list.length} aria-controls="search-suggestions"/>
      <button type="submit">검색</button>
    </form>
    {open&&list.length>0&&<ul id="search-suggestions" className="suggestions" role="listbox">{list.map((value,index)=><li key={value}><button type="button" className={index===active?'active':''} onMouseDown={event=>event.preventDefault()} onClick={()=>selectSuggestion(value)} role="option" aria-selected={index===active}><Search size={16}/>{value}</button></li>)}</ul>}
  </div>;
}
