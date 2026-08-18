import {useNavigate} from 'react-router-dom';
import {useUserData} from '../hooks/useUserData';
import {searchProcedures} from '../lib/search';
import {track} from '../lib/analytics';

export function SuggestedKeywords(){
  const nav=useNavigate();
  const [,setRecent]=useUserData<string[]>('recent',[]);
  const select=(keyword:string)=>{
    const results=searchProcedures(keyword);
    const service=results[0];
    const category=[...new Set(results.map(item=>item.category))].join(',')||'none';
    track('search_suggestion_click',{suggestion_type:'recommended_keyword',service_id:service?.id||'none',category:service?.category||'none'});
    track('search',{result_count:results.length,has_results:results.length>0,category});
    setRecent(old=>[keyword,...old.filter(item=>item!==keyword)].slice(0,5));
    nav(`/search?q=${encodeURIComponent(keyword)}`);
  };
  return <div className="keyword-row" aria-label="추천 검색어">{['월세 지원','전월세 신고','3.3','근로장려금'].map(keyword=><button key={keyword} onClick={()=>select(keyword)}>{keyword}</button>)}</div>;
}
