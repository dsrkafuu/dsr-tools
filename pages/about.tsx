import styles from './about.module.scss';
import Image from 'next/image';
import ZList from '../components/ZList';
import pkg from '../package.json';
import ZButton from '../components/ZButton';

const licenseList = [
  {
    title: 'Minecraft',
    content: `Minecraft is a registered trademark of Mojang Synergies AB.
以任何方式散布修改版 Minecraft 客户端的行为本身违反《Minecraft最终用户许可协议》，且整合包本身也具有安全隐患问题。本网站对于整合包对您的计算机造成的一切后果概不负责，且对本页面的一切内容随时保留应 Mojang AB、微软公司或 Mod 作者的要求采取删除等行为的权力。`,
  },
  {
    title: 'FINAL FANTASY XIV',
    content: `© SQUARE ENIX CO., LTD. All Rights Reserved.
FINAL FANTASY, FINAL FANTASY XIV, FFXIV, SQUARE ENIX, and the SQUARE ENIX logo are registered trademarks or trademarks of Square Enix Holdings Co., Ltd.
SHADOWBRINGERS, STORMBLOOD, HEAVENSWARD, and A REALM REBORN are registered trademarks or trademarks of Square Enix Co., Ltd.
上海数龙科技有限公司 版权所有`,
  },
];

const dependencies = pkg.dependencies;
const depsList = (
  Object.keys(dependencies) as Array<keyof typeof dependencies>
).map((dep) => {
  return {
    title: dep,
    content: dependencies[dep],
  };
});

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.image}>
          <Image
            src='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@9.0.0/opengraph/dsrkafuu.png'
            layout='fill'
            objectFit='cover'
          />
        </div>
        <div className={styles.info}>
          <ZButton
            type='primary'
            className={styles.infoBtn}
            href='https://dsrkafuu.net'
          >
            主页
          </ZButton>
          <ZButton
            type='primary'
            className={styles.infoBtn}
            href='https://blog.dsrkafuu.net'
          >
            博客
          </ZButton>
          <ZButton
            type='primary'
            className={styles.infoBtn}
            href='https://design.dsrkafuu.net'
          >
            设计
          </ZButton>
        </div>
        <ZList list={licenseList} />
      </div>
      <div className={styles.right}>
        <ZList list={depsList} inline />
      </div>
    </div>
  );
}

export default About;
