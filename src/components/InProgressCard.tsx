import {Link} from 'react-router-dom';
import {procedures} from '../data/procedures';
import {useAuth} from '../hooks/useAuth';
import {useUserData} from '../hooks/useUserData';
import type {Checks} from '../lib/storage';

export function InProgressCard(){
  const {email}=useAuth();
  const [checks]=useUserData<Checks>('checks',{});
  const [updated]=useUserData<Record<string,number>>('checkUpdated',{});
  if(!email)return <aside className="progress-preview"><p className="progress-kicker">저장하고 이어서 준비하세요</p><h2>내 체크리스트</h2><p className="progress-empty">로그인하면 준비 상황을 저장할 수 있어요.</p><Link className="progress-action" to="/login">데모 계정으로 로그인</Link></aside>;
  const active=procedures.filter(p=>(checks[p.id]||[]).length>0).sort((a,b)=>(updated[b.id]||0)-(updated[a.id]||0));
  const procedure=active[0];
  if(!procedure)return <aside className="progress-preview"><p className="progress-kicker">나의 행정 준비 현황</p><h2>내 진행 중인 업무</h2><p className="progress-empty">아직 준비 중인 업무가 없어요.</p><Link className="progress-action" to="/#popular">많이 찾는 업무 보기</Link></aside>;
  const done=checks[procedure.id]||[];
  const percent=Math.round(done.length/procedure.documents.length*100);
  const next=procedure.documents.find(d=>!done.includes(d.id));
  return <aside className="progress-preview"><p className="progress-kicker">최근 준비한 체크리스트</p><h2>내 진행 중인 업무</h2><span className="progress-category">{procedure.category}</span><h3>{procedure.title}</h3><div className="progress-count"><span>{done.length} / {procedure.documents.length} 준비 완료</span><strong>{percent}%</strong></div><div className="progress-preview-track" role="progressbar" aria-label={`${procedure.title} 준비 진행률`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:`${percent}%`}}/></div><p className="progress-next"><span>다음 준비</span><strong>{next?.name||'처리 순서와 신청처 확인'}</strong></p><Link className="progress-action" to={`/procedure/${procedure.id}`}>이어서 준비하기</Link></aside>;
}
