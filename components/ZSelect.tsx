import Select, {
  Props,
  ThemeConfig,
  StylesConfig,
  GroupBase,
} from 'react-select';

const customTheme: ThemeConfig = (theme) => ({
  ...theme,
  borderRadius: 2,
  colors: {
    ...theme.colors,
    primary: 'var(--color-primary)',
    primary75: 'var(--color-transparent-active)',
    primary50: 'var(--color-transparent-active)',
    primary25: 'var(--color-transparent-active)',
    danger: 'var(--color-danger)',
    dangerLight: 'transparent',
    neutral0: 'transparent',
    neutral5: 'transparent',
    neutral10: 'transparent',
    neutral20: 'transparent',
    neutral30: 'transparent',
    neutral40: 'transparent',
    neutral50: 'transparent',
    neutral60: 'transparent',
    neutral70: 'transparent',
    neutral80: 'transparent',
    neutral90: 'transparent',
  },
});

const customStyles: StylesConfig<unknown, boolean, GroupBase<unknown>> = {
  control: (base, state) => {
    return {
      ...base,
      height: '32px',
      minHeight: '32px',
      backgroundColor: 'var(--color-wrapper)',
      border: state.isFocused
        ? '2px solid var(--color-primary)'
        : '2px solid transparent',
      borderRadius: '2px',
      boxShadow: 'none',
      transition: 'background-color 100ms ease',
      cursor: 'text',
    };
  },
  valueContainer: (base) => {
    return {
      ...base,
      paddingRight: '3px',
    };
  },
  singleValue: (base) => {
    return {
      ...base,
      color: 'var(--color-font)',
    };
  },
  input: (base) => {
    return {
      ...base,
      color: 'var(--color-font)',
    };
  },
  indicatorSeparator: (base) => {
    return {
      ...base,
      display: 'none',
    };
  },
  menu: (base) => {
    return {
      ...base,
      border: 'none',
      boxShadow: 'var(--box-shadow)',
      backgroundColor: 'var(--color-bg)',
      borderRadius: '2px',
      overflow: 'hidden',
    };
  },
  menuList: (base) => {
    return {
      ...base,
      padding: 0,
    };
  },
  dropdownIndicator: (base) => {
    return {
      ...base,
      color: 'var(--color-font)',
      padding: '6px',
      paddingLeft: '3px',
      paddingTop: '4px',
      ':hover': {
        color: 'var(--color-font)',
      },
    };
  },
  option: (base, state) => {
    return {
      ...base,
      color: state.isSelected ? '#fdfdfd' : 'inherit',
      backgroundColor: state.isSelected
        ? 'var(--color-primary)'
        : state.isFocused
        ? 'var(--color-transparent-active)'
        : 'transparent',
      cursor: 'pointer',
    };
  },
};

function ZSelect({ ...props }: Props) {
  return <Select theme={customTheme} styles={customStyles} {...props} />;
}

export default ZSelect;
