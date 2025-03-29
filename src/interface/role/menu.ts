export interface IMenu {
    id: number
    createdBy: string
    createdDate: string
    deleted: string
    server: string
    name: string
    path: string
    icon: string
    action: string
    displayOrder: number
    isAllowAnonymous: boolean
    description: string
    parentWebMenuId: number
    parentWebMenu: string
    children: IMenu[]
    webMenuAction: WebMenuAction[],
    [x: string]: any
  }
  export type WebMenuAction = {
    webMenuId: number
    actionMenuId: number
    actionMenuCode: string
    actionMenuName: string
    id: number
    createdDate: string
    modifiedDate: any
    modifiedBy: any
    deleted: string,
    webMenu: IMenu
  }