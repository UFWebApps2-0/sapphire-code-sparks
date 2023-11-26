import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../ActivityLevels.less';
import { compileArduinoCode, handleUpdateWorkspace,  handleCreatorSaveActivityLevel, handleCreatorSaveActivity } from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert, Menu, Dropdown } from 'antd';
import CodeModal from '../modals/CodeModal';
import ConsoleModal from '../modals/ConsoleModal';
import PlotterModal from '../modals/PlotterModal';
import LoadWorkspaceModal from '../modals/LoadWorkspaceModal';
import SaveAsModal from '../modals/SaveAsModal';
import DisplayDiagramModal from '../modals/DisplayDiagramModal'
import StudentToolboxMenu from '../modals/StudentToolboxMenu';
import {
  connectToPort,
  handleCloseConnection,
  handleOpenConnection,
} from '../../Utils/consoleHelpers';



// Mason's Contribution: Defining and importing new types of back-end requests from Utils/requests.js
import {
  getAuthorizedWorkspace,
  getAllBlocks,
  getOneBlock,
  postOneBlock,
  deleteOneBlock
} from '../../../../Utils/requests';
import IconHammer from '../Icons/IconHammer';



import ArduinoLogo from '../Icons/ArduinoLogo';
import PlotterLogo from '../Icons/PlotterLogo';

let plotId = 1;

export default function MentorCanvas({ activity, isSandbox, setActivity,  isMentorActivity }) {
  const [hoverGenerator, setHoverGenerator] = useState(false); // Hover state for Generator Button

  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [studentToolbox, setStudentToolbox] = useState([]);
  const [openedToolBoxCategories, setOpenedToolBoxCategories] = useState([]);
  const [forceUpdate] = useReducer((x) => x + 1, 0);
  const workspaceRef = useRef(null);
  const activityRef = useRef(null);



  // Mason's Contribution: Defining new hooks for form data in Block Generator

  // Variables for sending block data to back-end
  const [formBD, setFormBD] = useState('');
  const [formGS, setFormGS] = useState('');
  const [isPendingSend, setIsPendingSend] = useState(false);
  const [sendStatus, setSendStatus] = useState(0); // 0 = initial, -1 = fail, 1 = success
  const [newBlockID, setNewBlockID] = useState('');

  // Variables for deleting block data from back-end
  const [formDelete, setFormDelete] = useState('');
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(0); // 0 = initial, -1 = fail, 1 = success

  // Variables for receiving block data from back-end
  const [formReceive, setFormReceive] = useState('');
  const [formReceivePayload, setFormReceivePayload] = useState('');
  const [isPendingReceive, setIsPendingReceive] = useState(false);

  // Variables for unit tests
  // 0 = initial, -1 = fail, 1 = success
  const [test1Status, setTest1Status] = useState(0);
  const [test2Status, setTest2Status] = useState(0);
  const [test3Status, setTest3Status] = useState(0);
  const [test4Status, setTest4Status] = useState(0);
  const [test5Status, setTest5Status] = useState(0);
  const [test6Status, setTest6Status] = useState([0, 0, 0, 0]); // Array of 4 to represent parts A, B, C, and D

  // Block Category ID for the custom User category
  const userCategoryID = '13';



  const navigate = useNavigate();

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
    });



    // Mason's Contribution: Retrieve blocks in the User category to run their Block Definitions and Generator Stubs

    // Make an asynchronous promise to receive all blocks
    let blockCommandsPromise = receiveAllBlocks();

    blockCommandsPromise.then(
      // Case of success
      function(value) {
        const blockCommands = value;
        // For each retrieved block, execute the code contained in the block's description
        for (const [id, desc] of Object.entries(blockCommands)) {
          eval(desc); // eval interprets text as code to be run
        }
      },
      // Case of failure
      function(error) {
        console.log('Block Commands not retrieved.')
    });



  };

  useEffect(() => {
    // once the activity state is set, set the workspace and save
    const setUp = async () => {
      const classroom = sessionStorage.getItem('classroomId');
      setClassroomId(classroom);
      activityRef.current = activity;
      if (!workspaceRef.current && activity && Object.keys(activity).length !== 0) {
        setWorkspace();
        // if (activity.template) {
        //   let xml = window.Blockly.Xml.textToDom(activity.template);
        //   window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        // }
        let xml = isMentorActivity
        ? window.Blockly.Xml.textToDom(activity.activity_template)
        : window.Blockly.Xml.textToDom(activity.template);
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        workspaceRef.current.clearUndo();
      }
    };
    setUp();
  }, [activity]);

  const loadSave = async (workspaceId) => {
    // get the corresponding workspace
    const res = await getAuthorizedWorkspace(workspaceId);
    if (res.data) {
      // set up the canvas
      if (workspaceRef.current) workspaceRef.current.clear();
      let xml = window.Blockly.Xml.textToDom(res.data.template);
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      setActivity(res.data);
    } else {
      message.error(res.err);
      return false;
    }

    if (!isSandbox) {
      const toolboxRes = await getAuthorizedWorkspaceToolbox(workspaceId);
      if (toolboxRes.data) {
        let tempCategories = [],
          tempToolBox = [];
        toolboxRes.data.toolbox &&
          toolboxRes.data.toolbox.forEach(([category, blocks]) => {
            tempCategories.push(category);
            tempToolBox = [
              ...tempToolBox,
              ...blocks.map((block) => block.name),
            ];
          });

        setOpenedToolBoxCategories(tempCategories);
        setStudentToolbox(tempToolBox);
      }
    }
  };

  const handleSave = async () => {
    // if we already have the workspace in the db, just update it.
    if (activity && activity.id) {
      const updateRes = await handleUpdateWorkspace(activity.id, workspaceRef);
      if (updateRes.err) {
        message.error(updateRes.err);
      } else {
        message.success('Workspace saved successfully');
      }
    }
    // else create a new workspace and update local storage
    else {
      setShowSaveAsModal(true);
    }
  };

  const handleUndo = () => {
    if (workspaceRef.current.undoStack_.length > 0)
      workspaceRef.current.undo(false);
  };

  const handleRedo = () => {
    if (workspaceRef.current.redoStack_.length > 0)
      workspaceRef.current.undo(true);
  };

  const handleConsole = async () => {
    if (showPlotter) {
      message.warning('Close serial plotter before openning serial monitor');
      return;
    }
    // if serial monitor is not shown
    if (!showConsole) {
      // connect to port
      await handleOpenConnection(9600, 'newLine');
      // if fail to connect to port, return
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setConnectionOpen(true);
      setShowConsole(true);
    }
    // if serial monitor is shown, close the connection
    else {
      if (connectionOpen) {
        await handleCloseConnection();
        setConnectionOpen(false);
      }
      setShowConsole(false);
    }
  };

  const handlePlotter = async () => {
    if (showConsole) {
      message.warning('Close serial monitor before openning serial plotter');
      return;
    }

    if (!showPlotter) {
      await handleOpenConnection(
        9600,
        'plot',
        plotData,
        setPlotData,
        plotId,
        forceUpdate
      );
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setConnectionOpen(true);
      setShowPlotter(true);
    } else {
      plotId = 1;
      if (connectionOpen) {
        await handleCloseConnection();
        setConnectionOpen(false);
      }
      setShowPlotter(false);
    }
  };

  const handleCompile = async () => {
    if (showConsole || showPlotter) {
      message.warning(
        'Close Serial Monitor and Serial Plotter before uploading your code'
      );
    } else {
      if (typeof window['port'] === 'undefined') {
        await connectToPort();
      }
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setCompileError('');
      await compileArduinoCode(
        workspaceRef.current,
        setSelectedCompile,
        setCompileError,
        activity,
        false
      );
    }
  };

  const handleGoBack = () => {
    if (
      window.confirm(
        'All unsaved progress will be lost. Do you still want to go back?'
      )
    )
      navigate(-1);
  };
  const handleCreatorSave = async () => {
    // Save activity template

    if (!isSandbox && !isMentorActivity) {
      const res = await handleCreatorSaveActivityLevel(
        activity.id,
        workspaceRef,
        studentToolbox
      );
      if (res.err) {
        message.error(res.err);
      } else {
        message.success('Activity Template saved successfully');
      }
    } else if (!isSandbox && isMentorActivity) {
      // Save activity template
      const res = await handleCreatorSaveActivity(activity.id, workspaceRef);
      if (res.err) {
        message.error(res.err);
      } else {
        message.success('Activity template saved successfully');
      }
    } else {
      // if we already have the workspace in the db, just update it.
      if (activity && activity.id) {
        const updateRes = await handleUpdateWorkspace(
          activity.id,
          workspaceRef,
          studentToolbox
        );
        if (updateRes.err) {
          message.error(updateRes.err);
        } else {
          message.success('Workspace saved successfully');
        }
      }
      // else create a new workspace and update local storage
      else {
        setShowSaveAsModal(true);
      }
    }
  };



  // Mason's Contribution: Handlers for forms in Block Generator

  // Handles the Block Generator Access Button
  const handleGenerator = () => {
    alert('This is the Block Generator.');
  }

  // Receive all blocks from back-end
  const receiveAllBlocks = async () => {
    // Dictionary of Block Commands (Block Definition + Generator Stub) formatted in {Block ID (number) : Block Command (text)}
    let blockCommands = {};
    // Receive all blocks from back-end
    const res = await getAllBlocks();
    if (res.data) {
      // Loop through all blocks
      for (let i = 0; i < res.data.length; i++) {
        // Filter to only blocks in the custom User category
        if (res.data[i] != null && res.data[i].blocks_category != null && res.data[i].blocks_category.id != null && res.data[i].blocks_category.id == userCategoryID) {
          const blockID = res.data[i].id;
          const desc = res.data[i].description;
          
          // Filter to only blocks with basic proper syntax
          if (desc.length > 140 && desc.substring(0, 16) === "Blockly.Blocks['" && desc.substring(desc.length - 2, desc.length) === "};" && !(blockID in blockCommands))
            blockCommands[blockID] = desc;
        }
      }
    }
    else {
      console.log('Error when receiving all blocks.');
    }
    return blockCommands;
  }

  // Helper function for sending a block to back-end
  const sendBlock = async (blockName) => {
    try {
      // Post the block to back-end
      const res = await postOneBlock(blockName, formBD + '\n' + formGS, userCategoryID, '', 'User', 'User');
      if (res.data) {
        setNewBlockID(res.data.id);
        setSendStatus(1);
      }
      else {
        setSendStatus(-1);
      }
    }
    catch (error) {
      console.log('Error occurred while sending block.');
      console.error(error.response.data);
    }
  }

  // Handler function for sending a block to back-end
  const handleSubmitSend = async (formBD_ = formBD, formGS_ = formGS) => {
    setIsPendingSend(true);

    // Split text using newline as delimiter
    const formBDLines = formBD_.split('\n');
    const formGSLines = formGS_.split('\n');

    // Get the first and last indices of '
    const quoteStart = formBDLines[0].indexOf("'");
    const quoteEnd = formBDLines[0].lastIndexOf("'");

    // Verify that the block has a name
    if (formBDLines.length > 0 && quoteStart != -1 && quoteEnd != -1 && quoteStart < quoteEnd) {
      // Extract Block Name from within quotes
      const blockName = formBDLines[0].substring(quoteStart + 1, quoteEnd);

      // Send block to back-end (send status is to be determined by the function)
      await sendBlock(blockName);
    }
    else {
      setSendStatus(-1);
    }
  
    setIsPendingSend(false);
  }

  // Handler function for reloading the page
  const handleSubmitReload = () => {
    window.location.reload(false);
  }

  // Handler function for either sending a block to back-end or reloading the page
  const handleSubmitSendOrReload = async (e) => {
    e.preventDefault();

    if (e.nativeEvent.submitter.name === 'sendButton')
      handleSubmitSend();
    else if (e.nativeEvent.submitter.name === 'reloadButton')
      handleSubmitReload();
  }

  // Helper function for deleting a block from back-end
  const deleteBlock = async (blockID) => {
    try {
      let failure = true;
      // Get the block from back-end
      const res1 = await getOneBlock(blockID);
      
      // Check that the block is in the User category
      if (res1.data && res1.data.blocks_category.id == userCategoryID) {
        // Delete the block from back-end
        const res2 = await deleteOneBlock(blockID);
        if (res2.data) {
          setDeleteStatus(1);
          failure = false;
        }
      }
      
      if (failure) {
        setDeleteStatus(-1);
      }
    }
    catch (error) {
      console.log('Error occurred while deleting block.');
      console.error(error.response.data);
    }
  }

  // Handler function for deleting a block from back-end
  const handleSubmitDelete = async (e) => {
    e.preventDefault();

    setIsPendingDelete(true);
    deleteBlock(formDelete);
    setIsPendingDelete(false);
  }

  // Helper function for receiving a block from back-end
  const receiveBlock = async (blockID = formReceive) => {
    // Receive the block from back-end
    const res = await getOneBlock(blockID);

    if (res.data && res.data.id != null) {
      // Construct string that displays block's info in a pretty way
      let result = '';

      result += 'Block ID: ' + res.data.id + '\n';
      result += 'Block Name: ' + res.data.name + '\n';
      result += 'Block Description: ' + res.data.description + '\n';
      result += 'Block Creation Timestamp: ' + res.data.created_at + '\n';
      result += 'Block Update Timestamp: ' + res.data.updated_at + '\n';
      result += 'Block Image: ' + res.data.block_image + '\n';
      result += 'Block Image URL: ' + res.data.image_url + '\n';
      result += 'Category ID: ' + res.data.blocks_category.id + '\n';
      result += 'Category Name: ' + res.data.blocks_category.name + '\n';
      result += 'Category Creation Timestamp: ' + res.data.blocks_category.created_at + '\n';
      result += 'Category Update Timestamp: ' + res.data.blocks_category.updated_at + '\n';

      setFormReceivePayload(result);
    }
    else {
      setFormReceivePayload('Block not found.');
    }
  }

  // Handler function for receiving a block from back-end
  const handleSubmitReceive = async (e) => {
    e.preventDefault();

    setIsPendingReceive(true);
    receiveBlock();
    setIsPendingReceive(false);
  }

  // Handler function for Unit Test 1
  // Unit Test 1: Send invalid block
  // Test case passes if block is not sent
  const handleUnitTest1 = async () => {
    // Input text for Block Description and Generator Stub
    const textBD = 'This is an invalid Block Description.';
    const textGS = 'This is an invalid Generator Stub.';
    
    setFormBD(textBD);
    setFormGS(textGS);
    
    // Simulate pressing the send button
    await handleSubmitSend(textBD, textGS).then(() => {
      setSendStatus(stateSendStatus => {
        // Save result of test case
        setTest1Status(-stateSendStatus);
        return stateSendStatus;
      });
    });
  }

  // Handler function for Unit Test 2
  // Unit Test 2: Receive invalid block (ID not found)
  // Test case passes if block is not found
  const handleUnitTest2 = async () => {
    setFormReceive('-1');

    // Simulate pressing the receive button
    await receiveBlock('-1').then(() => {
      setFormReceivePayload(stateFormReceivePayload => {
        // Save result of test case
        setTest2Status(stateFormReceivePayload === 'Block not found.' ? 1 : -1);
        return stateFormReceivePayload;
      });
    });
  }

  // Handler function for Unit Test 3
  // Unit Test 3: Receive valid block
  // Test case passes if block is received
  const handleUnitTest3 = async () => {
    setFormReceive('1');

    // Simulate pressing the receive button
    await receiveBlock('1').then(() => {
      setFormReceivePayload(stateFormReceivePayload => {
        // Save result of test case
        setTest3Status(stateFormReceivePayload != 'Block not found.' && stateFormReceivePayload.substring(0, 11) === 'Block ID: 1' ? 1 : -1);
        return stateFormReceivePayload;
      });
    });
  }

  // Handler function for Unit Test 4
  // Unit Test 4: Delete invalid block (block ID not found)
  // Test case passes if block is not found nor deleted
  const handleUnitTest4 = async () => {
    setFormDelete('-1');

    // Simulate pressing the delete button
    await deleteBlock('-1').then(() => {
      setDeleteStatus(stateDeleteStatus => {
        // Save result of test case
        setTest4Status(-stateDeleteStatus);
        return stateDeleteStatus;
      });
    });
  }

  // Handler function for Unit Test 5
  // Unit Test 5: Delete invalid block (block not in User category)
  // Test case passes if block is not deleted
  const handleUnitTest5 = async () => {
    setFormDelete('1');

    // Simulate pressing the delete button
    await deleteBlock('1').then(() => {
      setDeleteStatus(stateDeleteStatus => {
        // Save result of test case
        setTest5Status(-stateDeleteStatus);
        return stateDeleteStatus;
      });
    });
  }

  // Handler function for Unit Test 6 Helper
  // Unit Test 6 Helper: Deletes block with matching name in User category if it exists, effectively resetting procedure for Unit Test 6
  // Does not "pass" or "fail", as it is technically not a test case
  const handleUnitTest6Helper = async () => {
    // Get all blocks from back-end
    const res = await getAllBlocks();
    if (res.data) {
      // Loop through all blocks
      for (let i = 0; i < res.data.length; i++) {
        // Search blocks in the custom User category that have a matching name (may or may not exist)
        if (res.data[i] != null && res.data[i].blocks_category != null && res.data[i].blocks_category.id != null && res.data[i].blocks_category.id == userCategoryID && res.data[i].name === 'test_6_block') {
          setFormDelete(res.data[i].id);

          // Delete the block from back-end
          deleteBlock(res.data[i].id);
          break;
        }

        // Match was not found, so return an error status
        if (i === res.data.length - 1) {
          setFormDelete('-1');
          setDeleteStatus(-1);
        }
      }
    }
    else {
      console.log('Error when receiving all blocks.');
    }
  }

  // Handler function for Unit Test 6A
  // Unit Test 6A: Send new block
  // Test case passes if new block is sent
  const handleUnitTest6A = async () => {
    // Input text for Block Description and Generator Stub
    const textBD = `Blockly.Blocks['test_6_block'] = {\n  init: function() {\n    this.appendDummyInput()\n        .appendField("Test 6 Block");\n    this.setColour(20);\n this.setTooltip("");\n this.setHelpUrl("");\n  }\n};`;
    const textGS = `Blockly.Arduino['test_6_block'] = function(block) {\n  // TODO: Assemble Arduino into code variable.\n  var code = '...;';\n  return code;\n};`;
    const testIndex = 0;

    setFormBD(textBD);
    setFormGS(textGS);
    
    // Simulate pressing the send button
    await handleSubmitSend(textBD, textGS).then(() => {
      setSendStatus(stateSendStatus => {
        // Create array with updated value at testIndex
        let arr = test6Status;
        arr[testIndex] = stateSendStatus;
        // Save result of test case
        setTest6Status(arr);
        return stateSendStatus;
      });
    });
  }

  // Handler function for Unit Test 6B
  // Unit Test 6B: Receive newly created block
  // Test case passes if block is created
  const handleUnitTest6B = async () => {
    const testIndex = 1;

    setFormReceive(newBlockID);

    // Simulate pressing the receive button
    await receiveBlock(newBlockID).then(() => {
      setFormReceivePayload(stateFormReceivePayload => {
        // Create array with updated value at testIndex
        let arr = test6Status;
        arr[testIndex] = (stateFormReceivePayload != 'Block not found.' && stateFormReceivePayload.substring(0, 10 + newBlockID.toString().length) === 'Block ID: ' + newBlockID.toString()) ? 1 : -1;
        // Save result of test case
        setTest6Status(arr);
        return stateFormReceivePayload;
      });
    });
  }

  // Handler function for Unit Test 6C
  // Unit Test 6C: Delete newly created block
  // Test case passes if block is deleted
  const handleUnitTest6C = async () => {
    const testIndex = 2;

    setFormDelete(newBlockID);

    // Simulate pressing the delete button
    await deleteBlock(newBlockID).then(() => {
      setDeleteStatus(stateDeleteStatus => {
        // Create array with updated value at testIndex
        let arr = test6Status;
        arr[testIndex] = stateDeleteStatus;
        // Save result of test case
        setTest5Status(arr);
        return stateDeleteStatus;
      });
    });
  }

  // Handler function for Unit Test 6D
  // Unit Test 6D: Receive recently deleted block
  // Test case passes if block cannot be deleted
  const handleUnitTest6D = async () => {
    const testIndex = 3;

    setFormReceive(newBlockID);

    // Simulate pressing the receive button
    await receiveBlock(newBlockID).then(() => {
      setFormReceivePayload(stateFormReceivePayload => {
        // Create array with updated value at testIndex
        let arr = test6Status;
        arr[testIndex] = stateFormReceivePayload === 'Block not found.' ? 1 : -1;
        // Save result of test case
        setTest6Status(arr);
        return stateFormReceivePayload;
      });
    });
  }

  // Helper function for displaying multiple lines of text
  function NewlineText(props) {
    const text = props.text;
    const newText = text.split('\n').map(str => <p style={{'white-space': 'pre-wrap', 'margin-bottom': ' 0'}}>{str}</p>);
    return newText;
  }

  // Helper function for displaying a block ID for a newly created block
  function DisplayNewBlockID() {
    return (<p>Block successfully sent! (ID: {newBlockID})</p>);
  }



  const menu = (
    <Menu>
      <Menu.Item onClick={handlePlotter}>
        <PlotterLogo />
        &nbsp; Show Serial Plotter
      </Menu.Item>
      <CodeModal title={'XML'} workspaceRef={workspaceRef.current} />
      <Menu.Item>
        <CodeModal title={'Arduino Code'} workspaceRef={workspaceRef.current} />
      </Menu.Item>
    </Menu>
  );

  const menuSave = (
    <Menu>
      <Menu.Item id='menu-save' onClick={handleCreatorSave} key='test'>
        <i className='fa fa-save'/>
        &nbsp; Save to template
      </Menu.Item>
      <SaveAsModal
        visible={showSaveAsModal}
        setVisible={setShowSaveAsModal}
        workspaceRef={workspaceRef}
        activity={activity}
        setActivity={setActivity}
        isSandbox={isSandbox}
        classroomId={classroomId}
      />
      <LoadWorkspaceModal loadSave={loadSave} classroomId={classroomId} />
    </Menu>
  );

  return (
    <div id='horizontal-container' className='flex flex-column'>
      <div className='flex flex-row'>
        <div
          id='bottom-container'
          className='flex flex-column vertical-container overflow-visible'
        >
          <Spin
            tip='Compiling Code Please Wait... It may take up to 20 seconds to compile your code.'
            className='compilePop'
            size='large'
            spinning={selectedCompile}
          >
            <Row id='icon-control-panel'>
              <Col flex='none' id='section-header'>
                {activity.lesson_module_name
                  ? `${activity.lesson_module_name} - Activity ${activity.number}`
                  : activity.name
                  ? `Workspace: ${activity.name}`
                  : 'New Workspace!'}
              </Col>
              <Col flex='auto'>
                <Row align='middle' justify='end' id='description-container'>
                  <Col flex={'30px'}>
                    <button
                      onClick={handleGoBack}
                      id='link'
                      className='flex flex-column'
                    >
                      <i id='icon-btn' className='fa fa-arrow-left' />
                    </button>
                  </Col>
                  <Col flex='auto' />
                  <Row id='right-icon-container'>



                    {/* Start of Generator Icon for Block Generator Access Button */}
                    
                    {/* This placeholder button currently has no functionality */}
                    {/* The goal is to expand a modal similar to the existing "Diagrams" button */}

                    <Col className='flex flex-row'>
                      <div
                        id='action-btn-container'
                        className='flex space-around'
                      >
                        <IconHammer
                          setHoverGenerator={setHoverGenerator}
                          handleGenerator={handleGenerator}
                        />
                        {/* This is the pop-up text when a user hovers over the button */}
                        {hoverGenerator && (
                          <div className='popup ModalCompile3'>Generate Custom Block</div>
                        )}
                      </div>
                    </Col>

                    {/* End of Generator icon for Block Generator Access Button */}



                    {!isSandbox ? (
                      <Col
                        className='flex flex-row'
                        id='save-dropdown-container'
                      >
                        <Dropdown overlay={menuSave}>
                          <i id='icon-btn' className='fa fa-save' />
                        </Dropdown>
                        <i className='fas fa-angle-down' id='caret'></i>
                      </Col>
                    ) : null}
                    <Col className='flex flex-row' id='redo-undo-container'>
                      <button
                        onClick={handleUndo}
                        id='link'
                        className='flex flex-column'
                      >
                        <i
                          id='icon-btn'
                          className='fa fa-undo-alt'
                          style={
                            workspaceRef.current
                              ? workspaceRef.current.undoStack_.length < 1
                                ? { color: 'grey', cursor: 'default' }
                                : null
                              : null
                          }
                          onMouseEnter={() => setHoverUndo(true)}
                          onMouseLeave={() => setHoverUndo(false)}
                        />
                        {hoverUndo && (
                          <div className='popup ModalCompile4'>Undo</div>
                        )}
                      </button>
                      <button
                        onClick={handleRedo}
                        id='link'
                        className='flex flex-column'
                      >
                        <i
                          id='icon-btn'
                          className='fa fa-redo-alt'
                          style={
                            workspaceRef.current
                              ? workspaceRef.current.redoStack_.length < 1
                                ? { color: 'grey', cursor: 'default' }
                                : null
                              : null
                          }
                          onMouseEnter={() => setHoverRedo(true)}
                          onMouseLeave={() => setHoverRedo(false)}
                        />
                        {hoverRedo && (
                          <div className='popup ModalCompile4'>Redo</div>
                        )}
                      </button>
                    </Col>
                    <Col className='flex flex-row'>
                      <div
                        id='action-btn-container'
                        className='flex space-around'
                      >
                        <ArduinoLogo
                          setHoverCompile={setHoverCompile}
                          handleCompile={handleCompile}
                        />
                        {hoverCompile && (
                          <div className='popup ModalCompile'>
                            Upload to Arduino
                          </div>
                        )}
                    <DisplayDiagramModal
                      image={activity.images}
                    />
                        <i
                          onClick={() => handleConsole()}
                          className='fas fa-terminal hvr-info'
                          style={{ marginLeft: '6px' }}
                          onMouseEnter={() => setHoverConsole(true)}
                          onMouseLeave={() => setHoverConsole(false)}
                        />
                        {hoverConsole && (
                          <div className='popup ModalCompile'>
                            Show Serial Monitor
                          </div>
                        )}
                        <Dropdown overlay={menu}>
                          <i className='fas fa-ellipsis-v'></i>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
            <div id='blockly-canvas' />
          </Spin>
          </div>
           {!isSandbox && !isMentorActivity && (
          <StudentToolboxMenu
            activity={activity}
            studentToolbox={studentToolbox}
            setStudentToolbox={setStudentToolbox}
            openedToolBoxCategories={openedToolBoxCategories}
            setOpenedToolBoxCategories={setOpenedToolBoxCategories}
          />
          )}
        <ConsoleModal
          show={showConsole}
          connectionOpen={connectionOpen}
          setConnectionOpen={setConnectionOpen}
        ></ConsoleModal>
        <PlotterModal
          show={showPlotter}
          connectionOpen={connectionOpen}
          setConnectionOpen={setConnectionOpen}
          plotData={plotData}
          setPlotData={setPlotData}
          plotId={plotId}
        />
      </div>



      {/* Start of Block Generator */}

      <div className='flex flex-row'>
        <div
          id='bottom-container'
          className='flex flex-column vertical-container overflow-visible'
        >
        <h1 id = "section-header">Block Generator</h1>
        <h2>Define custom blocks here!</h2>

        {/* Mason's Contribution: Added 4 columns for forms that interact with back-end */}
        <Row className='justify-content-center' align='middle' justify='middle'>

          {/* Column for uploading blocks to the back-end */}
          <Col flex={'25%'} className = "codeBlockCol">
            <h1>Send a block to back-end</h1>
            <form onSubmit={handleSubmitSendOrReload}>
              <label>Block Definition</label>
              <br></br>
              <textarea
                type="text"
                required
                value={formBD}
                onChange={(e) => setFormBD(e.target.value)}
                className = "inputTextBox"
              >
              </textarea>
              <br></br>
              <label>Generator Stub</label>
              <br></br>
              <textarea
                type="text"
                required
                value={formGS}
                onChange={(e) => setFormGS(e.target.value)}
                className = "inputTextBox"
              >
              </textarea>
              <br></br>
              {/* Buttons are displayed conditionally */}

              {sendStatus === -1 && <p>Send Error: Could be sending an invalid or duplicate block, possessing insufficient role permissions, or using an unauthorized token.</p>}
              {sendStatus === 1 && <DisplayNewBlockID></DisplayNewBlockID>}
              {!isPendingSend && <button name='sendButton'>Send to Gallery</button>}
              {isPendingSend && <button disabled name='sendButton'>Sending...</button>}
              {sendStatus === 1 && <br></br>}
              {sendStatus === 1 && <p>Newly added blocks require a page reload to be viewed in the Toolbox.</p>}
              {sendStatus === 1 && <button name='reloadButton'>Reload Page</button>}
            </form>

          </Col>
          {/* Column for receiving blocks from back-end */}
          <Col flex={'25%'}>
            <div  className = "codeBlockCol">
            <h1>Receive a block from back-end</h1>
            <form onSubmit={handleSubmitReceive}>
              <label style={{'margin-right': '1em'}}>Block ID</label>
              <input
                type="text"
                required
                value={formReceive}
                onChange={(e) => setFormReceive(e.target.value)
                }
              />
              <NewlineText text ={formReceivePayload}></NewlineText>
              {/* Buttons are displayed conditionally */}

              {!isPendingReceive && <button name='receiveButton'>Receive from Gallery</button>}
              {isPendingReceive && <button disabled name='receiveButton'>Receiving...</button>}
            </form>
            </div>

            <div className = "codeBlockCol">
            <h1>Delete a block from back-end</h1>
            <form onSubmit={handleSubmitDelete}>
              <label style={{'margin-right': '1em'}}>Block ID</label>
              <input
                type="text"
                required
                value={formDelete}
                onChange={(e) => setFormDelete(e.target.value)}
              />
              {/* Buttons are displayed conditionally */}

              {deleteStatus === -1 && <p>Delete Error: Could be deleting a nonexistent or non-user block.</p>}
              {deleteStatus === 1 && <p>Block successfully deleted!</p>}
              {!isPendingDelete && <button name='deleteButton'>Delete from Gallery</button>}
              {isPendingDelete && <button disabled name='deleteButton'>Deleting...</button>}
            </form>
            </div>
          </Col>

          {/* Column for unit tests */}
          <Col flex={'48%'} className = "codeBlockCol">
            <h1>Run Unit Tests</h1>
            <h3>Unit Test 1</h3>
            <button onClick={handleUnitTest1}>Send Invalid Block (Should Not Send)</button>
            {test1Status === 1 && <p>TEST PASSED! ✅</p>}
            {test1Status === -1 && <p>TEST FAILED! ❌</p>}
            <h3>Unit Test 2</h3>
            <button onClick={handleUnitTest2}>Receive Nonexistent Block (Should Not Receive)</button>
            {test2Status === 1 && <p>TEST PASSED! ✅</p>}
            {test2Status === -1 && <p>TEST FAILED! ❌</p>}
            <h3>Unit Test 3</h3>
            <button onClick={handleUnitTest3}>Receive Valid Block (Should Receive)</button>
            {test3Status === 1 && <p>TEST PASSED! ✅</p>}
            {test3Status === -1 && <p>TEST FAILED! ❌</p>}
            <h3>Unit Test 4</h3>
            <button onClick={handleUnitTest4}>Delete Invalid Block (Should Not Delete)</button>
            {test4Status === 1 && <p>TEST PASSED! ✅</p>}
            {test4Status === -1 && <p>TEST FAILED! ❌</p>}
            <h3>Unit Test 5</h3>
            <button onClick={handleUnitTest5}>Delete Non-User Block (Should Not Delete)</button>
            {test5Status === 1 && <p>TEST PASSED! ✅</p>}
            {test5Status === -1 && <p>TEST FAILED! ❌</p>}
            <h3>Unit Test 6</h3>
            <button onClick={handleUnitTest6Helper}>(Helper) Delete Unit Test 6 Block</button>
            <br></br>
            <br></br>
            <button onClick={handleUnitTest6A}>(A) Upload New Block (Should Upload)</button>
            <br></br>
            {test6Status[0] === 1 && <p>TEST PASSED! ✅</p>}
            {test6Status[0] === -1 && <p>TEST FAILED! ❌</p>}
            <br></br>
            <button onClick={handleUnitTest6B}>(B) Receive New Block (Should Receive)</button>
            <br></br>
            {test6Status[1] === 1 && <p>TEST PASSED! ✅</p>}
            {test6Status[1] === -1 && <p>TEST FAILED! ❌</p>}
            <br></br>
            <button onClick={handleUnitTest6C}>(C) Delete New Block (Should Delete)</button>
            <br></br>
            {test6Status[2] === 1 && <p>TEST PASSED! ✅</p>}
            {test6Status[2] === -1 && <p>TEST FAILED! ❌</p>}
            <br></br>
            <button onClick={handleUnitTest6D}>(D) Receive Deleted Block (Should Not Receive)</button>
            <br></br>
            {test6Status[3] === 1 && <p>TEST PASSED! ✅</p>}
            {test6Status[3] === -1 && <p>TEST FAILED! ❌</p>}
            <br></br>
          </Col>
        </Row>
        </div>
      </div>

      {/* End of Block Generator */}


      {/* Jeris Contribution of setup for the Gallery}
      {/* Start of the Gallery Components*/}
      <div
      id='bottom-container'
      className='flex flex-column vertical-container overflow-visible'
      >
        <Row>
          <h1 id = "section-header">Gallery of Shared Code</h1>
        </Row>
        <Row>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
                <Col >
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
            
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
                <Col>
                    <div className='CodeBlock'>
                      <p className = "code">Code goes here</p>
                      <h2 className = "studentName">Student Name</h2>
                    </div>
                </Col>
            </Row>
        </div>
      {/* End of Gallery Componenets */}

      {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
      <xml id='toolbox' is='Blockly workspace'>
        {
          // Maps out block categories
          activity &&
            activity.toolbox &&
            activity.toolbox.map(([category, blocks]) => (
              <category name={category} is='Blockly category' key={category}>
                {
                  // maps out blocks in category
                  // eslint-disable-next-line
                  blocks.map((block) => {
                    return (
                      <block
                        type={block.name}
                        is='Blockly block'
                        key={block.name}
                      />
                    );
                  })
                }
              </category>
            ))
        }
      </xml>

      {compileError && (
        <Alert
          message={compileError}
          type='error'
          closable
          onClose={(e) => setCompileError('')}
        ></Alert>
      )}
    </div>

    //Start of Block Sharing for Gallery

  );
}
