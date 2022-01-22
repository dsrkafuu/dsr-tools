import styles from './ZMessage.module.scss';
import clsx from 'clsx';

/**
 * https://codepen.io/delbertbeta/pen/VRxxgM/
 */
class CubicBezier {
  _px3: number;
  _px2: number;
  _px1: number;
  _py3: number;
  _py2: number;
  _py1: number;
  _epsilon = 1e-7; // 目标精度

  constructor(a: number, b: number, c: number, d: number) {
    this._px3 = 3 * a;
    this._px2 = 3 * (c - a) - this._px3;
    this._px1 = 1 - this._px3 - this._px2;
    this._py3 = 3 * b;
    this._py2 = 3 * (d - b) - this._py3;
    this._py1 = 1 - this._py3 - this._py2;
  }
  _getX(t: number) {
    return ((this._px1 * t + this._px2) * t + this._px3) * t;
  }
  _getY(t: number) {
    return ((this._py1 * t + this._py2) * t + this._py3) * t;
  }

  /**
   * 通过进度计算带曲线的进度
   * @param x 范围 0~1 的进度值
   */
  solve(x: number) {
    if (x < 0 || x > 1) {
      return x;
    }
    // 对 0 和 1 两个特殊 t 不做计算
    if (x === 0 || x === 1) {
      return this._getY(x);
    }
    let t = x;
    for (let i = 0; i < 8; i++) {
      // 进行 8 次迭代
      const g = this._getX(t) - x;
      if (Math.abs(g) < this._epsilon) {
        // 检测误差到可以接受的范围
        return this._getY(t);
      }
      const d = (3 * this._px1 * t + 2 * this._px2) * t + this._px3; // 对 x 求导
      if (Math.abs(d) < 1e-6) {
        // 如果梯度过低，说明牛顿迭代法无法达到更高精度
        break;
      }
      t = t - g / d;
    }
    return this._getY(t); // 对得到的近似 t 求 y
  }
}

interface ZMessageProps {
  type: 'info' | 'success' | 'error';
  message: string;
}

class ZMessage {
  _cubic = new CubicBezier(0.25, 0.1, 0.25, 1); // CSS Ease
  _container = document.getElementById('message');
  _el: HTMLDivElement | null = null;

  constructor({ type, message }: ZMessageProps) {
    const el = document.createElement('div');
    el.className = clsx(styles.message, {
      [styles.info]: type === 'info',
      [styles.success]: type === 'success',
      [styles.error]: type === 'error',
    });
    el.textContent = message;
    el.style.opacity = '0';
    this._el = el;

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" fill="currentColor" width="1em" height="1em"><defs><style>.fa-secondary{opacity:.4}</style></defs><path d="M9.21,356.07a31.46,31.46,0,0,0,0,44.48l22.24,22.24a31.46,31.46,0,0,0,44.48,0L176,322.72,109.28,256ZM342.79,111.45,320.55,89.21a31.46,31.46,0,0,0-44.48,0L176,189.28,242.72,256,342.79,155.93a31.46,31.46,0,0,0,0-44.48Z" class="fa-secondary"/><path d="M342.79,356.07a31.46,31.46,0,0,1,0,44.48l-22.24,22.24a31.46,31.46,0,0,1-44.48,0L9.21,155.93a31.46,31.46,0,0,1,0-44.48L31.45,89.21a31.46,31.46,0,0,1,44.48,0Z" class="fa-primary"/></svg>`;
    closeBtn.className = styles.close;
    closeBtn.addEventListener('click', () => {
      this.unmount();
    });
    el.appendChild(closeBtn);
  }

  mount() {
    if (this._container && this._el) {
      this._container.appendChild(this._el);

      const totalDuration = 100;
      let start: number;
      let preTimeStamp: number;
      const step = (timestamp: number) => {
        if (start === undefined) {
          start = timestamp;
        }
        const elapsed = timestamp - start;
        if (preTimeStamp !== timestamp) {
          const newOpacity = this._cubic.solve(
            Math.min(elapsed / totalDuration, 1)
          );
          this._el && (this._el.style.opacity = `${newOpacity}`);
        }
        // stop the animation after 100ms
        if (elapsed < totalDuration) {
          preTimeStamp = timestamp;
          window && window.requestAnimationFrame(step);
        }
      };
      window && window.requestAnimationFrame(step);
    }
  }

  unmount() {
    if (
      this._container &&
      this._el &&
      this._el.parentNode === this._container
    ) {
      const totalDuration = 100;
      let start: number;
      let preTimeStamp: number;
      const step = (timestamp: number) => {
        if (start === undefined) {
          start = timestamp;
        }
        const elapsed = timestamp - start;
        if (preTimeStamp !== timestamp) {
          const newOpacity =
            1 - this._cubic.solve(Math.min(elapsed / totalDuration, 1));
          this._el && (this._el.style.opacity = `${newOpacity}`);
        }
        // stop the animation after 100ms
        if (elapsed < totalDuration) {
          preTimeStamp = timestamp;
          window && window.requestAnimationFrame(step);
        }
      };
      window && window.requestAnimationFrame(step);

      setTimeout(() => {
        this._container && this._el && this._container.removeChild(this._el);
      }, totalDuration);
    }
  }
}

export const message = {
  info: (message: string) => {
    const msg = new ZMessage({ type: 'info', message });
    msg.mount();
    setTimeout(() => msg.unmount(), 5000);
  },
  success: (message: string) => {
    const msg = new ZMessage({ type: 'success', message });
    msg.mount();
    setTimeout(() => msg.unmount(), 5000);
  },
  error: (message: string) => {
    const msg = new ZMessage({ type: 'error', message });
    msg.mount();
    setTimeout(() => msg.unmount(), 5000);
  },
};

export default ZMessage;
