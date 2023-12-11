import React, { useState } from 'react';
import { Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


const getFormattedDate = (value, locale = 'en-US') => {
  if(value == null) return "Never";
  const date = new Date(value);
  return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
  });
}


export default function ModLogListView({data}) {
  //console.log('Received Data in ModLogListView:', data);
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Action Type', dataIndex: 'ActionType', key: 'ActionType' },
    { title: 'Action Date', dataIndex: 'ActionDate', key: 'ActionDate' },
    { title: 'Moderator Name', dataIndex: 'ModeratorName', key: 'ModeratorName' },
  ];


      return (
        <div id='table-container'>
          <Table
              columns={columns}
              dataSource={data}
              rowClassName='editable-row'
              pagination={{
              pageSizeOptions: ['10', '20', '30'],
              showSizeChanger: true,
              }}
          />
        </div>
      );
}