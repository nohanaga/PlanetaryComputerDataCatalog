import React, { useState } from "react";

const InfoPanel = () => {
  const [message, setMessage] = useState("〇〇score");
  const handleMessageChange = (event:any) => {
    setMessage(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className="hanapanel ms-Stack">
      <textarea value={message} onChange={handleMessageChange}/>
    </div>
  );
};

export default InfoPanel;