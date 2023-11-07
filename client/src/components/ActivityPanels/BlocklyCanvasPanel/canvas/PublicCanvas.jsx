import React, { useEffect, useRef, useState, useReducer } from 'react';
import { Link } from 'react-router-dom';
import '../../ActivityLevels.less';
import { compileArduinoCode } from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert, Menu, Dropdown } from 'antd';
import CodeModal from '../modals/CodeModal';
import ConsoleModal from '../modals/ConsoleModal';
import PlotterModal from '../modals/PlotterModal';
import {
  connectToPort,
  handleCloseConnection,
  handleOpenConnection,
} from '../../Utils/consoleHelpers';
import ArduinoLogo from '../Icons/ArduinoLogo';
import PlotterLogo from '../Icons/PlotterLogo';

let plotId = 1;

export default function PublicCanvas({ activity, isSandbox }) {
  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');

  const [forceUpdate] = useReducer((x) => x + 1, 0);
  const workspaceRef = useRef(null);
  const activityRef = useRef(null);

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
    });
    Blockly.Blocks['initial'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("name")
            .appendField(new Blockly.FieldTextInput("block_type"), "block_name");
        this.appendStatementInput("NAME")
            .setCheck("input")
            .appendField("inputs");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["automatic","automatic"], ["external","external"], ["internal","internal"]]), "InputsInLine")
            .appendField("inputs");
        this.appendValueInput("tooltip")
            .setCheck("String")
            .appendField("tooltip");
        this.appendValueInput("help_url")
            .setCheck("String")
            .appendField("help url");
        this.appendValueInput("color")
            .setCheck("color")
            .appendField("color");
        this.setColour(120);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['initial'] = function(block) {
      var text_block_name = block.getFieldValue('block_name');
      var statements_name = Blockly.Arduino.statementToCode(block, 'NAME');
      var dropdown_inputsinline = block.getFieldValue('InputsInLine');
      var value_tooltip = Blockly.Arduino.valueToCode(block, 'tooltip', Blockly.Arduino.ORDER_ATOMIC);
      var value_help_url = Blockly.Arduino.valueToCode(block, 'help_url', Blockly.Arduino.ORDER_ATOMIC);
      var value_color = Blockly.Arduino.valueToCode(block, 'color', Blockly.Arduino.ORDER_ATOMIC);
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['value_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("value input");
        this.appendStatementInput("fields")
            .setCheck("field")
            .appendField("fields")
            .appendField(new Blockly.FieldDropdown([["left","left"], ["right","right"], ["center","center"]]), "fields");
        this.appendValueInput("type")
            .setCheck("type")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("type");
        this.setPreviousStatement(true, "input");
        this.setNextStatement(true, "input");
        this.setColour(210);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['value_input'] = function(block) {
      var dropdown_fields = block.getFieldValue('fields');
      var statements_fields = Blockly.Arduino.statementToCode(block, 'fields');
      var value_type = Blockly.Arduino.valueToCode(block, 'type', Blockly.Arduino.ORDER_ATOMIC);
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['statement_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("statement input");
        this.appendStatementInput("fields")
            .setCheck("field")
            .appendField("fields")
            .appendField(new Blockly.FieldDropdown([["left","left"], ["right","right"], ["center","center"]]), "fields");
        this.appendValueInput("type")
            .setCheck("type")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("type");
        this.setPreviousStatement(true, "input");
        this.setNextStatement(true, "input");
        this.setColour(210);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['statement_input'] = function(block) {
      var dropdown_fields = block.getFieldValue('fields');
      var statements_fields = Blockly.Arduino.statementToCode(block, 'fields');
      var value_type = Blockly.Arduino.valueToCode(block, 'type', Blockly.Arduino.ORDER_ATOMIC);
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['dummy_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("dummy input");
        this.appendStatementInput("fields")
            .setCheck("field")
            .appendField("fields")
            .appendField(new Blockly.FieldDropdown([["left","left"], ["right","right"], ["center","center"]]), "fields");
        this.setPreviousStatement(true, "input");
        this.setNextStatement(true, "input");
        this.setColour(210);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['dummy_input'] = function(block) {
      var dropdown_fields = block.getFieldValue('fields');
      var statements_fields = Blockly.Arduino.statementToCode(block, 'fields');
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['blank_text'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("text")
            .appendField(new Blockly.FieldTextInput(""), "text");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, "field");
        this.setColour(160);
     this.setTooltip("");
     this.setHelpUrl("");
     
      }
    };
    Blockly.Arduino['blank_text'] = function(block) {
      var text_text = block.getFieldValue('text');
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['named_text'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("text")
            .appendField(new Blockly.FieldTextInput(""), "text")
            .appendField(",")
            .appendField(new Blockly.FieldTextInput("NAME"), "text_name");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, "field");
        this.setColour(160);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['named_text'] = function(block) {
      var text_text = block.getFieldValue('text');
      var text_text_name = block.getFieldValue('text_name');
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['text_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("text input")
            .appendField(new Blockly.FieldTextInput("default"), "text")
            .appendField(",")
            .appendField(new Blockly.FieldTextInput("NAME"), "text_name");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, "field");
        this.setColour(160);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['text_input'] = function(block) {
      var text_text = block.getFieldValue('text');
      var text_text_name = block.getFieldValue('text_name');
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['num_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("numeric input")
            .appendField(new Blockly.FieldNumber(0), "numeric input")
            .appendField(",")
            .appendField(new Blockly.FieldTextInput("NAME"), "numeric input name");
        this.appendDummyInput()
            .appendField("min")
            .appendField(new Blockly.FieldNumber(-Infinity), "minimum")
            .appendField("max")
            .appendField(new Blockly.FieldNumber(Infinity), "maximum")
            .appendField("precision")
            .appendField(new Blockly.FieldNumber(0), "precision");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, "field");
        this.setColour(160);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['num_input'] = function(block) {
      var number_numeric_input = block.getFieldValue('numeric input');
      var text_numeric_input_name = block.getFieldValue('numeric input name');
      var number_minimum = block.getFieldValue('minimum');
      var number_maximum = block.getFieldValue('maximum');
      var number_precision = block.getFieldValue('precision');
      var code = '...;\n';
      return code;
    };
    Blockly.Blocks['angle_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("angle input")
            .appendField(new Blockly.FieldAngle(90), "angle")
            .appendField(",")
            .appendField(new Blockly.FieldTextInput("NAME"), "angle_name");
        this.setPreviousStatement(true, "fields");
        this.setNextStatement(true, "fields");
        this.setColour(160);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    Blockly.Arduino['angle_input'] = function(block) {
      var angle_angle = block.getFieldValue('angle');
      var text_angle_name = block.getFieldValue('angle_name');
      var code = '...;\n';
      return code;
    };
  };

  useEffect(() => {
    // once the activity state is set, set the workspace and save
    const setUp = async () => {
      activityRef.current = activity;
      if (!workspaceRef.current && activity && Object.keys(activity).length !== 0) {
        setWorkspace();
      }
    };
    setUp();
  }, [activity]);

  const handleUndo = () => {
    if (workspaceRef.current.undoStack_.length > 0)
      workspaceRef.current.undo(false);
  };

  const handleRedo = () => {
    if (workspaceRef.current.redoStack_.length > 0)
      workspaceRef.current.undo(true);
  };
  const showBox = () => {

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
                Program your Arduino...
              </Col>
              <Col flex='auto'>
                <Row align='middle' justify='end' id='description-container'>
                  <Col flex={'30px'}>
                    <Row>
                      <Col>
                        <Link id='link' to={'/'} className='flex flex-column'>
                          <i className='fa fa-home fa-lg' />
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex='auto' />

                  <Col flex={'200px'}>
                    <Row>
                      <Col className='flex flex-row'>
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
                        <button
                        Insert a block
                        //onClick={showBox}
                        id='link'
                        className= 'flex flex-column'
                        >
                        </button>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={'230px'}>
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
        <category name='Custom'>
          <block type='initial'></block>
          <block type='value_input'></block>
          <block type='statement_input'></block>
          <block type='dummy_input'></block>
          <block type='blank_text'></block>
          <block type='named_text'></block>
          <block type='text_input'></block>
          <block type='num_input'></block>
          <block type='angle_input'></block>
          </category>
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
