import { GetStaticProps } from 'next';
import minecraftData from '../data/minecraft.json';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { data: minecraftData },
  };
};

import styles from './minecraft.module.scss';
import { useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import ZButton from '../components/ZButton';
import ZList from '../components/ZList';
import ZCover from '../components/ZCover';

interface MinecraftProps {
  data: typeof minecraftData;
}

function Minecraft({ data }: MinecraftProps) {
  const aboutList = useMemo(() => {
    return (data || { info: [] }).info.map((item) => {
      return { content: item };
    });
  }, [data]);

  const modList = useMemo(() => {
    return (data || { mods: [] }).mods.map((item) => {
      return { title: item[0], content: item[1] };
    });
  }, [data]);

  if (!data) {
    return (
      <div className={styles.container}>
        <ZCover type='error' />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.image}>
            <Image
              src='/images/minecraft.png'
              layout='fill'
              objectFit='cover'
            />
          </div>
          <div className={styles.download}>
            <div className={clsx(styles.version, 'markdown')}>
              <code>{data.version}</code> <code>{data.release}</code>
            </div>
            <ZButton className={styles.btn} type='primary' href={data.download}>
              下载整合包
            </ZButton>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.ctitle}>关于整合</div>
          <ZList className={styles.ccontent} list={aboutList} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.ctitle}>版本信息</div>
          <ZList dense className={styles.ccontent} list={modList} inline />
        </div>
      </div>
    </div>
  );
}

export default Minecraft;
