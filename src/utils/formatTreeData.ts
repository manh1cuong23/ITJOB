export interface TreeNode {
  key: number;
  title: string;
  children: TreeNode[];
}

interface ApiResponseItem {
  id: number;
  code: string;
  name: string;
  parentId: number | null;
  key: string;
}

export default function formatTreeData(data: ApiResponseItem[]): TreeNode[] {
  const map: { [key: number]: TreeNode } = {};
  const treeData: TreeNode[] = [];

  //Tạo map từ id đến phần tử
  data.forEach(item => {
    map[item.id] = {
      key: item.id,
      title: item.name,
      children: [],
    };
  });

  // Tạo cấu trúc cây
  data.forEach(item => {
    const node = map[item.id];
    if (item.parentId === null) {
      // Nếu không có parentId, thêm vào root của treeData
      treeData.push(node);
    } else {
      // Nếu có parentId, thêm vào children của parent node
      map[item.parentId]?.children.push(node);
    }
  });

  return treeData;
}
