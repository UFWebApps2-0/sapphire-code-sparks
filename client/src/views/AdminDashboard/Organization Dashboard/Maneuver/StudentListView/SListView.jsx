import React, { useState } from 'react';
import { Form, Input, Popconfirm, Switch, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import SModal from "./SModal"


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


export default function SListView({data, handleDelete, showSchools}) {
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
          title: 'Classroom',
          dataIndex: 'classroom_name',
          key: 'classroom_name',
          width: '20%',
          align: 'left',
          sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
          },
        },
        {
          title: 'Character',
          dataIndex: 'character',
          key: 'character',
          width: '20%',
          align: 'left'
        },
        {
          title: 'Last Logged In',
          dataIndex: 'last_logged_in',
          key: 'last_logged_in',
          width: '50%',
          align: 'right',
          render: (value) => getFormattedDate(value),
        }
      ];
    
      if (showSchools) {
        columns.push({
          title: 'School',
          dataIndex: 'school_name',
          key: 'school_name',
          width: '20%',
          align: 'left',
          sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
          },
        })
      }

      columns.push({
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        width: '10%',
        align: 'left',
        render: (_, record) => (
          <SModal
            mentor={record}
            linkBtn={true}
          />
        ),
      })

      columns.push({
          title: 'Delete',
          dataIndex: 'delete',
          key: 'delete',
          width: '10%',
          align: 'left',
          render: (text, record) =>
            data.length >= 1 ? (
              <Popconfirm
                title={`Are you sure you want to delete all data for ${record.name}?`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete(record.key)}
              >
                <button id='link-btn'>Delete</button>
              </Popconfirm>
            ) : null,
        
      })

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
