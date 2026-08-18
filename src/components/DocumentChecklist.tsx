import {ExternalLink,ChevronDown} from 'lucide-react';
import type {Procedure,RequiredDocument} from '../types/procedure';
import {ProgressBar} from './ProgressBar';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';
import {track} from '../lib/analytics';

const fallbackLabel:Record<RequiredDocument['documentType'],string>={online_issue:'온라인 발급',official_template:'양식 다운로드',online_form:'온라인에서 작성',user_prepared:'준비 방법',institution_issued:'발급처 확인',existing_document:'보유 서류 확인'};

export function DocumentChecklist({procedure:p,answers}:{procedure:Procedure;answers:Record<string,string>}){
  const {email}=useAuth();
  const [checks,setChecks]=useUserData<Checks>('checks',{});
  const [stepChecks]=useUserData<Checks>('stepChecks',{});
  const [,setUpdated]=useUserData<Record<string,number>>('checkUpdated',{});
  const selected=checks[p.id]||[];
  const documents=p.requiredDocuments.filter(d=>!d.condition||d.condition.values.includes(answers[d.condition.questionId]));
  const steps=p.steps.filter(s=>!s.condition||s.condition.values.includes(answers[s.condition.questionId]));
  const toggle=(id:string)=>{if(!email){alert('체크리스트 저장은 Demo 로그인 후 이용할 수 있어요.');return}const checked=!selected.includes(id);setChecks(old=>({...old,[p.id]:checked?[...(old[p.id]||[]),id]:(old[p.id]||[]).filter(x=>x!==id)}));setUpdated(old=>({...old,[p.id]:Date.now()}));track('document_check',{procedure_id:p.id,document_id:id,checked})};
  return <section className="detail-section">
    <div className="section-heading"><div><p className="eyebrow">준비물 체크리스트</p><h2>필요한 서류</h2></div></div>
    <p className="section-guidance">아래 내용은 일반적인 신청 기준입니다. 신청자의 조건과 담당 기관에 따라 추가 서류가 필요할 수 있으므로 신청 전 공식 안내를 다시 확인해 주세요.</p>
    <ProgressBar done={selected.filter(x=>documents.some(d=>d.id===x)).length+(stepChecks[p.id]||[]).filter(x=>steps.some(s=>s.id===x)).length} total={documents.length+steps.length}/>
    {documents.length?<div className="document-cards">{documents.map(d=><details className={selected.includes(d.id)?'document-card checked':'document-card'} key={d.id}>
      <summary><label onClick={event=>event.stopPropagation()}><input type="checkbox" checked={selected.includes(d.id)} onChange={()=>toggle(d.id)}/><span><strong>{d.name}</strong><small>{d.required?'필수':'해당자만'} · {d.issuer}</small></span></label><span className="document-summary-action">{d.actionLabel||fallbackLabel[d.documentType]} <ChevronDown size={17}/></span></summary>
      <div className="document-detail"><p>{d.description}</p><dl><div><dt>어디에서 받나요?</dt><dd>{d.obtainMethod}</dd></div><div><dt>언제 필요한가요?</dt><dd>{d.applicableWhen}</dd></div><div><dt>어떻게 준비하나요?</dt><dd>{d.preparationGuide}</dd></div><div><dt>온라인 발급이 어렵다면</dt><dd>{d.alternativeMethod}</dd></div></dl>{d.cautions.length>0&&<ul>{d.cautions.map(c=><li key={c}>{c}</li>)}</ul>}<div className="document-actions">{d.actionUrl&&<a className="document-action" href={d.actionUrl} target="_blank" rel="noopener noreferrer">{d.actionLabel||fallbackLabel[d.documentType]} <ExternalLink size={15}/></a>}<a className="source-action" href={d.sourceUrl} target="_blank" rel="noopener noreferrer">공식 근거 <ExternalLink size={14}/></a></div></div>
    </details>)}</div>:<p className="pending-link">이 업무의 공통 준비물은 추가 확인 중입니다. 오른쪽 공식 신청처에서 본인 조건에 맞는 구비서류를 확인해 주세요.</p>}
    {!email&&<p className="inline-notice">로그인하면 체크한 항목이 이 브라우저에 저장돼요.</p>}
  </section>;
}
