import React, { useEffect, useRef, useState, useReducer } from 'react';
import '../../ActivityLevels.less';
import { compileArduinoCode, handleSave } from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert, Dropdown, Menu } from 'antd';
import { getSaves } from '../../../../Utils/requests';
import CodeModal from '../modals/CodeModal';
import ConsoleModal from '../modals/ConsoleModal';
import PlotterModal from '../modals/PlotterModal';
import DisplayDiagramModal from '../modals/DisplayDiagramModal'
import VersionHistoryModal from '../modals/VersionHistoryModal';
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
import { useNavigate } from 'react-router-dom';

let plotId = 1;

export default function StudentCanvas({ activity }) {
  const [hoverGenerator, setHoverGenerator] = useState(false); // Hover state for Generator Button

  const [hoverSave, setHoverSave] = useState(false);
  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');
  const [saves, setSaves] = useState({});
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [lastAutoSave, setLastAutoSave] = useState(null);

  const [forceUpdate] = useReducer((x) => x + 1, 0);
  


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
  const workspaceRef = useRef(null);
  const activityRef = useRef(null);

  const replayRef = useRef([]);
  const clicks = useRef(0);

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
    });
    window.Blockly.addChangeListener(blocklyEvent);

    

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

  const loadSave = (selectedSave) => {
    try {
      let toLoad = activity.template;
      if (selectedSave !== -1) {
        if (lastAutoSave && selectedSave === -2) {
          toLoad = lastAutoSave.workspace;
          setLastSavedTime(getFormattedDate(lastAutoSave.updated_at));
        } else if (saves.current && saves.current.id === selectedSave) {
          toLoad = saves.current.workspace;
          setLastSavedTime(getFormattedDate(saves.current.updated_at));
        } else {
          const s = saves.past.find((save) => save.id === selectedSave);
          if (s) {
            toLoad = s.workspace;
            setLastSavedTime(getFormattedDate(s.updated_at));
          } else {
            message.error('Failed to restore save.');
            return;
          }
        }
      } else {
        setLastSavedTime(null);
      }
      let xml = window.Blockly.Xml.textToDom(toLoad);
      if (workspaceRef.current) workspaceRef.current.clear();
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      workspaceRef.current.clearUndo();
    } catch (e) {
      message.error('Failed to load save.');
    }
  };

  const pushEvent = (type, blockId = '') => {
    let blockType = '';
    if (blockId !== '') {
      let type = window.Blockly.mainWorkspace.getBlockById(blockId)?.type;
      type ? blockType = type : blockType = ''; 
    }

    let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
    let xml_text = window.Blockly.Xml.domToText(xml);
    replayRef.current.push({
      xml: xml_text,
      action: type,
      blockId: blockId,
      blockType: blockType,
      timestamp: Date.now(),
      clicks: clicks.current,
    });
  };

  let blocked = false;
  const blocklyEvent = (event) => {
    // if it is a click event, add click
    if (
      (event.type === 'ui' && event.element === 'click') ||
      event.element === 'selected'
    ) {
      clicks.current++;
    }

    // if it is other ui events or create events or is [undo, redo], return
    if (event.type === 'ui' || !event.recordUndo) {
      return;
    }

    // if event is in timeout, return
    if (event.type === 'change' && blocked) {
      return;
    }

    // if the event is change field value, only accept the latest change
    if (
      event.type === 'change' &&
      event.element === 'field' &&
      replayRef.current.length > 1 &&
      replayRef.current[replayRef.current.length - 1].action ===
        'change field' &&
      replayRef.current[replayRef.current.length - 1].blockId === event.blockId
    ) {
      replayRef.current.pop();
    }

    // event delete always comes after a move, ignore the move
    if (event.type === 'delete') {
      if (replayRef.current[replayRef.current.length - 1].action === 'move') {
        replayRef.current.pop();
      }
    }

    // if event is change, add the detail action type
    if (event.type === 'change' && event.element) {
      pushEvent(`${event.type} ${event.element}`, event.blockId);
    } else {
      pushEvent(event.type, event.blockId);
    }

    // timeout for half a second
    blocked = true;
    setTimeout(() => {
      blocked = false;
    }, 500);
  };

  useEffect(() => {
    // automatically save workspace every min
    let autosaveInterval = setInterval(async () => {
      if (workspaceRef.current && activityRef.current) {
        const res = await handleSave(
          activityRef.current.id,
          workspaceRef,
          replayRef.current
        );
        if (res.data) {
          setLastAutoSave(res.data[0]);
          setLastSavedTime(getFormattedDate(res.data[0].updated_at));
        }
      }
    }, 60000);

    // clean up - saves workspace and removes blockly div from DOM
    return async () => {
      clearInterval(autosaveInterval);
    };
  }, []);

  useEffect(() => {
    // once the activity state is set, set the workspace and save
    const setUp = async () => {
      activityRef.current = activity;
      if (!workspaceRef.current && activity && Object.keys(activity).length !== 0) {
        setWorkspace();

        let onLoadSave = null;
        const res = await getSaves(activity.id);
        if (res.data) {
          if (res.data.current) onLoadSave = res.data.current;
          setSaves(res.data);
        } else {
          console.log(res.err);
        }

        if (onLoadSave) {
          let xml = window.Blockly.Xml.textToDom(onLoadSave.workspace);
          window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          replayRef.current = onLoadSave.replay;
          setLastSavedTime(getFormattedDate(onLoadSave.updated_at));
        } else if (activity.template) {
          let xml = window.Blockly.Xml.textToDom(activity.template);
          window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        }

        pushEvent('load workspace');
        workspaceRef.current.clearUndo();
      }
    };
    setUp();
  }, [activity]);

  const handleManualSave = async () => {
    // save workspace then update load save options
    pushEvent('save');
    const res = await handleSave(activity.id, workspaceRef, replayRef.current);
    if (res.err) {
      message.error(res.err);
    } else {
      setLastSavedTime(getFormattedDate(res.data[0].updated_at));
      message.success('Workspace saved successfully.');
    }

    const savesRes = await getSaves(activity.id);
    if (savesRes.data) setSaves(savesRes.data);
  };

  const handleUndo = () => {
    if (workspaceRef.current.undoStack_.length > 0) {
      workspaceRef.current.undo(false);
      pushEvent('undo');
    }
  };

  const handleRedo = () => {
    if (workspaceRef.current.redoStack_.length > 0) {
      workspaceRef.current.undo(true);
      pushEvent('redo');
    }
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
      pushEvent('show serial monitor');
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
      pushEvent('show serial plotter');
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
        true
      );
      pushEvent('compile');
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

  const getFormattedDate = (value, locale = 'en-US') => {
    let output = new Date(value).toLocaleDateString(locale);
    return output + ' ' + new Date(value).toLocaleTimeString(locale);
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
      <Menu.Item>
        <CodeModal title={'Arduino Code'} workspaceRef={workspaceRef.current} />
      </Menu.Item>
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
                {activity.lesson_module_name}
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

                  <Col flex={'300px'}>
                    {lastSavedTime ? `Last changes saved ${lastSavedTime}` : ''}
                  </Col>
                  <Col flex={'350px'}>
                    <Row>
                      


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



                      <Col className='flex flex-row' id='icon-align'>
                        <VersionHistoryModal
                          saves={saves}
                          lastAutoSave={lastAutoSave}
                          defaultTemplate={activity}
                          getFormattedDate={getFormattedDate}
                          loadSave={loadSave}
                          pushEvent={pushEvent}
                        />
                        <button
                          onClick={handleManualSave}
                          id='link'
                          className='flex flex-column'
                        >
                          <i
                            id='icon-btn'
                            className='fa fa-save'
                            onMouseEnter={() => setHoverSave(true)}
                            onMouseLeave={() => setHoverSave(false)}
                          />
                          {hoverSave && (
                            <div className='popup ModalCompile4'>Save</div>
                          )}
                        </button>
                      </Col>

                      <Col className='flex flex-row' id='icon-align'>
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
                    </Row>
                  </Col>
                  <Col flex={'180px'}>
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
              </Col>
            </Row>
            <div id='blockly-canvas' />
          </Spin>
        </div>

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
        <h1>Block Generator</h1>
        <h2>Define custom blocks here!</h2>

        {/* Mason's Contribution: Added 4 columns for forms that interact with back-end */}
        <Row className='justify-content-center' align='middle' justify='middle'>

          {/* Column for uploading blocks to the back-end */}
          <Col flex={'25%'}>
            <h1>Send a block to back-end</h1>
            <form onSubmit={handleSubmitSendOrReload}>
              <label>Block Definition</label>
              <br></br>
              <textarea
                type="text"
                required
                value={formBD}
                onChange={(e) => setFormBD(e.target.value)}
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

          {/* Column for deleting blocks from the back-end */}
          <Col flex={'25%'}>
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
          </Col>

          {/* Column for receiving blocks from back-end */}
          <Col flex={'25%'}>
            <h1>Receive a block from back-end</h1>
            <form onSubmit={handleSubmitReceive}>
              <label style={{'margin-right': '1em'}}>Block ID</label>
              <input
                type="text"
                required
                value={formReceive}
                onChange={(e) => setFormReceive(e.target.value)}
              />
              <NewlineText text ={formReceivePayload}></NewlineText>
              {/* Buttons are displayed conditionally */}

              {!isPendingReceive && <button name='receiveButton'>Receive from Gallery</button>}
              {isPendingReceive && <button disabled name='receiveButton'>Receiving...</button>}
            </form>
          </Col>

          {/* Column for unit tests */}
          <Col flex={'25%'}>
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
  );
}
