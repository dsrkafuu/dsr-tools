import React from 'react';
import { Row, Col, Card, Image, Carousel, List, Button, Alert } from 'antd';
import 'antd/es/row/style';
import 'antd/es/col/style';
import 'antd/es/card/style';
import 'antd/es/image/style';
import 'antd/es/carousel/style';
import 'antd/es/list/style';
import 'antd/es/button/style';
import 'antd/es/alert/style';
import './Minecraft.scss';
import Loading from '@/components/Loading';
import { useSWRAPI } from '@/hooks/swr';
import jsdelivr from '@/utils/jsdelivr';
import { IMAGE_FALLBACK } from '@/utils/constants';

function Minecraft() {
  const { data, error } = useSWRAPI('/minecraft/index.min.json', false);
  const isLoading = Boolean(!data && !error);
  const isError = Boolean(error);

  return (
    <Loading isLoading={isLoading} isError={isError}>
      <div className='mc'>
        <Row gutter={[32, 32]}>
          <Col className='mc__card' xs={24} md={12}>
            <Alert message={`更新日期：${data?.date}`} type='success' showIcon={true} />
            <Card>
              <div className='preview'>
                <Carousel autoplay>
                  {data?.slides.map((pic, idx) => {
                    return (
                      <div key={pic}>
                        <Image
                          className='preview__image'
                          alt={`Preview Image ${idx}`}
                          src={jsdelivr(`/dsr-tools/minecraft/${pic}`, 'dsr-cdn-api')}
                          fallback={IMAGE_FALLBACK}
                          preview={false}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
              <div className='download'>
                <Button
                  size='large'
                  type='primary'
                  block={true}
                  href={data?.download}
                  target='_blank'
                >
                  下载
                </Button>
              </div>
            </Card>
            <Card title='关于整合'>
              <List
                size='small'
                dataSource={data?.info}
                renderItem={(item) => (
                  <List.Item className='list__item'>
                    <span dangerouslySetInnerHTML={{ __html: item }}></span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col className='mc__card' xs={24} md={12}>
            <Card title='版本信息'>
              <List
                size='small'
                dataSource={data?.mods}
                renderItem={(item) => (
                  <List.Item className='list__item'>
                    <span>{item}</span>
                  </List.Item>
                )}
              />
            </Card>
            <Card title='相关链接'>
              <div className='blist'>
                {data?.links?.map((link) => (
                  <Button className='blist__item' key={link[1]} href={link[1]} target='_blank'>
                    {link[0]}
                  </Button>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Loading>
  );
}

export default Minecraft;
