import React, { useState } from 'react';
import './FlagButton.less';
import Flag from  "../../assets/flag.png";

export default function FlagButton({ id }) {
  const [highlighted, setHighlighted] = useState(false);

  const handleClick = () => {
    setHighlighted(!highlighted);
  }

  return (
    <button id="flag-button" className={highlighted ? 'highlighted' : ''} type='button' onClick={handleClick} disabled={highlighted}>
      <img src={Flag} alt="Flag" />
    </button>
  );
}