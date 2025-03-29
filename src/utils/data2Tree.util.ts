export const data2Tree = (data: any) => {
    return data.map((item: any) => ({
        title: item?.name,
        key: item?.id,
        value: String(item.id),
        children: item?.children ? data2Tree(item?.children) : [],
    }));
};