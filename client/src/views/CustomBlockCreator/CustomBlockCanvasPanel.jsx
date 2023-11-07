import React from 'react';
import CustomBlockCanvas from '../../components/ActivityPanels/BlocklyCanvasPanel/canvas/CustomBlockCanvas';
import { useGlobalState } from '../../Utils/userState';

const CustomBlockCanvasPanel = ({ activity, isSandbox, setActivity }) => {
  const [value] = useGlobalState('currUser');

  const userRole = value.role;
  console.log(userRole);
  
  return <CustomBlockCanvas activity={activity} isSandbox={isSandbox} />
};

export default CustomBlockCanvasPanel;
