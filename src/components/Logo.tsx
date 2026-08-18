import {FileText} from 'lucide-react'; import {Link} from 'react-router-dom';
export function Logo(){return <Link to="/" className="logo" aria-label="서류길 홈"><span className="logo-mark"><FileText size={22}/></span><strong>서류길</strong></Link>}
