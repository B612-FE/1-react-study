import DiaryItem from "./DiaryItem";
import { useContext } from "react";
import { DiaryDispatchContext, DiaryStateContext } from "./App";

// Array를 props로 전달받을 때는 중괄호로 감싸야 한다.
const DiaryList = () => {
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);
  const diaryList = useContext(DiaryStateContext);

  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {/* map 내장함수를 이용하여 리스트 형태로 렌더링 */}
        {/* map은 화살표 함수 사용 시 중괄호 대신 소괄호 사용.. why? */}
        {diaryList.map((iter) => (
          <DiaryItem
            key={iter.id}
            {...iter}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

// Default Props 설정
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
