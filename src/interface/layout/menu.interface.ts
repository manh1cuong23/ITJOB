import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>['items'][number];

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
