import {ExternalLink} from 'lucide-react';
import type {Procedure} from '../types/procedure';
import {track} from '../lib/analytics';

const sourceName=(url:string)=>{const host=new URL(url).hostname;if(host.includes('hikorea'))return 'Hi Korea 이용안내';if(host.includes('bokjiro'))return '복지로 사업 안내';if(host.includes('koreapost'))return '우정사업본부 이용안내';if(host.includes('epost'))return '인터넷우체국 이용안내';if(host.includes('law.go.kr'))return '국가법령정보센터';if(host.includes('nts.go.kr'))return '국세청 안내';if(host.includes('wetax'))return '위택스 안내';if(host.includes('gov.kr'))return '정부24 안내';if(host.includes('moj.go.kr'))return '법무부 안내';if(host.includes('kosaf'))return '한국장학재단 안내';if(host.includes('rtms'))return '국토교통부 임대차신고 안내';if(host.includes('e-health'))return 'e보건소 이용안내';if(host.endsWith('.ac.kr'))return '대학 공식 안내';return '담당 기관 안내'};
const applicationLabel=(procedure:Procedure)=>procedure.id==='stay-extension'?'Hi Korea에서 온라인 신청':procedure.id==='move-in-report'?'정부24에서 전입신고':procedure.id==='fixed-date'||procedure.id==='rental-contract-report'?'부동산거래관리시스템에서 신청':procedure.id==='national-scholarship'?'한국장학재단에서 신청':procedure.id==='health-certificate'?'e보건소에서 결과서 발급':procedure.id==='youth-rent-support'?'복지로에서 신청':procedure.id==='mail-forwarding'?'인터넷우체국에서 신청':procedure.id==='global-income-tax'?'홈택스에서 신고':procedure.id==='earned-income-credit'?'홈택스에서 근로장려금 신청':'온라인 신청·조회';
const trackOfficialLink=(procedure:Procedure,url:string,linkType:'application'|'official_guide')=>track('official_link_click',{service_id:procedure.id,link_type:linkType,destination_domain:new URL(url).hostname});

export function OfficialLinks({procedure}:{procedure:Procedure}){
  const stay=procedure.id==='stay-extension';
  const sources=[...new Set(procedure.officialSourceUrls)].filter(url=>url!==procedure.officialApplicationUrl);
  return <section className="detail-section official"><p className="eyebrow">바로 신청하기</p><h2>신청 정보</h2><dl>
    <div><dt>신청 기관</dt><dd>{stay?'Hi Korea / 관할 출입국·외국인관서':procedure.responsibleAgency}</dd></div>
    <div><dt>신청 방법</dt><dd>{stay?'온라인 / 방문':procedure.applicationMethod}</dd></div>
    {stay?<><div><dt>수수료</dt><dd><span>온라인 48,000원</span><span>방문 60,000원</span></dd></div><div><dt>처리기간</dt><dd>온라인 14일 이내</dd></div></>:<>{procedure.fee&&!procedure.fee.includes('확인')&&!procedure.fee.includes('상이')&&<div><dt>수수료</dt><dd>{procedure.fee}</dd></div>}{procedure.processingTime&&!procedure.processingTime.includes('확인')&&!procedure.processingTime.includes('상이')&&<div><dt>처리기간</dt><dd>{procedure.processingTime}</dd></div>}</>}
  </dl>{procedure.officialApplicationUrl&&<a className="primary-link-button" href={procedure.officialApplicationUrl} target="_blank" rel="noopener noreferrer" onClick={()=>trackOfficialLink(procedure,procedure.officialApplicationUrl!,'application')}>{applicationLabel(procedure)} <ExternalLink size={16}/></a>}{stay&&<p className="application-path">Hi Korea → 민원신청 → 전자민원 → 등록외국인의 체류기간연장허가</p>}{sources.length>0&&<div className="named-source-links">{sources.map(url=><a key={url} href={url} target="_blank" rel="noopener noreferrer" onClick={()=>trackOfficialLink(procedure,url,'official_guide')}>{sourceName(url)} <ExternalLink size={13}/></a>)}</div>}</section>;
}
