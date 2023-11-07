import React from 'react';
import { Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import MentorModal from './MentorModal';

export default function ListView({ mentorData, handleDelete}) {

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
      render: (_, record) => (
        <MentorModal
          mentor={record}
          linkBtn={true}
        />
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      align: 'right',
      render: (text, record) =>
        mentorData.length >= 1 ? (
          <Popconfirm
            title={`Are you sure you want to delete all data for ${record.name}?`}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.key)}
          >
            <button id='link-btn'>Delete</button>
          </Popconfirm>
        ) : null,
    }
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
