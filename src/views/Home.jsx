import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'antd';
import 'antd/es/button/style';
import './Home.scss';
import jsdelivr from '@/utils/jsdelivr';
import { useSWRAPI } from '@/hooks/swr';

const imageRow = jsdelivr('/dsr-tools/home/cover_row.jpg', 'dsr-cdn-api');
const imageCol = jsdelivr('/dsr-tools/home/cover_col.jpg', 'dsr-cdn-api');

function Home({ isMobile }) {
  const { data: rawData } = useSWRAPI('/home/index.min.json', false);
  const data = useMemo(() => rawData || { title: '', links: [], license: '' }, [rawData]);

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

Home.propTypes = {
  isMobile: PropTypes.bool,
};

export default Home;
