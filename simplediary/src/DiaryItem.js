import React, { useState, useRef } from "react";

const DiaryItem = ({
  onEdit,
  onRemove,
  author,
  content,
  created_date,
  emotion,
  id,
}) => {
  const handleRemove = () => {
    console.log(id);
    if (window.confirm(`${id}번째 일기를 정말 삭제하겠습니까?`)) {
      onRemove(id);
    }
  };

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  const handleEdit = () => {
    if (content.length < 5) {
      localContentInput.current.focus();
    }
    if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
    }
    toggleIsEdit(isEdit);
  };

  const localContentInput = useRef();
  const [localContent, setLocalContent] = useState(content);
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자: {author} | 감정점수 : {emotion}
        </span>
        <br />
        <span className="date">
          {/* ms 시간을 전달하여 Date객체를 만들어 
            사람이 보기 편한 시간으로 변환 */}
          {new Date(created_date).toLocaleString()}
        </span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(event) => setLocalContent(event.target.value)}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정취소</button>
          <button onClick={handleEdit}>수정완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
