import type {Procedure} from '../types/procedure';
export function VerificationStatus({procedure:p}:{procedure:Procedure}){const label=p.verificationStatus==='verified'?'공식 자료 확인 완료':p.verificationStatus==='institution-specific'?'기관별 확인 필요':'정보 확인 중';return <span className={`verification-badge ${p.verificationStatus}`}>{label}</span>}
