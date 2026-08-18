import {ExternalLink,ChevronDown} from 'lucide-react';
import {useEffect,useRef} from 'react';
import type {Procedure,RequiredDocument} from '../types/procedure';
import {ProgressBar} from './ProgressBar';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';
import {track} from '../lib/analytics';
import {procedureProgress} from '../lib/progress';

const fallbackLabel:Record<RequiredDocument['documentType'],string>={online_issue:'온라인 발급',official_template:'양식 찾기',online_form:'온라인에서 작성',user_prepared:'준비 방법',institution_issued:'발급처 확인',existing_document:'준비 방법'};
const hasUsefulAction=(document:RequiredDocument)=>Boolean(document.actionUrl)&&document.documentType!=='existing_document'&&document.documentType!=='user_prepared';

export function DocumentChecklist({procedure,answers}:{procedure:Procedure;answers:Record<string,string>}){
  const {email}=useAuth();
  const [checks,setChecks]=useUserData<Checks>('checks',{});
  const [stepChecks]=useUserData<Checks>('stepChecks',{});
  const [,setUpdated]=useUserData<Record<string,number>>('checkUpdated',{});
  const selected=checks[procedure.id]||[];
  const documents=procedure.requiredDocuments.filter(document=>!document.condition||document.condition.values.includes(answers[document.condition.questionId]));
  const progress=procedureProgress(procedure,checks,stepChecks,answers);
  const completionState=useRef({procedureId:procedure.id,complete:progress.complete});
  useEffect(()=>{
    const previous=completionState.current;
    if(previous.procedureId===procedure.id&&progress.complete&&!previous.complete)track('service_complete',{procedure_id:procedure.id,category:procedure.category,total_items:progress.totalCount});
    completionState.current={procedureId:procedure.id,complete:progress.complete};
  },[procedure.category,procedure.id,progress.complete,progress.totalCount]);
  const toggle=(id:string)=>{if(!email){alert('체크리스트 저장은 Demo 로그인 후 이용할 수 있어요.');return}const checked=!selected.includes(id);setChecks(old=>({...old,[procedure.id]:checked?[...(old[procedure.id]||[]),id]:(old[procedure.id]||[]).filter(item=>item!==id)}));setUpdated(old=>({...old,[procedure.id]:Date.now()}));track('document_check',{procedure_id:procedure.id,document_id:id,checked})};
  return <section className="detail-section">
    <div className="section-heading"><div><p className="eyebrow">준비물 체크리스트</p><h2>필요한 서류</h2></div></div>
    <ProgressBar done={progress.completedCount} total={progress.totalCount}/>
    {documents.length?<div className="document-cards">{documents.map(document=><details className={selected.includes(document.id)?'document-card checked':'document-card'} key={document.id}>
      <summary><label onClick={event=>event.stopPropagation()}><input type="checkbox" checked={selected.includes(document.id)} onChange={()=>toggle(document.id)}/><span><strong>{document.name}</strong><small>{document.required?'필수':'해당자만'} · {document.issuer}</small></span></label><span className="document-summary-action">{document.actionLabel||fallbackLabel[document.documentType]} <ChevronDown size={17}/></span></summary>
      <div className="document-detail"><p>{document.preparationGuide}</p>{hasUsefulAction(document)&&<a className="document-action" href={document.actionUrl} target="_blank" rel="noopener noreferrer" onClick={event=>event.stopPropagation()}>{document.actionLabel||fallbackLabel[document.documentType]} <ExternalLink size={15}/></a>}</div>
    </details>)}</div>:<p className="pending-link">조건을 선택하면 준비할 서류가 표시됩니다.</p>}
    {!email&&<p className="inline-notice">로그인하면 체크한 항목이 이 브라우저에 저장돼요.</p>}
  </section>;
}
