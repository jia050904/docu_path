import {Link} from 'react-router-dom';
import {procedures} from '../data/procedures';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';
import {procedureProgress} from '../lib/progress';

export function InProgressCard(){
  const {email}=useAuth();const [checks]=useUserData<Checks>('checks',{});const [stepChecks]=useUserData<Checks>('stepChecks',{});const [updated]=useUserData<Record<string,number>>('checkUpdated',{});const [answers]=useUserData<Record<string,Record<string,string>>>('conditionAnswers',{});
  if(!email)return <aside className="progress-preview"><p className="progress-kicker">저장하고 이어서 준비하세요</p><h2>내 체크리스트</h2><p className="progress-empty">로그인하면 준비 상황을 저장할 수 있어요.</p><Link className="progress-action" to="/login">데모 계정으로 로그인</Link></aside>;
  const active=procedures.map(procedure=>procedureProgress(procedure,checks,stepChecks,answers[procedure.id]||{},updated[procedure.id]||0)).filter(item=>item.completedCount>0&&!item.complete).sort((a,b)=>b.updatedAt-a.updatedAt);const progress=active[0];
  if(!progress)return <aside className="progress-preview"><p className="progress-kicker">나의 행정 준비 현황</p><h2>내 진행 중인 업무</h2><p className="progress-empty">아직 준비 중인 업무가 없어요.</p><Link className="progress-action" to="/#popular">많이 찾는 업무 보기</Link></aside>;
  const {procedure}=progress;
  return <aside className="progress-preview"><p className="progress-kicker">진행 중</p><h2>내 진행 중인 업무</h2><span className="progress-category">{procedure.category}</span><h3>{procedure.title}</h3><div className="progress-count"><span>{progress.completedCount} / {progress.totalCount} 준비 완료</span><strong>{progress.percent}%</strong></div><div className="progress-preview-track" role="progressbar" aria-label={`${procedure.title} 준비 진행률`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}><span style={{width:`${progress.percent}%`}}/></div><p className="progress-next"><span>다음 준비</span><strong>{progress.nextLabel}</strong></p><Link className="progress-action" to={`/procedure/${procedure.id}`}>이어서 준비하기</Link></aside>;
}
