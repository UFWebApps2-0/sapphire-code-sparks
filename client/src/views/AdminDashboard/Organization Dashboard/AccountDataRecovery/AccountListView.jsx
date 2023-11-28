import React, {useEffect} from 'react';
import { Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
export default function AccountListView({data}) {


  const columns = [
    {
      title: 'Name', 
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Role', 
      dataindex: 'Role', 
      key: 'Role',
    },
    {
      title: 'School', 
      dataIndex: 'School',
      key: 'School'
    },
    {
      title: 'Time Deleted',
      dataIndex: 'TimeDeleted',
      key: 'TimeDeleted'
    },
    
  ];

  
  return (
    
    <div id='table-container'>
      <Table
          columns={columns}
          dataSource={null}
          
      />
    </div>

  );
}
