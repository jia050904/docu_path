import type {Procedure,ProcedureStep,RequiredDocument} from '../types/procedure';
import {catalogDocument,completeDocument} from './documentCatalog';

const d=(catalogId:string,id=catalogId,overrides:Partial<RequiredDocument>={})=>catalogDocument(catalogId,id,overrides);
const x=(id:string,name:string,description:string,sourceUrl:string,overrides:Partial<RequiredDocument>={})=>completeDocument({id,name,description,sourceUrl,...overrides});
const s=(sourceUrl:string,items:Array<[string,string,string,string?,string?,ProcedureStep['condition']?]>):ProcedureStep[]=>items.map(([id,title,description,method,caution,condition],index)=>({id,order:index+1,title,description,method,caution,condition,sourceUrl}));
const HIKOREA='https://www.hikorea.go.kr/';
const GOV_MOVE='https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000016&HighCtgCD=A01010&tp_seq=01';
const RTMS='https://rtms.molit.go.kr/main/systemInfo.do';
const KOSAF='https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_05';
const EHEALTH='https://e-health.go.kr/gh/caSrvcGud/selectUsrGudInfo.do?menuId=200016';
const condition=(questionId:string,...values:string[])=>({questionId,values});

const d2ResidenceDocuments:RequiredDocument[]=[
  d('lease_contract','d2-own-lease',{applicableWhen:'본인 명의 자취방에 거주하는 경우',condition:condition('residence-type','own-rental'),preparationGuide:'정확한 주소, 임대기간, 임대인·임차인 정보와 양쪽 서명 또는 날인이 모두 보이도록 전체 계약서를 스캔하세요.'}),
  x('dorm-proof','기숙사 거주확인서','학교 기숙사 주소와 실제 거주기간을 확인하는 학교 발급 서류입니다.',HIKOREA,{documentType:'institution_issued',issuer:'기숙사 행정실·소속 대학',actionLabel:'학교 발급처 확인',actionUrl:'https://www.academyinfo.go.kr/',alternativeMethod:'기숙사 행정실 또는 학교 포털에서 발급받으세요.',preparationGuide:'기숙사 주소와 거주기간이 표시되어 있는지 확인하세요.',condition:condition('residence-type','dorm')}),
  x('accommodation-confirmation','거주·숙소제공 확인서','타인 또는 숙박업체가 제공하는 주소에 거주한다는 사실을 숙소 제공자가 작성·서명하는 공식 서식입니다.',HIKOREA,{documentType:'official_template',issuer:'법무부·숙소 제공자',actionLabel:'Hi Korea에서 양식 찾기',actionUrl:HIKOREA,alternativeMethod:'Hi Korea → 뉴스·공지 → 민원서식에서 “거주/숙소제공 확인서”를 검색하세요.',preparationGuide:'최신 양식을 내려받아 숙소 제공자가 주소·제공기간을 작성하고 서명합니다.',condition:condition('residence-type','other-person','lodging')}),
  d('id_copy','provider-id',{name:'숙소 제공자의 신분증 사본',required:true,applicableWhen:'다른 사람 명의의 집에 거주하는 경우',issuer:'숙소 제공자',condition:condition('residence-type','other-person')}),
  d('lease_contract','provider-lease',{name:'숙소 제공자 명의 임대차계약서 사본',applicableWhen:'다른 사람 명의의 임차주택에 거주하는 경우',condition:condition('residence-type','other-person')}),
  x('lodging-registration','숙박업체 사업자등록증 사본','고시원·게스트하우스 등 숙박업체의 사업자 정보를 확인하는 사본입니다.',HIKOREA,{documentType:'institution_issued',issuer:'숙박업체',actionLabel:'발급처 확인',alternativeMethod:'운영자 또는 관리실에 사본을 요청하세요.',preparationGuide:'업체명과 실제 거주 주소가 확인되는지 살펴보세요.',condition:condition('residence-type','lodging')}),
  x('lodging-payment','월세 영수증 또는 계좌이체내역','해당 숙소에서 실제 거주비를 납부한 자료입니다.',HIKOREA,{documentType:'existing_document',issuer:'숙박업체·금융기관',actionLabel:'보유 서류 확인',alternativeMethod:'숙박업체에 납부영수증을 요청하세요.',preparationGuide:'납부자, 수취인, 금액과 납부일이 선명한 자료를 준비하세요.',condition:condition('residence-type','lodging')})
];

export const priorityProcedureGuides:Record<string,Partial<Procedure>>={
  'stay-extension':{
    summary:'Demo는 가장 흔한 D-2 재학생 연장을 중심으로 안내하며, 다른 체류자격은 Hi Korea에서 자격별 서류를 확인합니다.',
    conditionQuestions:[
      {id:'visa-type',question:'현재 체류자격을 선택해 주세요.',required:true,options:[{value:'d2',label:'D-2 유학'},{value:'d4',label:'D-4 연수'},{value:'other',label:'기타'}]},
      {id:'residence-type',question:'현재 어디에 거주하고 있나요?',helpText:'선택한 거주 형태에 맞는 체류지 입증서류만 표시됩니다.',required:true,condition:condition('visa-type','d2'),options:[{value:'own-rental',label:'본인 명의 자취방'},{value:'dorm',label:'학교 기숙사'},{value:'other-person',label:'다른 사람 명의의 집'},{value:'lodging',label:'고시원·게스트하우스 등'}]}
    ],
    requiredDocuments:[
      x('integrated-application','통합신청서(신고서)','출입국관리법 시행규칙 별지 제34호 공식 서식입니다.',HIKOREA,{documentType:'official_template',issuer:'법무부',actionLabel:'양식 찾기',actionUrl:HIKOREA,alternativeMethod:'Hi Korea → 뉴스·공지 → 민원서식에서 “통합신청서”를 검색해 최신 첨부파일을 받으세요.',preparationGuide:'신청인 정보와 신청 종류를 작성하고 서명하세요.',condition:condition('visa-type','d2')}),
      d('passport_copy','passport',{preparationGuide:'여권 원본의 사진·인적사항 면을 직접 스캔하거나 복사하세요. 정보와 사진이 선명해야 합니다.',condition:condition('visa-type','d2')}),
      d('alien_card_copy','alien-card',{name:'외국인등록증',preparationGuide:'온라인 신청은 앞·뒷면을 스캔하고, 방문 신청은 원본을 지참하세요.',condition:condition('visa-type','d2')}),
      d('enrollment_certificate','enrollment',{actionLabel:'학교 발급처 확인',condition:condition('visa-type','d2')}),
      d('transcript','grade',{description:'전체 이수학기의 성적이 포함된 공식 성적증명서입니다.',actionLabel:'학교 발급처 확인',condition:condition('visa-type','d2')}),
      ...d2ResidenceDocuments.map(document=>({...document,condition:document.condition})),
      x('d2-additional','체류자격별 추가서류','성적 미달, 초과학기, 수료 등의 경우 재정입증서류나 사유서가 추가될 수 있습니다.',HIKOREA,{required:false,applicableWhen:'성적 미달·초과학기·수료 등 개별 심사가 필요한 경우',documentType:'user_prepared',issuer:'신청인·학교·금융기관',condition:condition('visa-type','d2')}),
      x('visa-specific-lookup','체류자격별 서류 확인','D-4와 기타 체류자격은 허가요건과 구비서류가 달라 Hi Korea 최신 안내를 확인해야 합니다.',HIKOREA,{required:true,applicableWhen:'D-2 이외 체류자격',documentType:'online_form',issuer:'Hi Korea',actionLabel:'Hi Korea에서 확인',actionUrl:HIKOREA,condition:condition('visa-type','d4','other')})
    ],
    steps:[
      ...s(HIKOREA,[['expiry','본인의 체류기간 만료일 확인','외국인등록증과 Hi Korea에서 만료일을 확인합니다.','온라인',undefined,condition('visa-type','d2')],['status','체류자격과 학적상태에 맞는 서류 확인','D-2 재학·수료·초과학기 등 현재 학적에 맞는 추가서류를 확인합니다.',undefined,undefined,condition('visa-type','d2')],['prepare','필요한 서류 발급·작성','통합신청서, 학교증명서와 선택한 거주형태의 증빙을 준비합니다.',undefined,undefined,condition('visa-type','d2')],['login','Hi Korea 로그인','전자민원 이용을 위해 로그인하고 본인인증을 진행합니다.','온라인',undefined,condition('visa-type','d2')],['select','체류기간연장허가 민원 선택','민원신청 → 전자민원 → 등록외국인의 체류기간연장허가를 선택합니다.','온라인',undefined,condition('visa-type','d2')],['attach','신청정보 입력 및 서류 첨부','신청내용을 입력하고 준비한 파일을 항목별로 첨부합니다.','온라인',undefined,condition('visa-type','d2')],['fee','수수료 결제','전자민원 화면에 표시된 본인 체류자격의 수수료를 결제합니다.','온라인','일반적인 연장 수수료 안내는 60,000원이지만 체류자격·신청방식별 최신 금액을 확인하세요.',condition('visa-type','d2')],['result','처리결과 확인','신청내역에서 보완요청과 허가 결과, 변경된 체류기간을 확인합니다.','온라인',undefined,condition('visa-type','d2')]]),
      ...s(HIKOREA,[['lookup','체류자격별 서류와 절차 확인','Hi Korea 체류민원 안내 또는 관할 출입국·외국인관서에서 현재 자격의 절차를 확인합니다.','온라인·방문',undefined,condition('visa-type','d4','other')]])
    ],
    fee:'일반 연장허가 60,000원 안내가 있으나 체류자격·전자민원 여부별 최종 금액 확인',processingTime:'관할기관과 심사·보완 여부에 따라 상이',officialApplicationUrl:HIKOREA,officialSourceUrls:[HIKOREA,'https://ds.pusan.ac.kr/bbs/ds/806/1428008/download.do'],lastVerifiedAt:'2026-08-18'
  },
  'move-in-report':{
    conditionQuestions:[
      {id:'applicant-type',question:'신고 대상자를 선택해 주세요.',required:true,options:[{value:'resident',label:'대한민국 주민등록 대상자'},{value:'foreigner',label:'등록외국인'}]},
      {id:'residence-type',question:'등록외국인은 현재 어디에 거주하고 있나요?',required:true,condition:condition('applicant-type','foreigner'),options:[{value:'own-rental',label:'본인 명의 자취방'},{value:'dorm',label:'학교 기숙사'},{value:'other-person',label:'다른 사람 명의의 집'},{value:'lodging',label:'고시원·게스트하우스 등'}]}
    ],
    requiredDocuments:[
      x('resident-auth','본인인증 수단','정부24 온라인 전입신고 로그인과 전자신청에 사용합니다.',GOV_MOVE,{documentType:'existing_document',issuer:'인증기관',actionLabel:'보유 수단 확인',condition:condition('applicant-type','resident')}),
      x('move-info','새 주소와 이사일 정보','실제로 전입한 날짜와 도로명·상세주소를 정확히 확인합니다.',GOV_MOVE,{documentType:'user_prepared',issuer:'신청인',condition:condition('applicant-type','resident')}),
      x('householder-info','세대주 정보','기존 세대에 편입하는 경우 세대주 성명과 관계 등 확인에 사용합니다.',GOV_MOVE,{required:false,applicableWhen:'기존 세대에 편입하거나 세대주 확인이 필요한 경우',condition:condition('applicant-type','resident')}),
      d('id_copy','visit-reporter-id',{name:'신고자 신분증',applicableWhen:'주민센터 방문 신고 시',condition:condition('applicant-type','resident')}),
      d('id_copy','visit-member-id',{name:'전입하는 사람의 신분증',required:false,applicableWhen:'방문 신고에서 가족관계 등에 따라 추가 확인이 필요한 경우',condition:condition('applicant-type','resident')}),
      d('application','visit-form',{name:'전입신고서',applicableWhen:'주민센터 방문 신고 시',issuer:'주민센터',obtainMethod:'방문 창구에서 받아 작성할 수 있습니다.',preparationGuide:'온라인 신청은 정부24 화면에서 직접 입력하며 종이 신청서를 준비하지 않습니다.',condition:condition('applicant-type','resident')}),
      d('alien_card_copy','foreign-id',{name:'외국인등록증 또는 여권',condition:condition('applicant-type','foreigner')}),
      x('foreign-integrated-form','통합신청서','출입국 체류지변경을 방문 신고할 때 사용하는 통합신청서입니다.',HIKOREA,{required:false,applicableWhen:'관할 출입국·외국인관서 방문 신고 시',documentType:'official_template',issuer:'법무부',actionLabel:'양식 찾기',actionUrl:HIKOREA,condition:condition('applicant-type','foreigner')}),
      ...d2ResidenceDocuments.map(document=>({...document,id:`move-${document.id}`,condition:condition('residence-type',...(document.condition?.values||[]))}))
    ],
    steps:[
      ...s(GOV_MOVE,[['date','이사한 날짜와 새 주소 확인','전입일과 새 주소를 정확히 확인합니다.',undefined,undefined,condition('applicant-type','resident')],['login','정부24 접속 및 로그인','본인 인증수단으로 정부24에 로그인합니다.','온라인',undefined,condition('applicant-type','resident')],['search','“전입신고” 검색','정부24 검색에서 전입신고 민원을 찾습니다.','온라인',undefined,condition('applicant-type','resident')],['apply','신청하기 선택','전입신고 민원 신청 화면을 엽니다.','온라인',undefined,condition('applicant-type','resident')],['address','이전 주소와 새 주소 입력','주소와 이사일을 사실대로 입력합니다.','온라인',undefined,condition('applicant-type','resident')],['household','세대 구성과 연계서비스 선택','세대 편입 여부와 우편물 이전서비스 등을 선택합니다.','온라인',undefined,condition('applicant-type','resident')],['submit','신청 제출','입력 내용을 검토하고 제출합니다.','온라인',undefined,condition('applicant-type','resident')],['result','MyGOV에서 처리상태 확인','세대주 확인·보완 여부와 완료 상태를 확인합니다.','온라인',undefined,condition('applicant-type','resident')]]),
      ...s(HIKOREA,[['foreign-check','새 체류지와 신고기한 확인','등록외국인의 체류지 변경 신고 대상과 기한을 확인합니다.','온라인·방문',undefined,condition('applicant-type','foreigner')],['foreign-docs','신분·체류지 증명 준비','외국인등록증 또는 여권과 선택한 거주형태의 자료를 준비합니다.',undefined,undefined,condition('applicant-type','foreigner')],['foreign-apply','체류지변경신고 제출','Hi Korea 전자민원 또는 관할 출입국·외국인관서에서 신고합니다.','온라인·방문',undefined,condition('applicant-type','foreigner')],['foreign-result','주소 변경 결과 확인','등록사항 반영과 추가자료 요청 여부를 확인합니다.',undefined,undefined,condition('applicant-type','foreigner')]])
    ],
    officialApplicationUrl:GOV_MOVE,officialSourceUrls:[GOV_MOVE,HIKOREA],fee:'없음',processingTime:'주민등록 전입신고는 즉시(근무시간 내 3시간), 외국인 체류지변경은 관할기관 확인',lastVerifiedAt:'2026-08-18'
  },
  'fixed-date':{
    conditionQuestions:[{id:'rental-report-status',question:'임대차계약 신고를 이미 완료했나요?',required:true,options:[{value:'reported',label:'계약서를 첨부해 신고했어요'},{value:'not-reported',label:'아직 신고하지 않았어요'},{value:'visit',label:'신고 대상이 아니거나 잘 모르겠어요'}]}],
    requiredDocuments:[
      x('report-receipt','주택 임대차 신고필증','계약서를 첨부해 신고했다면 신고필증에서 확정일자 자동 부여 여부를 확인합니다.',RTMS,{documentType:'online_issue',issuer:'부동산거래관리시스템',actionLabel:'신고 결과 확인',actionUrl:RTMS,condition:condition('rental-report-status','reported')}),
      d('lease_contract','online-contract',{name:'주택 임대차계약서 전체 사본',preparationGuide:'주소, 보증금·월세, 계약기간, 당사자 정보와 서명·날인이 포함된 전체 페이지를 스캔합니다.',condition:condition('rental-report-status','not-reported')}),
      x('rtms-auth','본인인증 수단','부동산거래관리시스템 로그인과 전자서명에 사용합니다.',RTMS,{documentType:'existing_document',issuer:'인증기관',actionLabel:'보유 수단 확인',condition:condition('rental-report-status','not-reported')}),
      d('lease_contract','visit-contract',{name:'주택 임대차계약서 원본',preparationGuide:'확정일자를 표시받을 수 있도록 서명·날인된 계약서 원본을 지참합니다.',condition:condition('rental-report-status','visit')}),
      d('id_copy','visit-id',{name:'유효한 신분증',description:'방문 신청인의 본인 확인을 위한 유효한 신분증 원본입니다.',condition:condition('rental-report-status','visit')})
    ],
    steps:[
      ...s(RTMS,[['receipt','신고필증 열기','부동산거래관리시스템에서 처리 완료된 신고필증을 확인합니다.','온라인',undefined,condition('rental-report-status','reported')],['auto-date','확정일자 부여 여부 확인','계약서를 첨부한 신고라면 자동 부여된 확정일자를 확인하고 중복 신청하지 않습니다.',undefined,undefined,condition('rental-report-status','reported')],['rtms','부동산거래관리시스템 접속','공식 부동산거래관리시스템에 접속합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['report-menu','주택임대차 신고 선택','메뉴에서 주택임대차 신고를 선택합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['location','주택 소재지 선택','계약한 주택의 관할 지역을 선택합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['auth','로그인 및 본인인증','실명확인과 인증수단으로 로그인합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['contract-info','계약정보 입력','당사자, 주택, 보증금·월세와 기간을 계약서대로 입력합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['upload','임대차계약서 첨부','계약서 전체 스캔본을 첨부합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['sign','전자서명 후 제출','입력·첨부 내용을 확인하고 전자서명합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['check-date','신고필증과 확정일자 확인','처리 완료 후 신고필증의 확정일자를 확인합니다.','온라인',undefined,condition('rental-report-status','not-reported')],['visit-prepare','계약서 원본과 신분증 준비','서명된 원본 계약서와 유효한 신분증을 준비합니다.',undefined,undefined,condition('rental-report-status','visit')],['visit-center','주택 소재지 관할 주민센터 방문','확정일자 부여 업무 가능 창구를 방문합니다.','방문',undefined,condition('rental-report-status','visit')],['visit-request','확정일자 부여 요청','창구에 계약서 원본을 제출해 확정일자를 요청합니다.','방문',undefined,condition('rental-report-status','visit')],['visit-check','표시된 확정일자 확인','돌려받은 계약서에 부여된 날짜를 확인합니다.',undefined,undefined,condition('rental-report-status','visit')]])
    ],
    officialApplicationUrl:RTMS,officialSourceUrls:[RTMS,'https://rtms.molit.go.kr/main/serviceInfo.do'],fee:'임대차신고 계약서 첨부 시 별도 수수료 없음 / 단독 확정일자 방문 부여 수수료는 관할기관 최신 안내 확인',processingTime:'온라인 신고 승인 통상 1~2일, 방문은 기관 확인',lastVerifiedAt:'2026-08-18'
  },
  'national-scholarship':{
    conditionQuestions:[{id:'student-status',question:'현재 학적은 어떻게 되나요?',required:true,options:[{value:'new',label:'신입·편입·재입학생'},{value:'current',label:'재학생'},{value:'returning',label:'복학생'}]},{id:'document-target',question:'한국장학재단 신청현황에서 서류제출 대상자로 표시되나요?',helpText:'조건성 서류는 시스템에서 제출 대상 여부를 확인한 뒤 준비하세요.',required:true,options:[{value:'yes',label:'제출 대상자예요'},{value:'no',label:'제출 대상이 아니에요'},{value:'unknown',label:'아직 확인 전이에요'}]}],
    requiredDocuments:[
      x('kosaf-auth','본인 명의 인증수단','한국장학재단 로그인과 전자신청에 사용할 본인 명의 인증수단입니다.',KOSAF,{documentType:'existing_document',issuer:'인증기관',actionLabel:'보유 수단 확인'}),
      d('bankbook_copy','kosaf-account',{name:'본인 명의 계좌정보',preparationGuide:'신청 화면에 입력할 은행과 계좌번호를 확인합니다. 별도 사본 업로드 여부는 신청 화면을 따르세요.'}),
      x('family-info','부모 또는 배우자의 가구원 정보','미혼은 부모, 기혼은 배우자의 정보제공 동의를 진행할 수 있도록 기본정보를 확인합니다.',KOSAF,{documentType:'user_prepared',issuer:'신청인·가구원'}),
      d('family_certificate','conditional-family',{required:false,applicableWhen:'신청현황에서 가족관계 서류제출 대상자로 표시된 경우',condition:condition('document-target','yes'),preparationGuide:'한국장학재단 신청현황에서 제출 대상 여부와 일반·상세 종류를 먼저 확인하세요.'}),
      d('resident_record','conditional-resident',{required:false,applicableWhen:'신청현황에서 주민등록 서류 제출을 요청한 경우',condition:condition('document-target','yes'),preparationGuide:'한국장학재단 신청현황에서 제출 대상 여부와 표시항목을 먼저 확인하세요.'}),
      x('welfare-proof','기초생활수급자·차상위 관련 증빙','행정정보 연계로 확인되지 않아 재단이 별도 요청한 경우 제출합니다.',KOSAF,{required:false,applicableWhen:'신청현황에서 제출 대상으로 표시된 경우',documentType:'institution_issued',issuer:'관계 행정기관',actionLabel:'발급처 확인',actionUrl:'https://www.gov.kr/',condition:condition('document-target','yes')}),
      x('extra-family','추가 가족관계 확인서류','이혼·사망·입양 등 가족관계의 추가 확인이 필요한 경우 재단이 지정한 서류입니다.',KOSAF,{required:false,applicableWhen:'신청현황에서 개인별 추가서류를 요청한 경우',documentType:'institution_issued',issuer:'대법원·관계기관',actionLabel:'제출 대상 확인',actionUrl:KOSAF,condition:condition('document-target','yes')})
    ],
    steps:s(KOSAF,[['period','현재 학기의 신청기간 확인','동적 공지에서 신청·가구원동의·서류제출 마감일을 확인합니다.'],['login','한국장학재단 로그인','본인 명의 인증수단으로 로그인합니다.','온라인'],['select','국가장학금 통합신청 선택','장학금 메뉴에서 해당 학기 통합신청을 선택합니다.','온라인'],['form','학교·학적·가족정보 입력','신청화면에서 직접 작성하며 별도 신청서 파일은 필요하지 않습니다.','온라인'],['account','본인 명의 계좌 입력 및 신청 완료','계좌와 신청정보를 검토하고 전자서명해 제출합니다.','온라인'],['consent','가구원 정보제공 동의 완료','대상 부모 또는 배우자가 직접 온라인 동의를 완료합니다.','온라인'],['target','서류제출 대상 여부 확인','신청 후 서류제출현황에서 개인별 대상 여부를 확인합니다.','온라인'],['upload','대상자인 경우 필요한 서류 제출','표시된 서류만 홈페이지 또는 앱으로 업로드합니다.','온라인'],['result','지원구간과 심사결과 확인','신청현황에서 지원구간 산정과 선발 결과를 확인합니다.','온라인']]),
    officialApplicationUrl:'https://www.kosaf.go.kr/',officialSourceUrls:[KOSAF,'https://www.kosaf.go.kr/ko/notice.do?mode=view&page=1&seqNo=20900'],lastVerifiedAt:'2026-08-18'
  },
  'health-certificate':{
    conditionQuestions:[{id:'health-stage',question:'현재 어떤 단계인가요?',required:true,options:[{value:'first-exam',label:'처음 검사를 받아야 해요'},{value:'issue-result',label:'검사를 마치고 결과를 발급해요'}]}],
    requiredDocuments:[
      d('id_copy','health-id',{name:'유효한 신분증',applicableWhen:'보건소 검사 접수 시',condition:condition('health-stage','first-exam')}),
      d('alien_card_copy','health-foreigner-id',{name:'외국인의 경우 외국인등록증 또는 여권',required:false,applicableWhen:'외국인 검사 접수 시',condition:condition('health-stage','first-exam')}),
      x('industry','근무 업종 확인','식품위생 등 근무 업종에 맞는 건강진단 종류를 확인합니다.',EHEALTH,{documentType:'user_prepared',issuer:'사업장·신청인',condition:condition('health-stage','first-exam')}),
      x('part-time-permit','시간제취업 허가 확인','D-2·D-4 등 유학생은 해당 근무가 허가 범위에 포함되는지 확인합니다.',HIKOREA,{required:false,applicableWhen:'시간제취업 허가가 필요한 체류자격',documentType:'existing_document',issuer:'출입국·외국인관서',actionLabel:'허가 내용 확인',actionUrl:HIKOREA,condition:condition('health-stage','first-exam')}),
      x('health-form','건강진단 신청서','보건소 민원실에서 작성하며 별도 양식을 미리 준비할 필요가 없습니다.',EHEALTH,{documentType:'online_form',issuer:'검사 보건소',actionLabel:'현장에서 작성',condition:condition('health-stage','first-exam')}),
      x('health-result','건강진단결과서(구 보건증)','검사를 완료하고 결과가 확정된 뒤 e보건소에서 본인인증 후 발급합니다.',EHEALTH,{documentType:'online_issue',issuer:'e보건소·검사 보건소',actionLabel:'e보건소에서 발급',actionUrl:EHEALTH,alternativeMethod:'검사받은 보건소에서 방문 발급일과 수령방법을 확인하세요.',condition:condition('health-stage','issue-result')})
    ],
    steps:[
      ...s(EHEALTH,[['kind','근무 업종에 필요한 건강진단 종류 확인','사업장과 보건소에 필요한 검사 종류를 확인합니다.',undefined,undefined,condition('health-stage','first-exam')],['hours','가까운 보건소 검사시간 확인','검사 접수시간, 예약과 운영 여부를 확인합니다.',undefined,undefined,condition('health-stage','first-exam')],['visit','신분증을 가지고 보건소 방문','유효한 신분증을 지참해 접수합니다.','방문',undefined,condition('health-stage','first-exam')],['form-fee','신청서 작성 및 수수료 납부','민원실에서 현장 신청서를 작성하고 안내된 수수료를 냅니다.','방문','보건소의 일반 안내는 약 3,000원이지만 지역·기관별 최신 금액을 확인하세요.',condition('health-stage','first-exam')],['exam','필요한 검사 진행','보건소 안내에 따라 흉부 X-ray, 채변검사 등 업종별 검사를 받습니다.','방문','일반적으로 금식이 필요하지 않지만 검사기관 안내를 우선하세요.',condition('health-stage','first-exam')],['available','발급 가능일 확인','결과 처리 예상일과 온라인 발급 가능 시점을 확인합니다.',undefined,'검사 약 10~20분, 결과 약 4~5영업일 안내가 흔하지만 보건소별로 다릅니다.',condition('health-stage','first-exam')],['issue','e보건소 또는 보건소에서 결과서 발급','결과 확정 후 온라인 또는 방문으로 발급합니다.','온라인·방문',undefined,condition('health-stage','first-exam')]]),
      ...s(EHEALTH,[['portal','e보건소 증명 문서 발급 접속','증명 문서 발급에서 건강진단결과서(구 보건증)를 선택합니다.','온라인',undefined,condition('health-stage','issue-result')],['auth','본인인증','간편인증 또는 지원되는 인증수단으로 본인확인합니다.','온라인',undefined,condition('health-stage','issue-result')],['select-result','발급 가능한 검사결과 선택','목록에서 확정된 검사결과를 선택합니다.','온라인',undefined,condition('health-stage','issue-result')],['download','발급 신청 및 출력','용도와 표시사항을 확인하고 파일을 내려받거나 출력합니다.','온라인',undefined,condition('health-stage','issue-result')]])
    ],
    officialApplicationUrl:EHEALTH,officialSourceUrls:[EHEALTH,'https://www.e-health.go.kr/'],fee:'보건소 검사 수수료 통상 약 3,000원, 기관별 확인',processingTime:'검사 약 10~20분·결과 약 4~5영업일 안내가 흔하나 보건소별 상이',lastVerifiedAt:'2026-08-18'
  }
};
