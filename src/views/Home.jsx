import './Home.scss';
import 'antd/es/button/style';
import { useMemo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import jsdelivr from '@/utils/jsdelivr';
import responsive from '@/utils/responsive';
import { useSWRAPI } from '@/hooks/swr';

const imageRow = jsdelivr('/dsr-tools/home/cover_row.jpg', 'dsr-cdn-api');
const imageCol = jsdelivr('/dsr-tools/home/cover_col.jpg', 'dsr-cdn-api');

function Home() {
  const [isMobile, setIsMobile] = useState(() => responsive() === 'sm');
  const { data: rawData } = useSWRAPI('/home/index.min.json', false);
  const data = useMemo(() => rawData || { title: '', links: [], license: '' }, [rawData]);

  // react screen size change
  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(responsive() === 'sm');
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div
      className={classNames('home', { 'home--mobile': isMobile })}
      style={{ backgroundImage: `url(${isMobile ? imageCol : imageRow})` }}
    >
      <h1 className='home__title'>{data.title}</h1>
      <div className='home__links'>
        {data.links.map((link) => (
          <Button key={link.src} size='large' ghost={true} href={link.src} target='_blank'>
            {link.name}
          </Button>
        ))}
      </div>
      <div className='home__license'>{data.license}</div>
    </div>
  );
}

export default Home;
