import {Link} from 'react-router-dom';
import {procedures} from '../data/procedures';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';

export function InProgressCard(){
  const {email}=useAuth();
  const [checks]=useUserData<Checks>('checks',{});
  const [stepChecks]=useUserData<Checks>('stepChecks',{});
  const [updated]=useUserData<Record<string,number>>('checkUpdated',{});
  if(!email)return <aside className="progress-preview"><p className="progress-kicker">저장하고 이어서 준비하세요</p><h2>내 체크리스트</h2><p className="progress-empty">로그인하면 준비 상황을 저장할 수 있어요.</p><Link className="progress-action" to="/login">데모 계정으로 로그인</Link></aside>;
  const active=procedures.filter(p=>
    (checks[p.id]||[]).some(id=>p.requiredDocuments.some(d=>d.id===id)) ||
    (stepChecks[p.id]||[]).some(id=>p.steps.some(step=>step.id===id)),
  ).sort((a,b)=>(updated[b.id]||0)-(updated[a.id]||0));
  const procedure=active[0];
  if(!procedure)return <aside className="progress-preview"><p className="progress-kicker">나의 행정 준비 현황</p><h2>내 진행 중인 업무</h2><p className="progress-empty">아직 준비 중인 업무가 없어요.</p><Link className="progress-action" to="/#popular">많이 찾는 업무 보기</Link></aside>;
  const doneDocuments=(checks[procedure.id]||[]).filter(id=>procedure.requiredDocuments.some(d=>d.id===id));
  const doneSteps=(stepChecks[procedure.id]||[]).filter(id=>procedure.steps.some(step=>step.id===id));
  const doneCount=doneDocuments.length+doneSteps.length;
  const total=procedure.requiredDocuments.length+procedure.steps.length;
  const percent=total?Math.round(doneCount/total*100):0;
  const nextDocument=procedure.requiredDocuments.find(d=>!doneDocuments.includes(d.id));
  const nextStep=procedure.steps.find(step=>!doneSteps.includes(step.id));
  const nextLabel=nextDocument?.name||nextStep?.title||'공식 신청처에서 최종 확인';
  return <aside className="progress-preview"><p className="progress-kicker">최근 준비한 체크리스트</p><h2>내 진행 중인 업무</h2><span className="progress-category">{procedure.category}</span><h3>{procedure.title}</h3><div className="progress-count"><span>{doneCount} / {total} 준비 완료</span><strong>{percent}%</strong></div><div className="progress-preview-track" role="progressbar" aria-label={`${procedure.title} 준비 진행률`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:`${percent}%`}}/></div><p className="progress-next"><span>다음 준비</span><strong>{nextLabel}</strong></p><Link className="progress-action" to={`/procedure/${procedure.id}`}>이어서 준비하기</Link></aside>;
}
