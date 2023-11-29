import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./FlagButton.less";
import Flag from "../../assets/flag.png";

export default function FlagButton({ id }) {
  // State for button highlight and message visibility
  const [highlighted, setHighlighted] = useState(false);
  const [message, setMessage] = useState({ words: 0 });

  // Initialize EmailJS
  emailjs.init("SM7VwO6yrGjIp_Z_M");

  // Function to send email
async function sendEmail(reason) {
  try {
    await emailjs.send("service_9y45peo", "template_b73zh4s", {
      video_id: id,
      reason: reason,
      page_link: window.location.href,
    });
  } catch (error) {
    console.error('There was an error sending the email:', error);
  }
}

  // Handle button click
  const handleClick = async () => {
    const reason = window.prompt("Please enter a reason for reporting this video:");
    if (reason) {
      setHighlighted(!highlighted);
      await sendEmail(reason);
    }
  };

  // Button component
  return (
    <button
      id="flag-button"
      className={highlighted ? "highlighted" : ""}
      type="button"
      onClick={handleClick}
      disabled={highlighted}
      onMouseEnter={(e) => setMessage({ words: 1 })}
      onMouseLeave={(e) => setMessage({ words: 0 })}
    >
      <img src={Flag} alt="Flag" />
      <div id="message" style={{ opacity: message.words }}>
        Report video
      </div>
    </button>
  );
}