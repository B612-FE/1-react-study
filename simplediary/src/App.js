import "./App.css";
import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeText";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE":
      const created_date = new Date().getTime();
      const newItem = { ...action.data, created_date };
      return [newItem, ...state];
    case "REMOVE":
      return state.filter((iter) => iter.id !== action.targetId);
    case "EDIT":
      return state.map((iter) =>
        iter.id === action.targetId
          ? { ...iter, content: action.newContent }
          : iter
      );
    default:
      return state;
  }
};

// export 붙여서 선언하기
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // 일기 데이터를 배열로 저장
  // const [data, setData] = useState([]);
  // useReducer로 구현
  const [data, dispatch] = useReducer(reducer, []);

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
    dispatch({ type: "INIT", data: initData });
    // setData(initData);
  };

  // Mount하는 시점에 실행하는 코드
  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      id: dataId.current,
      author,
      content,
      emotion,
      created_date,
    };

    // 함수형 업데이트
    // setData((data) => [newItem, ...data]);
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {
    const newDiaryList = data.filter((iter) => iter.id !== targetId);
    // 함수형 업데이트
    // setData((data) => newDiaryList);
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    // 함수형 업데이트
    // setData((data) =>
    //   data.map((iter) =>
    //     iter.id === targetId ? { ...iter, content: newContent } : iter
    //   )
    // );
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

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

  // 재생성되지 않게 객체를 묶는 기법 
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  return (
    <div className="App">
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext value={memoizedDispatches}>
          <OptimizeTest />
          <DiaryEditor onCreate={onCreate} />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          {/* App의 Data가 바뀌면 자식 Component도 리렌더링 */}
          <DiaryList onRemove={onRemove} onEdit={onEdit} />
        </DiaryDispatchContext>
      </DiaryStateContext.Provider>
    </div>
  );
}

export default App;
