import { Skeleton, Tree, TreeProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

interface ApiTreeProps extends Omit<TreeProps, 'treeData' | 'onSelect'> {
    fetchData: () => Promise<TreeNode[]>;
    isDisabled?: boolean;
    name?: string;
    label?: string;
    placeholder?: string;
    value?: React.Key[];
    onChange?: (checkedKeys: React.Key[]) => void; 
}

interface TreeNode {
    title: string;
    value: string;
    key: string;
    children?: TreeNode[];
}

const ApiTree: React.FC<ApiTreeProps> = (props) => {
    const { fetchData, placeholder = 'Tìm kiếm',value,onChange, ...restProps } = props;
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(value || []);
    const { data, error, isLoading } = useQuery({
        queryKey: [props.name || 'treeData'],
        queryFn: fetchData,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
    });

    if (isLoading) {
        return (
            <Skeleton active>
                <Tree
                    treeData={[]}
                    style={{ width: '100%' }}
                    {...restProps}
                />
            </Skeleton>
        );
    }

    if (error) {
        return <div>Error loading data.</div>;
    }

    const handleSelect: TreeProps<any>['onSelect'] = (selectedKeys, info) => {
        if (onSelect) onSelect(selectedKeys, info);
    };
    const onSelect: TreeProps['onSelect'] = (_, info) => {
        const { node } = info;
        const key = node.key;

        // Toggle the checked state when a label is clicked
        let newCheckedKeys = [...checkedKeys];
        if (newCheckedKeys.includes(key)) {
            newCheckedKeys = newCheckedKeys.filter(k => k !== key);
        } else {
            newCheckedKeys.push(key);
        }

        setCheckedKeys(newCheckedKeys);

        if (onChange) {
            onChange(newCheckedKeys);
        }
    };
    const onCheck: TreeProps['onCheck'] = checkedKeysValue => {
        if (Array.isArray(checkedKeysValue)) {
            setCheckedKeys(checkedKeysValue);
        } else {
            setCheckedKeys(checkedKeysValue.checked as React.Key[]);
        }
        if (onChange) {
            onChange(checkedKeysValue as React.Key[]);
        }
    };
    return (
        <Tree
            treeData={data}
            onSelect={handleSelect}
            style={{ width: '100%' }}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            {...restProps}
        />
    );
};

export default ApiTree;
