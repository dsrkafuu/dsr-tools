import './Footer.scss';
import { CopyrightOutlined } from '@ant-design/icons';
import dayjs from '@/utils/dayjs';
import { version } from '@/assets/changelog';
import { ReactComponent as ReactIcon } from '@/assets/svg/react.svg';

function Footer() {
  return (
    <div className='footer'>
      <span>DSRToolS {version}</span>
      <span>
        Copyright <CopyrightOutlined /> {dayjs().year()} DSRKafuU
      </span>
      <ReactIcon className='footer__icon' />
    </div>
  );
}

export default Footer;
