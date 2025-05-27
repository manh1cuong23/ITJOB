import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Checkbox, Button, Tooltip, MenuProps } from 'antd';
import { ReactComponent as DropdownSvg } from '@/assets/icons/ic_dropdown.svg';
import { ReactComponent as NotFoundSvg } from '@/assets/icons/ic_not_found_select.svg';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search_select.svg';
import { MyInput } from '../input';
import { ReactComponent as RedTickSvg } from '@/assets/icons/ic_red_tick.svg';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectWithSearchProps {
  options: Option[];
  value?: string[] | '';
  onChange?: (value: string[]) => void;
  maxTagCount?: number;
  placeholder?: string;
  prefix?: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  showCheckbox?: boolean;
  disabled?: boolean;
  nameSort?: boolean;
  onBlur?: () => void;
  maxWidth?: string;
  defaultOption?: any[];
  reset?: boolean;
  classButon?: string;
}

const MultiSelectWithSearchAdd: React.FC<MultiSelectWithSearchProps> = ({
  options,
  maxTagCount = 1,
  placeholder,
  value,
  onChange,
  prefix,
  style,
  className = '',
  showCheckbox = true,
  disabled = false,
  onBlur,
  maxWidth = '280px',
  defaultOption,
  classButon,
  reset = false,
}) => {
  const allOptions = options;
  const [selectedOptions, setSelectedOptions] = useState<string[] | 'All'>(
    value || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<Option[] | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [addValue, setAddValue] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);

  const getSelectedLabels = (values: string[]) => {
    return values.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  };

  useEffect(() => {
    if (reset) {
      setSelectedOptions([]);
    }
  }, [reset]);

  const getTotalItems = () => {
    return searchTerm ? filteredOptions.length : filteredOptions.length + 1;
  };

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedOptions(value);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options]);

  // const filteredOptions = options.filter(option =>
  //   option?.label?.toLowerCase().includes(searchTerm?.toLowerCase())
  // );
  const filteredOptions = options
    .filter(option =>
      option?.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    .sort((a, b) =>
      Array.isArray(selectedOptions) && selectedOptions.includes(a.value)
        ? -1
        : Array.isArray(selectedOptions) && selectedOptions.includes(b.value)
        ? 1
        : 0
    );

  const scrollIntoView = (
    element: HTMLElement | null,
    menuElement: HTMLElement
  ) => {
    if (!element) return;

    const menuRect = menuElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const topGap = 4;
    const bottomGap = 4;

    if (elementRect.bottom + bottomGap > menuRect.bottom) {
      const scrollDistance = elementRect.bottom - menuRect.bottom + bottomGap;
      menuElement.scrollBy({ top: scrollDistance, behavior: 'smooth' });
    } else if (elementRect.top - topGap < menuRect.top) {
      const scrollDistance = elementRect.top - menuRect.top - topGap;
      menuElement.scrollBy({ top: scrollDistance, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isDropdownOpen || highlightedIndex < 0) return;

    const menuElement = menuRef.current;
    if (!menuElement) return;

    requestAnimationFrame(() => {
      if (!searchTerm && highlightedIndex === 0) {
        scrollIntoView(selectAllRef.current, menuElement);
      } else {
        const optionIndex = searchTerm
          ? highlightedIndex
          : highlightedIndex - 1;
        const optionElement = optionsRef.current[optionIndex];
        scrollIntoView(optionElement, menuElement);
      }
    });
  }, [highlightedIndex, isDropdownOpen, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = getTotalItems();
    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex < totalItems - 1 ? prevIndex + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex === 0 && !searchTerm) {
          handleSelectAll();
        } else {
          const actualIndex = searchTerm
            ? highlightedIndex
            : highlightedIndex - 1;
          if (actualIndex >= 0 && actualIndex < filteredOptions.length) {
            handleMenuItemClick(filteredOptions[actualIndex]);
          }
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

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
      onChange?.([]);
    } else {
      const allValues = allOptions.map(option => option.value);
      setSelectedOptions(allValues);
      onChange?.(allValues);
    }
  };

  useEffect(() => {
    renderSelectedOptions();
  }, [options, value]);

  const renderSelectedOptions = () => {
    if (
      selectedOptions.length === options.length ||
      selectedOptions === 'All'
    ) {
      return 'All';
    }

    if (!Array.isArray(selectedOptions)) {
      return '';
    }

    const selectedLabels = getSelectedLabels(selectedOptions);

    if (selectedOptions.length <= maxTagCount) {
      const text = selectedLabels.join(', ');
      // return needsTruncation(text) ? `${selectedLabels[0]}...` : text;
      return text;
    }

    const visibleLabels = selectedLabels.slice(0, maxTagCount);
    const hiddenCount = selectedOptions.length - maxTagCount;
    const visibleText = visibleLabels.join(', ');

    return (
      <div className="label-result">
        <span
          ref={labelRef}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {visibleText}
        </span>
        {hiddenCount > 0 && <span className="hidden-count">{hiddenCount}</span>}
      </div>
    );
  };

  const handleMenuItemClick = (option: Option) => {
    if (typeof selectedOptions === 'string' && selectedOptions === 'All') {
      setSelectedOptions([option.value]);
      onChange?.([option.value]);
      return;
    }

    const isSelected =
      Array.isArray(selectedOptions) && selectedOptions.includes(option.value);
    const newSelectedOptions = isSelected
      ? selectedOptions.filter(selected => selected !== option.value)
      : [
          ...(Array.isArray(selectedOptions) ? selectedOptions : []),
          option.value,
        ];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDropdownOpen(true);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, filteredOptions.length);
  }, [filteredOptions]);

  const getMenuStyle = () => {
    const optionCount = filteredOptions.length;
    const hasSelectAll = !searchTerm;
    const totalItems = hasSelectAll ? optionCount + 1 : optionCount;

    const itemHeight = 40;
    const maxVisibleItems = 8;
    const contentHeight = totalItems * itemHeight;
    const needsScroll = totalItems > maxVisibleItems;

    return {
      maxHeight: needsScroll ? `${maxVisibleItems * itemHeight}px` : 'auto',
      overflowY: needsScroll ? 'scroll' : 'visible',
      overflowX: 'hidden',
    };
  };
  const handleAddItem = () => {
    const newValue: Option = {
      label: searchTerm,
      value: searchTerm,
    };
    options.unshift(newValue);
    handleClearSearch();
  };
  const items: MenuProps['items'] = [
    {
      key: 'Add',
      label: (
        <div
          onClick={handleInputClick}
          className="flex items-center gap-[16px] mr-[12px]">
          <div className="flex-1">
            <div onClick={handleInputClick}>
              <MyInput
                placeholder="Search"
                className="input-search-select"
                value={searchTerm}
                allowClear
                onChange={e => {
                  e.stopPropagation();
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onClear={handleClearSearch}
                onFocus={() => setDropdownOpen(true)}
                onClick={handleInputClick}
                suffix={!searchTerm && <SearchSvg />}
              />
            </div>
          </div>
          <div
            className="py-2 px-4 hover:bg-gray-100 rounded-lg border mt-[12px]"
            onClick={handleAddItem}>
            + Thêm trường
          </div>
        </div>
      ),
    },
    {
      key: 'selectAll',
      label: !searchTerm && (
        <div
          ref={selectAllRef}
          onClick={e => {
            e.stopPropagation();
            handleSelectAll();
          }}
          className={`menu-item ${
            selectedOptions.length === options.length ? 'selected' : ''
          } ${!searchTerm && highlightedIndex === 0 ? 'highlighted' : ''}`}
          style={{
            backgroundColor:
              !searchTerm && highlightedIndex === 0 ? '#FDECF0' : 'inherit',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            paddingRight: options.length > 5 ? 18 : 8,
          }}>
          <span>Select All</span>
          {showCheckbox ? (
            <Checkbox
              checked={selectedOptions.length === options.length}
              onChange={e => e.stopPropagation()}
            />
          ) : (
            selectedOptions.length === options.length && <RedTickSvg />
          )}
        </div>
      ),
      style: { display: searchTerm ? 'none' : 'block' },
    },
    {
      key: 'divider',
      label: <div className="divider"></div>,
    },
    {
      key: 'checkboxes',
      label: (
        <div
          ref={menuRef}
          className="menu-container"
          style={{ maxHeight: '290px', overflowY: 'auto' }}>
          <Checkbox.Group
            value={
              selectedOptions === 'All'
                ? allOptions.map(option => option.value)
                : selectedOptions
            }
            onChange={checkedValues => {
              setSelectedOptions(checkedValues as string[]);
              onChange?.(checkedValues as string[]);
            }}
            style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredOptions.length === 0 ? (
              <div className="not-found-select">
                <NotFoundSvg width={105} height={87} />
                <span>No data found</span>
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  ref={el => (optionsRef.current[index] = el)}
                  className={`menu-item ${
                    Array.isArray(selectedOptions) &&
                    selectedOptions.includes(option.value)
                      ? 'selected'
                      : ''
                  } ${
                    highlightedIndex === (searchTerm ? index : index + 1)
                      ? 'highlighted'
                      : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    handleMenuItemClick(option);
                  }}
                  style={{
                    backgroundColor:
                      highlightedIndex === (searchTerm ? index : index + 1)
                        ? '#FDECF0'
                        : 'inherit',
                  }}>
                  <span>{option.label}</span>
                  {showCheckbox ? (
                    <Checkbox
                      checked={
                        Array.isArray(selectedOptions) &&
                        selectedOptions.includes(option.value)
                      }
                      value={option.value}
                      onChange={() => handleMenuItemClick(option)}
                    />
                  ) : (
                    Array.isArray(selectedOptions) &&
                    selectedOptions.includes(option.value) && <RedTickSvg />
                  )}
                </div>
              ))
            )}
          </Checkbox.Group>
        </div>
      ),
    },
  ];

  const handleSortOptions = (visible: boolean) => {
    if (visible) {
      if (Array.isArray(selectedOptions)) {
        const checkedItems = options.filter(item =>
          selectedOptions.includes(item.value)
        );
        const uncheckedItems = options.filter(
          item => !selectedOptions.includes(item.value)
        );
        setSortOptions([...checkedItems, ...uncheckedItems]);
      }
    }
  };

  const handleDropdownBlur = (visible: boolean) => {
    if (!visible) {
      onBlur && onBlur();
      setHighlightedIndex(-1);
    }
    setDropdownOpen(visible);
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
          // handleSortOptions(visible)
          handleDropdownBlur(visible);
        }}>
        {/* <Button disabled={disabled}>
          <div className="selected-tag">
            {prefix && <span>{prefix}</span>}
            <Tooltip
              title={
                Array.isArray(selectedOptions) && selectedOptions.length > 0
                  ? getSelectedLabels(selectedOptions).join(', ')
                  : placeholder || 'Select'
              }>
              <span
                className="selected-label"
                style={{
                  color: selectedOptions.length > 0 ? '#000000' : '#A8A29E',
                  maxWidth: maxWidth,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}>
                {selectedOptions.length > 0
                  ? renderSelectedOptions()
                  : placeholder || 'Select'}
              </span>
            </Tooltip>
          </div>
          <DropdownSvg width={14} height={14} />
        </Button> */}
        <Tooltip
          title={
            Array.isArray(selectedOptions) && selectedOptions.length > 0
              ? getSelectedLabels(selectedOptions).join(', ')
              : placeholder || 'Select'
          }>
          <span>
            {' '}
            {/* Thêm span để tránh Tooltip bị vô hiệu hóa */}
            <Button disabled={disabled} className={classButon}>
              <div className="selected-tag">
                {prefix && <span>{prefix}</span>}
                <span
                  className="selected-label"
                  style={{
                    color: selectedOptions.length > 0 ? '#000000' : '#A8A29E',
                    maxWidth: maxWidth,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                  }}>
                  {selectedOptions.length > 0
                    ? renderSelectedOptions()
                    : placeholder || 'Select'}
                </span>
              </div>
              <DropdownSvg width={14} height={14} />
            </Button>
          </span>
        </Tooltip>
      </Dropdown>
    </div>
  );
};

export default MultiSelectWithSearchAdd;
