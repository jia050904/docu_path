import type {Procedure} from '../types/procedure';
export function VerificationStatus({procedure:p}:{procedure:Procedure}){const label=p.verificationStatus==='verified'?'공식 확인 완료':p.verificationStatus==='institution-specific'?'기관별 추가 확인 필요':'일반 절차 안내';return <span className={`verification-badge ${p.verificationStatus}`}>{label}</span>}
