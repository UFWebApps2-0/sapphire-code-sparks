import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import {  getAllDeletedAccounts } from '../../../../Utils/requests';
import "./Recovery.less"
import AccountListView from "./AccountListView.jsx"

export default function Recovery(props) {
    const [accounts, setAccounts] = React.useState([]); 
    const [visible, setVisible] = React.useState(false); 
    //const handleOpen = () => setOpen(true); 
    //const handleClose = () => setOpen(false); 
    const handleCancel = () => {
        setVisible(false); 
    }
    const showModal = () => {
        setVisible(true); 
    }

    useEffect(() => {
      getAllDeletedAccounts().then((res) => {

        if (res.data)   {
          const accountData = res.data;
          setAccounts(accountData);  
        }
        else {
          message.error(res.err); 
        }
      })
    }, [])
    
  return (
    <div>

      <button onClick={showModal}>
        Account/Data Recovery
      </button>
      <Modal
        title="Recover Accounts/Data"
        open={visible}
        onCancel={handleCancel}
        onOk={handleCancel}

      >
        <button> 
            Students 
        </button>
        <button> 
            Mentors/Classroom Managers 
        </button>
        <AccountListView
          data = {accounts}
        />
      </Modal>
    </div>
  )
}
