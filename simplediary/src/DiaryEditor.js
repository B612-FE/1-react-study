import React, { useRef, useState, useEffect, useContext } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {
  // 구조분해할당으로 받아야 한다.
  const { onCreate } = useContext(DiaryDispatchContext);

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });
  // 정상적인 입력결과가 아닐 때 focus를 주는 기능 추가
  const authorInput = useRef();
  const contentInput = useRef();

  const handleChangeState = (event) => {
    setState({
      // spread 연산자가 위에 위치해야한다.
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      // focus -> useRef 사용
      authorInput.current.focus();
      return;
    }
    if (state.content.length < 5) {
      // focus -> useRef 사용
      contentInput.current.focus();
      return;
    }
    onCreate(state.author, state.content, state.emotion);
    alert("저장 완료");
    setState({ author: "", content: "", emotion: 1 });
  };
  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          // name
          // value
          // onChange
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
        <div>
          <textarea
            //name
            // value
            // onChange
            ref={contentInput}
            name="content"
            value={state.content}
            onChange={handleChangeState}
          />
        </div>
        <div>
          <select
            // name
            // value
            // onChange
            name="emotion"
            value={state.emotion}
            onChange={handleChangeState}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div>
          <button onClick={handleSubmit}>일기 저장하기</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);
