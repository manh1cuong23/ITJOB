declare namespace CORE {
  type MyResponse<T = any> = Promise<Response<T>>;

  type Response<T = any> = {
    status: boolean;
    message: string;
    result: T;
  };
  type PageData<T> = {
    pageNumber?: number;
    pageSize?: number;
    total: number;
    data: T[];
  };

  type Language = keyof Locales;

  type Locales<T = any> = {
    /** Chinese */
    zh_CN: T;
    /** English */
    en_US: T;
  };

  type MenuItem = {
    /** menu item code */
    code: string;
    /** menu labels */
    label: {
      zh_CN: string;
      en_US: string;
    };
    /** icon name
     *
     * Sub-submenus do not need icons
     */
    icon?: string;
    /** menu route */
    path: string;
    /** submenus */
    children?: MenuItem[];
  };
  type MenuChild = Omit<MenuItem, 'children'>;

  type MenuList = MenuItem[];
}
