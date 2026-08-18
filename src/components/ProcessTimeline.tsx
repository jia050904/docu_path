import type {Procedure} from '../types/procedure';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';
import {track} from '../lib/analytics';
import {procedureProgress} from '../lib/progress';

export function ProcessTimeline({procedure,answers}:{procedure:Procedure;answers:Record<string,string>}){
  const {email}=useAuth();
  const [checks,setChecks]=useUserData<Checks>('stepChecks',{});
  const [documentChecks]=useUserData<Checks>('checks',{});
  const [,setUpdated]=useUserData<Record<string,number>>('checkUpdated',{});
  const selected=checks[procedure.id]||[];
  const steps=procedure.steps.filter(step=>!step.condition||step.condition.values.includes(answers[step.condition.questionId])).sort((a,b)=>a.order-b.order);
  const toggle=(id:string)=>{if(!email){alert('처리 순서 저장은 Demo 로그인 후 이용할 수 있어요.');return}const checked=!selected.includes(id);const nextSelected=checked?[...selected,id]:selected.filter(item=>item!==id);const nextChecks={...checks,[procedure.id]:nextSelected};setChecks(nextChecks);setUpdated(old=>({...old,[procedure.id]:Date.now()}));const progress=procedureProgress(procedure,documentChecks,nextChecks,answers);track('checklist_item_toggle',{service_id:procedure.id,item_type:'step',checked,progress_percent:progress.percent})};
  return <section className="detail-section"><p className="eyebrow">순서대로 완료하기</p><h2>처리 순서</h2>{steps.length?<ol className="timeline">{steps.map(step=><li className={selected.includes(step.id)?'step-completed':''} key={step.id}><label className="timeline-row"><input type="checkbox" checked={selected.includes(step.id)} onChange={()=>toggle(step.id)}/><span className="step-checkbox" aria-hidden="true">✓</span><span className="step-number">{step.order}</span><span className="step-content"><strong>{step.title}</strong><span>{step.description}</span>{step.method&&<em>방법 · {step.method}</em>}{step.caution&&<small>주의 · {step.caution}</small>}</span></label></li>)}</ol>:<p className="pending-link">조건을 선택하면 본인 상황에 맞는 처리 순서가 표시됩니다.</p>}</section>;
}
