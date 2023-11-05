import React, { useState } from 'react';
import {  Form, Input, Popconfirm, Switch, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function ListView({ mentorData}) {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '22.5%',
      align: 'left',
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : 1),
      },
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      width: '10%',
      align: 'right',
    },
  ];

  return (
    <div id='table-container'>
    <Table
        columns={columns}
        dataSource={mentorData}
        rowClassName='editable-row'
        pagination={{
        pageSizeOptions: ['10', '20', '30'],
        showSizeChanger: true,
        }}
    />
    </div>
  );
}
