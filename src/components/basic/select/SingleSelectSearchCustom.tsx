import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Button, Menu, Tooltip, MenuProps } from 'antd';
import { ReactComponent as NotFoundSvg } from '@/assets/icons/ic_not_found_select.svg';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search_select.svg';
import { ReactComponent as RedTickSvg } from '@/assets/icons/ic_red_tick.svg';
import { ReactComponent as DownSvg } from '@/assets/icons/ic-chevron-down.svg';

import { MyInput } from '../input';
import './style.less';
export interface Option {
  label: string;
  value: string;
}

interface SingleSelectSearchCustomProps {
  options: Option[];
  value?: string;
  defaultOption?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  maxWidth?: string;
  classButon?: string;
}

const SingleSelectSearchCustom: React.FC<SingleSelectSearchCustomProps> = ({
  options,
  value = undefined,
  defaultOption,
  onChange,
  prefix,
  style,
  placeholder = 'Select',
  disabled = false,
  className = '',
  maxWidth = '150px',
  classButon,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    value
  );
  const [sortOption, setSortOption] = useState<Option[] | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
    } else {
      setSelectedOption(undefined);
    }
  }, [value]);

  useEffect(() => {
    if (defaultOption) {
      setSelectedOption(defaultOption);
    } else {
      setSelectedOption(undefined);
    }
  }, [defaultOption]);

  // const filteredOptions = options.filter(option =>
  //   option?.label?.toLowerCase().includes(searchTerm?.toLowerCase())
  // );
  const filteredOptions = options
    .filter(option =>
      option?.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    .sort((a, b) =>
      a.value === selectedOption ? -1 : b.value === selectedOption ? 1 : 0
    );

  const handleMenuItemClick = (option: Option) => {
    setSelectedOption(option.value);
    // console.log('option value', option.value);
    // console.log('options', options);
    onChange?.(option.value);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDropdownOpen(true);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!filteredOptions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleMenuItemClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && menuRef.current) {
      const menuElement = menuRef.current;
      const highlightedElement = menuElement.children[
        highlightedIndex
      ] as HTMLElement;

      if (highlightedElement) {
        const menuRect = menuElement.getBoundingClientRect();
        const elementRect = highlightedElement.getBoundingClientRect();

        if (elementRect.bottom > menuRect.bottom) {
          menuElement.scrollTop += elementRect.bottom - menuRect.bottom;
        } else if (elementRect.top < menuRect.top) {
          menuElement.scrollTop -= menuRect.top - elementRect.top;
        }
      }
    }
  }, [highlightedIndex]);
  useEffect(() => {
    console.log('check searchTerm', searchTerm);
    console.log('filteredOptions', filteredOptions);
    console.log('sortOption', sortOption);
  }, [searchTerm]);
  const items = [
    {
      key: 'search',
      label: (
        <div onClick={handleInputClick}>
          <MyInput
            placeholder="Search"
            className="input-search-select"
            value={searchTerm}
            allowClear
            onChange={e => {
              console.log('ec', e.target.value);
              if (e && typeof e.stopPropagation === 'function') {
                e.stopPropagation();
              }
              setSearchTerm(e.target.value);
            }}
            onClear={handleClearSearch}
            onClick={handleInputClick}
            onFocus={() => setDropdownOpen(true)}
            suffix={!searchTerm && <SearchSvg />}
          />
        </div>
      ),
    },
    {
      key: 'options',
      label: (
        <div className="menu-item-action" ref={menuRef}>
          {filteredOptions.length === 0 ? (
            <div className="not-found-select">
              <NotFoundSvg width={105} height={87} />
              <span>No data found</span>
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`single menu-item ${
                  selectedOption === option.value ? 'selected' : ''
                } ${highlightedIndex === index ? 'highlighted' : ''}`}
                onClick={() => handleMenuItemClick(option)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor:
                    highlightedIndex === index ? '#FDECF0' : 'inherit',
                }}>
                <span>{option.label}</span>
                {selectedOption === option.value && (
                  <RedTickSvg className="red-tick-icon" />
                )}
              </div>
            ))
          )}
        </div>
      ),
    },
  ];
  const handleSortOption = (visible: boolean) => {
    if (visible) {
      console.log('đã vào sort');

      const checkedItem = options.filter(item => item.value === selectedOption);
      const uncheckedItem = options.filter(
        item => item.value !== selectedOption
      );
      setSortOption([...checkedItem, ...uncheckedItem]);
    }
  };
  return (
    <div
      className={`my-select ${className}`}
      style={style}
      onKeyDown={isDropdownOpen ? handleKeyDown : undefined}>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        open={isDropdownOpen}
        onOpenChange={visible => {
          setDropdownOpen(visible);
          if (!visible) {
            setHighlightedIndex(-1);
          }
          // handleSortOption(visible);
        }}
        disabled={disabled}>
        <Button className={classButon}>
          <div className={`selected-tag`}>
            {prefix && <p>{prefix}</p>}
            <Tooltip
              title={
                selectedOption
                  ? options.find(option => option.value === selectedOption)
                      ?.label
                  : 'N/A'
              }>
              <span
                style={{
                  color: selectedOption ? '#44403C' : '#A8A29E',
                  // maxWidth: '50px',
                  maxWidth: maxWidth,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                }}>
                {selectedOption
                  ? options.find(option => option.value === selectedOption)
                      ?.label
                  : disabled
                  ? '-'
                  : placeholder}
              </span>
            </Tooltip>
          </div>
          <DownSvg width={14} height={14} />
        </Button>
      </Dropdown>
    </div>
  );
};

export default SingleSelectSearchCustom;
