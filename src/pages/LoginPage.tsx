import {useState,type FormEvent} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import {ArrowLeft,BookmarkCheck,Eye,EyeOff,FileCheck2,LockKeyhole,Mail,Search,UserRound} from 'lucide-react';
import {useAuth} from '../hooks/useAuth';

const DEMO_EMAIL='demo@seoryugil.kr';
const DEMO_PASSWORD='demo1234';

export function LoginPage(){
  const {login}=useAuth();
  const navigate=useNavigate();
  const [email,setEmail]=useState(DEMO_EMAIL);
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState('');

  const fillDemo=()=>{setEmail(DEMO_EMAIL);setPassword(DEMO_PASSWORD);setError('')};
  const submit=(event:FormEvent)=>{
    event.preventDefault();
    if(login(email,password))navigate('/');
    else setError('이메일 또는 비밀번호를 확인해 주세요.');
  };

  return <div className="login-page">
    <section className="login-intro" aria-labelledby="login-intro-title">
      <div className="login-intro-copy">
        <h1 id="login-intro-title">복잡한 행정절차를,<br/>한눈에.</h1>
        <p>필요한 서류와 처리 순서를 저장하고 이어서 확인하세요.</p>
      </div>

      <div className="login-journey">
        <svg className="journey-path" viewBox="0 0 720 170" preserveAspectRatio="none" aria-hidden="true">
          <path d="M58 82 C150 82 164 82 205 103 S310 70 372 96 S490 132 555 88 S633 102 680 132"/>
          <circle cx="680" cy="132" r="8"/>
        </svg>
        <div className="journey-step step-search"><span className="step-index">01</span><span className="journey-icon"><Search/></span><strong>업무 검색</strong></div>
        <div className="journey-step step-document"><span className="step-index">02</span><span className="journey-icon"><FileCheck2/></span><strong>서류 확인</strong></div>
        <div className="journey-step step-save"><span className="step-index">03</span><span className="journey-icon"><BookmarkCheck/></span><strong>진행 저장</strong></div>
      </div>

      <Link to="/" className="login-home-link"><ArrowLeft size={18}/>홈으로 돌아가기</Link>

      <svg className="login-landscape" viewBox="0 0 900 250" preserveAspectRatio="none" aria-hidden="true">
        <path className="hill-back" d="M0 156 C95 76 150 164 235 103 C315 45 374 141 455 80 C540 19 606 145 690 83 C759 31 824 124 900 67 L900 250 L0 250Z"/>
        <path className="hill-mid" d="M0 185 C96 107 172 204 272 137 C352 84 442 189 530 122 C618 54 718 192 900 107 L900 250 L0 250Z"/>
        <path className="hill-front" d="M0 213 C156 157 279 239 414 171 C550 104 681 220 900 148 L900 250 L0 250Z"/>
        <path className="landscape-road" d="M405 250 C397 218 475 217 450 192 C429 171 502 168 526 145"/>
        <path className="landscape-tree" d="M126 210v-55m-18 32 18-52 18 52Z M720 202v-49m-15 29 15-45 15 45Z"/>
      </svg>
    </section>

    <section className="login-card-wrap">
      <div className="login-card">
        <div className="login-card-title"><span><LockKeyhole aria-hidden="true"/></span><h2>로그인</h2></div>
        <form onSubmit={submit} className="login-form">
          <label htmlFor="login-email">이메일</label>
          <div className="input-with-icon">
            <Mail aria-hidden="true"/>
            <input id="login-email" type="email" value={email} onChange={event=>{setEmail(event.target.value);setError('')}} autoComplete="username" required/>
          </div>

          <label htmlFor="login-password">비밀번호</label>
          <div className="input-with-icon password-input">
            <LockKeyhole aria-hidden="true"/>
            <input id="login-password" type={showPassword?'text':'password'} value={password} onChange={event=>{setPassword(event.target.value);setError('')}} autoComplete="current-password" placeholder="demo1234" required aria-describedby={error?'login-error':undefined}/>
            <button type="button" className="password-toggle" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'비밀번호 숨기기':'비밀번호 표시'}>{showPassword?<EyeOff aria-hidden="true"/>:<Eye aria-hidden="true"/>}</button>
          </div>

          {error&&<p id="login-error" className="form-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">로그인</button>
        </form>

        <button type="button" className="demo-account" onClick={fillDemo}>
          <span className="demo-account-icon"><UserRound aria-hidden="true"/></span>
          <span><strong>데모 계정으로 시작하기</strong><small>{DEMO_EMAIL}<i aria-hidden="true">|</i>{DEMO_PASSWORD}</small></span>
        </button>
      </div>
    </section>
  </div>;
}
