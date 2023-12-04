import React, {useEffect, useState} from 'react';
import { Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { recoverStudent, getAllDeletedAccounts, getStudent } from '../../../../Utils/requests';
export default function AccountListView({data}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const columns = [
    {
      title: 'Name', 
      dataIndex: 'name',
      key: 'Name',
    },
    {
      title: 'Role', 
      dataIndex: 'Role', 
      key: 'Role',
    },
    {
      title: 'School', 
      dataIndex: 'School',
      key: 'School'
    },
    {
      title: 'Time Deleted',
      dataIndex: 'time_deleted',
      key: 'TimeDeleted'
    },
    
  ];
  
  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);       
    },
    
  };

  const hasSelected = selectedRowKeys.length > 0; 

  const handleRecoverAccount = () =>  {
    //set admin perms for this in roles section of strapi 
     
    selectedRowKeys.forEach((student) => {
      //console.log(row.id); 
      console.log(recoverStudent(student)); 
    })

  }

  return (
    <div> 
      <div id='table-container'>
        <Table
            rowSelection={{ 
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data.map((item) => ({ ...item, key: item.id }))}
            
        />
      </div>
      
      {hasSelected ? <button onClick={handleRecoverAccount}> Recover Account </button> : null} 
      
    </div>

  );
}
