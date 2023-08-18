import React, { useState, useEffect } from "react";

// text가 변경될때만 리렌더링
const Textview = React.memo(({ text }) => {
  return <div>{text}</div>;
});

// count가 변경될때만 리렌더링
const Countview = React.memo(({ count }) => {
  return <div>{count}</div>;
});

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [text, setText] = useState("");
  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Count</h2>
        <Countview count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>Text</h2>
        <Textview text={text} />
        <input value={text} onChange={(event) => setText(event.target.value)} />
      </div>
    </div>
  );
};

export default OptimizeTest;
