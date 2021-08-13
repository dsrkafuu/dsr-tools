import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { timeZonesNames } from '@vvo/tzdb';
import './TZSelector.scss';

const TZSelector = memo(({ value, onChange }) => {
  // 有效的时区
  const validValue = useMemo(() => {
    return timeZonesNames.includes(value) ? value : 'Asia/Shanghai';
  }, [value]);

  return (
    <Select
      className='tz-selector'
      showSearch
      placeholder={value}
      value={validValue}
      onChange={onChange}
    >
      {timeZonesNames.map((tz) => (
        <Select.Option key={tz} value={tz}>
          {tz}
        </Select.Option>
      ))}
    </Select>
  );
});

TZSelector.displayName = 'TZSelector';
TZSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default TZSelector;
