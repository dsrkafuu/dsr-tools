import styles from './katacode.module.scss';
import { useCallback, useState } from 'react';
import { message } from '../components/ZMessage';
import ZButton from '../components/ZButton';
import ZTextArea from '../components/ZTextArea';
import ZList from '../components/ZList';
import { encodeKata, decodeKata } from '../utils/katacode';
import { ChevronLeft, ChevronRight, Trash } from '../icons';

const infoList = [
  {
    title: '密文格式',
    content: (
      <>
        请注意相同的明文可能会产生不同的密文，例如密文 <code>ィゾヮイダ</code>和{' '}
        <code>ィゾヲイダ</code> 均对应明文 <code>12</code>
      </>
    ),
  },
  {
    title: '数据支持',
    content: '支持任意格式 Unicode 字符，例如 emoji 表情等',
  },
  {
    title: '免责声明',
    content: '本站点作者 DSRKafuU 不对使用此工具造成的任何结果负相关法律责任',
  },
];

function KataCode() {
  const [srcValue, setSrcValue] = useState('');
  const [encValue, setEncValue] = useState('');

  const clearValue = useCallback(() => {
    setSrcValue('');
    setEncValue('');
    message.info('已清空内容');
  }, []);
  const encodeValue = useCallback(async (val = '') => {
    try {
      const res = await encodeKata(val);
      setEncValue(res);
      message.success('加密成功');
    } catch {
      message.error('加密失败 请检查输入字符');
    }
  }, []);
  const decodeValue = useCallback(async (val = '') => {
    try {
      val = val.trim();
      const res = await decodeKata(val);
      setSrcValue(res);
      message.success('解密成功');
    } catch {
      message.error('解密失败 请检查输入字符');
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.card}>
          <ZTextArea
            className={styles.input}
            value={srcValue}
            onChange={(e) => setSrcValue(e.target.value)}
          />
        </div>
        <div className={styles.control}>
          <ZButton
            className={styles.btn}
            type='primary'
            onClick={() => encodeValue(srcValue)}
            icon={<ChevronRight />}
          >
            加密
          </ZButton>
          <ZButton
            className={styles.btn}
            type='primary'
            onClick={() => decodeValue(encValue)}
            icon={<ChevronLeft />}
          >
            解密
          </ZButton>
          <ZButton
            className={styles.btn}
            type='danger'
            onClick={clearValue}
            icon={<Trash />}
          >
            清空
          </ZButton>
        </div>
        <div className={styles.card}>
          <ZTextArea
            className={styles.input}
            value={encValue}
            onChange={(e) => setEncValue(e.target.value)}
          />
        </div>
      </div>
      <ZList className={styles.notice} list={infoList} />
    </div>
  );
}

export default KataCode;
