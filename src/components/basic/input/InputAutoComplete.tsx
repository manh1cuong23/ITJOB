import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Dropdown, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { ICustomSource, ISource } from '@/utils/formatSelectSource';
import './style.less';
import MyInput from './Input';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search.svg';

interface CustomSearchProps {
  value?: string;
  onChange?: (data: any) => void;
  onSelect?: (selectedItem: ISource) => void;
  fetchSuggestions: (textSearch: string, page: number) => Promise<any>;
  className?: string;
  tabIndex?: number;
  onBlur?: () => void;
  disabled?: boolean;
}

const InputAutoComplete: React.FC<CustomSearchProps> = ({
  value,
  onChange,
  fetchSuggestions,
  className,
  onSelect,
  onBlur,
  disabled = false,
  // tabIndex = 1
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [selectedItem, setSelecteditem] = useState<ISource | null>();
  const [suggestions, setSuggestions] = useState<ICustomSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSuggest, setPageSuggest] = useState<number>(1);
  const [pageCountSuggest, setPageCountSuggest] = useState<number>(1);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [fullData, setFullData] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadFilteredSuggestions = useCallback(
    async (searchText: string) => {
      setLoading(true);
      const { options, data, pageCount } = await fetchSuggestions(
        searchText,
        page
      );
      setFullData(data);
      setSuggestions(options);
      setPageCountSuggest(pageCount);
      setLoading(false);
    },
    [fetchSuggestions, page]
  );
  const loadFilteredSuggestionsMore = async (pageSuggest: number) => {
    const { options, data } = await fetchSuggestions(inputValue, pageSuggest);
    setFullData(prevDAta => [...prevDAta, ...data]);
    setSuggestions(prevDAta => [...prevDAta, ...options]);
  };

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      const { options, data } = await fetchSuggestions('', page);
      setFullData(data);
      setSuggestions(options);
      setLoading(false);
    };
    loadSuggestions();
  }, []);

  useEffect(() => {
    value && typeof value === 'string' && setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    !isDropdownVisible && setIsDropdownVisible(true);
    onChange && onChange(newValue);
    setHighlightedIndex(-1);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newDebounceTimer = setTimeout(() => {
      loadFilteredSuggestions(newValue);
    }, 300);

    setDebounceTimer(newDebounceTimer);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      setHighlightedIndex(prevIndex =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSelect(suggestions[highlightedIndex]);
      setIsDropdownVisible(false);
    } else if (e.key === 'Tab' && e.shiftKey) {
      setIsDropdownVisible(false);
    }
  };

  const handleSelect = (item: ISource) => {
    setInputValue(item.label);
    setSelecteditem(item);
    if (onChange) {
      const foundItem = fullData.find(
        suggestion => suggestion.id === item.value
      );
      onSelect?.(foundItem);
      onChange(foundItem);
    }
  };
  let i = 0;
  const handleScroll = useCallback(() => {
    const overlayElement = document.querySelector('.ant-dropdown');
    if (overlayElement) {
      const isAtBottom =
        overlayElement.scrollHeight - overlayElement.scrollTop - 1 <
        overlayElement.clientHeight;
      if (isAtBottom && i < pageCountSuggest) {
        i++;
        loadFilteredSuggestionsMore(pageSuggest + i);
        overlayElement.scrollTop -= 30;
      }
    }
  }, [pageCountSuggest]);

  const menuItems: MenuProps['items'] = suggestions?.map((item, index) => ({
    key: item.value,
    label: (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: index === highlightedIndex ? '#FDECF0' : 'inherit',
        }}
        className={`menu-item ${
          selectedItem?.value === item.value ? 'selected' : ''
        }`}
        onClick={() => handleSelect(item)}>
        <span
          style={{
            paddingRight: '8px',
            maxWidth: '90%',
          }}>
          {item.label}
        </span>
      </div>
    ),
  }));

  useEffect(() => {
    if (isDropdownVisible) {
      const overlayElement = document.querySelector('.ant-dropdown');
      if (overlayElement) {
        overlayElement.addEventListener('wheel', handleScroll);
      }
      return () => {
        if (overlayElement) {
          overlayElement.removeEventListener('wheel', handleScroll);
        }
      };
    }
  }, [isDropdownVisible, pageCountSuggest]);

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget)
    ) {
      setIsDropdownVisible(false);
      // console.log(onBlur);
      onBlur && onBlur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseDown={() => setIsDropdownVisible(true)}
      className="auto-complete dropdown-no-scroll-x">
      <MyInput
        disabled={disabled}
        value={inputValue}
        onChange={handleInputChange}
        allowClear
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        suffix={!inputValue && <SearchSvg className="search-icon" />}
        // tabIndex={tabIndex}
        onFocus={() => {
          setIsDropdownVisible(true);
          loadFilteredSuggestions(inputValue);
        }}
      />
      {loading && (
        <Spin style={{ position: 'absolute', right: '10px', top: '10px' }} />
      )}
      {suggestions && suggestions?.length > 0 && (
        <Dropdown
          className="select-dropdown"
          menu={{
            items: menuItems,
            className: `custom-dropdown-menu ${className}`,
          }}
          open={isDropdownVisible}
          trigger={['click']}
          destroyPopupOnHide={false}
          onOpenChange={visible => setIsDropdownVisible(visible)}
          getPopupContainer={() => containerRef.current || document.body}
          overlayStyle={{ width: '100%', overflowY: 'auto' }}>
          <div style={{ position: 'absolute', width: '350px', zIndex: 1 }} />
        </Dropdown>
      )}
    </div>
  );
};
export default InputAutoComplete;