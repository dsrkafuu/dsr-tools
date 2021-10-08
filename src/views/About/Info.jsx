import React from 'react';
import { Row, Col, Card, Image, Collapse, List } from 'antd';
import 'antd/es/row/style';
import 'antd/es/col/style';
import 'antd/es/card/style';
import 'antd/es/image/style';
import 'antd/es/collapse/style';
import 'antd/es/list/style';
import {
  PaperClipOutlined,
  FileTextOutlined,
  TwitterOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import './Info.scss';
import jsdelivr from '@/utils/jsdelivr';
import statements from '@/assets/statements';
import { dependencies } from '@/../package.json';
import { IMAGE_FALLBACK } from '@/utils/constants';

function Personal() {
  return (
    <div className='personal'>
      <img
        className='personal__avatar'
        alt='Personal Avatar'
        src={jsdelivr('/images/avatars/dsrkafuu_256p.jpg', 'dsr-cdn-main')}
      />
      <span className='personal__id'>DSRKafuU</span>
    </div>
  );
}

function Info() {
  const deps = { ...dependencies };

  return (
    <div className='info'>
      <Row gutter={[32, 32]}>
        <Col className='info__card' xs={24} md={12}>
          <Card
            className='personal__card'
            cover={<Personal />}
            actions={[
              <a href='https://dsrkafuu.su' key='homepage' target='_blank'>
                <PaperClipOutlined />
              </a>,
              <a href='https://blog.dsrkafuu.su' key='blog' target='_blank'>
                <FileTextOutlined />
              </a>,
              <a href='https://twitter.com/dsrkafuu' key='twitter' target='_blank'>
                <TwitterOutlined />
              </a>,
              <a href='https://githuib.com/dsrkafuu' key='github' target='_blank'>
                <GithubOutlined />
              </a>,
            ]}
          >
            <Image
              className='personal__image'
              alt='Personal Image'
              src={jsdelivr('/images/banners/84199396.jpg', 'dsr-cdn-main')}
              fallback={IMAGE_FALLBACK}
            />
          </Card>
          <Card title='版权信息'>
            <Collapse ghost={true}>
              {statements.map((item, idx) => (
                <Collapse.Panel header={item.title} key={idx}>
                  {item.contents.map((val, idx) => (
                    <p key={idx}>{val}</p>
                  ))}
                </Collapse.Panel>
              ))}
            </Collapse>
          </Card>
        </Col>
        <Col className='info__card' xs={24} md={12}>
          <Card title='开源许可'>
            <List
              size='small'
              dataSource={Object.keys(deps)}
              renderItem={(key) => (
                <List.Item className='opensource__item'>
                  <span>{key}</span>
                  <span>{deps[key]}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Info;
