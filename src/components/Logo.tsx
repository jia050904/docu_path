import {Link} from 'react-router-dom';
import logoUrl from '../assets/seoryugil-logo.svg';

export function Logo(){return <Link to="/" className="logo" aria-label="서류길 홈"><img className="logo-mark" src={logoUrl} alt="" aria-hidden="true"/><strong>서류길</strong></Link>}
