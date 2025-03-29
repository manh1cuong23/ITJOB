import { Device } from '@/interface/layout/index.interface';
import { MenuChild } from '@/interface/layout/menu.interface';
import { Role } from './login';

export type Locale = 'en_US' | 'vi_VN';

export interface UserState {
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  /** Token */
  token?: string;

  /** Permission */
  perms?: any;

  /** User Info */
  userInfo?: any;
	passWord?: string;
}

export interface LoginState {
  name: string;
  job: string;
}