import "./App.css";
import { useState, useRef, useEffect, useMemo } from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeText";

function App() {
  // 일기 데이터를 배열로 저장
  const [data, setData] = useState([]);
  const dataId = useRef(1);
  const getData = async () => {
    // fetch 이후 json으로 변환
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((iter) => {
      return {
        author: iter.email,
        content: iter.body,
        // 1~5 사이의 랜덤한 숫자 부여
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  // Mount하는 시점에 실행하는 코드
  useEffect(() => {
    getData();
  }, []);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      id: dataId.current,
      author,
      content,
      emotion,
      created_date,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((iter) => iter.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((iter) =>
        iter.id === targetId ? { ...iter, content: newContent } : iter
      )
    );
  };

  // data.length가 변화할때만 연산 수행
  // 값을 리턴받기 때문에 함수가 아님
  // 값으로 사용해야한다.
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((iter) => iter.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <OptimizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      {/* App의 Data가 바뀌면 자식 Component도 리렌더링 */}
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
