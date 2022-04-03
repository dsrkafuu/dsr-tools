import styles from './ZList.module.scss';
import clsx from 'clsx';

interface ZListItem {
  title?: string;
  content: React.ReactNode;
}

interface ZListProps {
  list: ZListItem[];
  dense?: boolean;
  inline?: boolean;
  className?: string;
}

function ZList({ list, dense, inline, className }: ZListProps) {
  return (
    <div
      className={clsx(
        styles.container,
        { [styles.dense]: dense },
        { [styles.inline]: inline },
        className
      )}
    >
      {list.map((item, idx) => {
        let titleRender: React.ReactNode = item.title;
        if (!titleRender) {
          titleRender = null;
        } else {
          titleRender = <span className={styles.title}>{titleRender}</span>;
        }

        let contentRender: React.ReactNode = item.content;
        if (!contentRender) {
          contentRender = null;
        } else if (typeof contentRender === 'string') {
          const paras = contentRender.split('\n');
          contentRender = paras.map((para, idx) => <p key={idx}>{para}</p>);
        } else {
          contentRender = <p>{contentRender}</p>;
        }

        return (
          <div
            className={clsx(styles.section, 'markdown')}
            key={item.title || idx.toString()}
          >
            {titleRender}
            {contentRender}
          </div>
        );
      })}
    </div>
  );
}

export default ZList;
