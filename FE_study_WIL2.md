# WIL #2

# React developer tools

---

Components - 각 컴포넌트의 state,ref,effect, props,함수, key값 등을 보여줌

re-render되고 있는 부분 보여줌

# 최적화 1 - useMemo

---

## 연산결과 재사용

### memoization

이미 계산해 본 연산 결과를 기억해두었다가 동일한 계산을 시키면, 다시 연산하지 않고  기억해 두었던 데이터를 반환하게 하는 방법

### memoization을 사용한 연산 최적화

return을 가진 함수의 연산을 최적화 하기 위해 useMemo 함수 사용 - memoization 하고 싶은 함수를 감싸줌

의존성 배열 안에 있는 값이 변할 때만 새롭게 계산

useMemo로 감싼 함수는 더이상 함수가 아님! - 사용시 함수가 아니라 값으로 사용해야함

```jsx
const getDiaryAnalysis = useMemo(() => {
    if (data.length === 0) {
      return { goodcount: 0, badCount: 0, goodRatio: 0 };
    }
    console.log("일기 분석 시작");

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100.0;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
```

# 최적화2 - React.memo

---

### 컴포넌트 재사용

부모 컴포넌트가 리렌더 되면 자식 컴포넌트도 리렌더됨 → 불필요한 리렌더로 낭비

자식 컴포넌트에 업데이트 조건을 걸어둬서 낭비를 막는다

*함수형 컴포넌트에게 업데이트 조건을 걸자 → React.memo*

- 고차 컴포넌트 : 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수
    
    ```jsx
    const Mycomponent = React.memo(function MyComponent(props){
    	/*props 를 사용하여 렌더링 */
    });
    ```
    

같은 prop을 넣으면 리렌더링하지 않는다.

자기자신의 state가 바뀌면 리렌더됨.

### areEqual 함수

객체의 주소에 의한 비교 - 얕은 비교 → 같은 주소에 있냐를 비교함

areEqual 함수를 사용하여 객체도 바뀌는지 판단 가능

```jsx
const areEqual = (prevProps, nextProps) => {
  if (prevProps.obj.count === nextProps.obj.count) {
    return true; //리렌더링을 하지 말아라
  }
  return false; // 리렌더링 하라
};

const MemoizedCounterB = React.memo(CounterB, areEqual);
```

# 최적화3 - useCallback

---

최적화 대상 컴포넌트를 찾자  - react developer tools 에서 리렌더링되는 부분을 확인

컴포넌트 렌더링 조건

1. 본인 가진 state 변경
2. 부모 컴포넌트 리렌더링
3. 자신이 받은 prop 변경 시

### useCallback

메모이제이션된 콜백을 반환한다( 값이 아니라)

```jsx
const memoizedCallback = useCallback(
	() => {
		doSomething (a,b);
	},
	[a,b],
);
```

최적화하고 싶은 useCallback으로 컴포넌트를 감싸줌

```jsx
const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current
    };

    dataId.current += 1;
    setData([newItem, ...data]);
  }, []);
```

함수는 컴포넌트가 재생성될때 현재의 state 값을 참조할 수 있어야해서 다시 생성됨.

useCallback에 갇혀서 최신의 데이터 state를 참조할 수 없는 딜레마 

→ **함수형 업데이트**로 해결 (setState함수에 함수를 전달하는 것)

```jsx
setData((data) => [newItem, ...data]);
```

dependency  array를 비워도, 인자를 통해 최신의 state 참조 가능해짐

# 최적화4 - 최적화 완성

---

item 하나 삭제하니까 다른 item 모두 리렌더링되는 문제

DiaryItem 컴포넌트 memo로 묶어서 export

```jsx
const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId));
  }, []);
```

최신형 state를 참조하기위해서 함수형 업데이트에 인자부분에 data, return 부분에 data 사용

```jsx
const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  }, []);
```

# 복잡한 상태 관리 로직 분리하기 - useReducer

---

**컴포넌트에서 상태 변화 로직을 분리하자**

**`useReducer`**를 사용하여 상태변화함수를 컴포넌트 외부로 분리해서 switch-case문법처럼 쉽게 처리할 수 있음

```jsx
const Counter = () => {
	const [count, dispatch] = useReducer(reducer,1);
	// state, 상태를 변화시키는 action을 발생시키는 함수
	// reducer : action 처리 , 1 = 초기값
	return(
	<div>
		{count} //새로운 상태 반영
		<button onClick ={()=>dispatch({type:1})}> add1</button>
		...
	</div>
	);
};
```

- reducer : 상태 변화 처리 함수(*dispatch가 action 을 발생시키면 reducer가 처리)*
- dispatch와 함께 전달되는 객체 : Action 객체 = 상태변화
- reducer가 반환하는 값 = 새로운 상태 → count가 업데이트

reducer 작성을 위해 어떤 type들의 action 이 존재할 수 있는지 알아봄

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId
          ? {
              ...it,
              content: action.newContent
            }
          : it
      );
    }
    default:
      return state;
  }
};

const initData = res.slice(0, 20).map((it) => {
      return {
				...
      };
    });
    dispatch({ type: "INIT", data: initData });
  };
const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current }
    });
    dataId.current += 1;
  }, []);

const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({
      type: "EDIT",
      targetId,
      newContent
    });
  }, []);
```

# 컴포넌트 트리에 데이터 공급하기 - context

---

그냥 거쳐가기만 하는 prop들이 존재함 - **props drilling**

해결 : 

- 모든 데이터를 가진 component가 provider라는 공급자 역할을 하는 자식 컴포넌트에게 모든 데이터를 줌.
- provider는 자신의 자손에 해당하는 component들에게 직통으로 data 공급해줌
- **Context** (문맥): provider component의 자식으로 배치되어 해당 provider가 공급하는 모든 데이터에 접근할 수 있는 component의 영역

```jsx
//context 생성
const MyContext = React.createContext(defaultValue);
// context provider를 통한 데이터 공급
<MyContext.Provider value ={전역으로 전달하고자 하는 값}>
	{/*이 Context 안에 위치할 자식 컴포넌트들 */}
</MyContext.Provider>
```

```jsx
export const DiaryStateContext = createContext(null);
export const DiaryDispatchContext = createContext(null);

return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatch}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
```

```jsx
import React, { useContext } from "react";
import { DiaryStateContext } from "./App";
import DiaryItem from "./DiaryItem";

const DiaryList = () => {
  const diaryList = useContext(DiaryStateContext);
//DiaryStateContext에서 context 꺼내와서 사용
```

onEdit, onRemove에서 일어나는 props drilling을 해결하기 위해 Provider의 value에 전달하게 되면, provider도 컴포넌트이기 때문에 prop이 바뀌면 재생성됨 → 자식 컴포넌트도 재생성됨 → 최적화 불가

→ context 중첩으로 해결

dispatch context를 새로 생성, onEdit, onRemove를 dispatch context 의 value로 전달

```jsx
const memoizedDispatch = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);
...
<DiaryDispatchContext.Provider value={memoizedDispatch}>
//usememo를 사용하지 않으면
//app component 객체 재생성될때 dispatch 객체도 재생성되기때문에 usememo 사용

// diaryEditor.js
const DiaryEditor = () => {
  const { onCreate } = useContext(DiaryDispatchContext);
//객체로 전달되기 때문에 비구조화 할당으로 받음

//diaryList.js
const DiaryList = () => {
  const diaryList = useContext(DiaryStateContext);

//diaryItem.js
const DiaryItem = ({ id, author, content, emotion, created_date }) => {
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);
```

# 페이지 라우팅 - React SPA& CSR

---

### routing

: 경로를 정해주는 행위 자체와 그런 과정

**router** : 데이터의 경로를 실시간으로 지정해주는 역할을 하는 무언가

### Page Routing

요청에 따라서 어떤 페이지를 반환할지 결정하는 것

/home → home.html 반환

**MPA(Multipate Application)** : 여러개의 페이지를 준비해놨다가 요청에 따라 적절한 페이지를 반환하는 형식

**react는 Singe Page Application (SPA)**

페이지 이동시 깜빡이지 않음. 

react app이 알아서 페이지를 업데이트시킴. 웹서버가 작동x

<aside>
💡 REACT 에서는 SPA 방식을 통한 페이지 이동, CSR(Client Side Rendering)으로 화면을 렌더링함

</aside>

# React Router 기본

---

React Router library 설치하여 사용하기

### 페이지 경로에 따라 MAPPING

```jsx
import "./App.css";
import {BrowserRouter,Route,Routes} from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/new";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

function App() {
  return(
    <BrowserRouter>
      <divclassName="App">
        <h2>App.js</h2> /* routes 밖에 있기 때문에 변하지 않음*/
        <Routes>
          <Route path = "/" element ={Home />} />
          <Route path = "/new" element ={new />} />
          <Route path = "/edit" element ={edit />} />
          <Route path = "/diary" element ={diary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### 페이지 이동

a태그는 외부로 나갈때만 사용

```jsx
import {Link} from "react-router-dom";

const RouteTest = () =>{
	return (
		<>
			<Link to {"/"}>Home</Link>
			<br/>
			<Link to {'/diary'}>Diary</Link>
			....
		</>
	);
}
```

url 경로별로 렌더링되는 컴포넌트를 변경하여 페이지를 이동하는것처럼 보이게 하는 방식으로 페이지를 교체함

# React Router 응용

---

## React Router V6

: REACT에서 CSR 기반의 페이지 라우팅을 할 수 있게 해주는 라이브러리

### 1. Path Variable - useParams

경로에 변수 사용하기

```jsx
import {useParams} from "react-router-dom";

const Diary = () =>{
	const { id } = useParams();
	console.log(id);
...
```

### 2. Query String - useSearchParams

- query : 웹 페이지에 데이터를 전달하는 가장 간단한 방법
- name-value 엮어서 데이터 전달
- ? 뒤에 경로 - 라우팅에 영향 x

```jsx
const [searchParmas, setSearchParams ] = useSearchParams();

const id = searchParams.get("id");
const mode = searchParams.get("mode");

/*setSearchParams : searchParams를 바꾸는 기능 - query string을 바꿈 */
```

### 3. Page Moving - useNavigate

```jsx
const navigate = useNavigate();
<button onClick={()=>(navigate("/home");});>home으로 가기</button>
```

navigate 사용해서 링크태그 클릭 없이 의도적으로 어떤 페이지로 보내버릴 수 있음

ex) 로그인 실패시 로그인화면으로 다시 보냄

뒤로가기 : `navigate(-1)`

# 프로젝트 기초 공사

---

1. 폰트 세팅 - Google Web Fonts 사용
2. 레이아웃 세팅
    
    ```css
    @media(min-width : 650px){
    	body{
    		background-color : black;
    	}
    } 
    // 반응형 웹 만들 수 있는 css도구 media - width가 650 이상일때만 적용
    ```
    
3. image assets 세팅

```jsx
const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL ||"";

<img src = {process.env.PUBLIC_URL +`/assets/emotion1.png`}.>
/*process.env.PUBLIC_URL : 어떤 위치에 있던 PUBLIC 디렉토리에 대한 경로 사용할 수 있는 명령어 */

```

1. 공통 컴포넌트 세팅 ( 버튼, 헤더)

```jsx
const MyButton = ({text,type,onClick}) => {
	return (
		<button
		className = {["MyButton", `MyButton_${type}`].join(" ")}
		onClick = {onclick}
		>{text}</button>
```

1. 상태 관리

![Untitled](WIL%20#2%20fa23b6df9f4d40e3923f9b50642ef713/Untitled.png)

# 페이지 구현 - 홈(/)

---

```jsx
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";

import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";
import DiaryList from "./../components/DiaryList";

const Home = () => {
  const diaryList = useContext(DiaryStateContext);

  const [data, setData] = useState([]);
  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth()+1}월`;

  // title 가져온 후 상세페이지의 id 표시 (id번 일기)
  useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장`;
  },[]);

  useEffect(()=>{
    if(diaryList.length >= 1) {
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();
      // console.log(new Date(firstDay));
      
      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0, 23, 59, 59
      ).getTime();
      //console.log(new Date(lastDay));
  
      setData(diaryList.filter((it)=>firstDay <= it.date && it.date <= lastDay));
    }
    else {
      setData([])
    }
  }, [diaryList, curDate]);

  // 확인
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate()));
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate()));
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
    </div>
  );
}

export default Home;
```

# 흔히 발생하는 버그 수정하기

---

1. encountered two key
    
    → 겹치는 키 확인하고 바꾸기
    
2. 오타에 주의하기 ex) latest→ lastest
3. 시간객체 - 시, 분, 초까지 영향을 미친다
    
    ```jsx
    const lastDay = new Date(
            curDate.getFullYear(),
            curDate.getMonth() + 1,
            0, 23, 59, 59 // last day 그 날의 끝인 시간까지 입력해줘야함
          ).getTime();
    ```
    

# LocalStorage를 일기 데이터베이스로 사용하기

---

### Web Storage API

: 브라우저에 데이터를 KEY-VALUE 쌍으로 저장할 수 있는 기능

- session storage : 세션이 유지되는 동안 저장
- local storage : 브라우저를 열었다 닫아도 데이터 유지

### local storage에 저장하기

`localStorage.setItem(”key”,value);`

- 객체는 JSON.stringify로 직렬화 필요

### local storage에서 꺼내오기

`localStorage.getItem(’key’);`

- local storage에 저장될때 문자열로 저장됨
- 객체는 JSON.parse로 다시 객체화 필요

### component가 mount되었을 때 local storage에서 값을 꺼내서 data state의 초기값으로 사용하기

useEffect 사용

```jsx
function App() {
  useEffect(()=>{
    const localData = localStorage.getItem("diary");
    if(localData != null && localData.length > 2) {
      const diaryList = JSON.parse(localData).sort((a,b) => parseInt(b.id) - parseInt(a.id));
			/* data 내림차순 정렬해서 첫번째 idx 뽑으면 제일 높은 id 알수 있음 */
      dataId.current = parseInt(diaryList[0].id)+1;
      
      dispatch({type:"INIT", data:diaryList});
    }
  }, []);
```

# 프로젝트 최적화

---

1. 정적분석 - 코드 분석
2. 동적분석 - 도구로 분석
    - 날짜 변경시 낭비되는 리렌더
    
    ```jsx
    //react.memo로 고차 컴포넌트화
    const ControlMenu = React.memo(({value, onChange, optionList}) => {
      // mount되었을 때 useEffect로 확인
      // useEffect(()=>{
      //  console.log("Control Menu");
       });
    
      return ( 
        <select className="ControlMenu" value={value} onChange={(e)=>onChange(e.target.value)}>
          {optionList.map((it, index) => (
            <option key={index} value={it.value}>
              {it.name}
            </option>
          ))}
        </select>
      )
    });
    // useState가 반환하는 상태 변화 함수를 사용했기 때문에 렌더링이 일어났을 때도 
    //동일한 id를 보장
    ```
    
- diary item component
    
    diary list의 자식 component라서 리렌더링 됨
    
    이미지를 가지고 있기 때문에 성능 저하!
    
    DiaryItem component React.memo로 export
    
- emotionItem component
    
    전달받는 요소 중에 함수가 있음 → use state, usecallback이 아니라면 기본적으로 컴포넌트 렌더링시 다시 생성됨. 
    
    `useCallback`으로 묶어주자
    

# 배포준비 & 프로젝트 빌드

---

1. title 만들기

```html
<!DOCTYPE html>
<html lang="ko"> /*한국어 사용*/
  <head>
    <title>감정일기장 | React</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="나만의 감정 일기장" /> //페이지 콘텐츠 요약 정보
    <meta name="format-detection" content="telephone=no" />
    <meta property="og:image" content="%PUBLIC_URL%/thumbnail.png" />
    <meta property="og:site_name" content="감정일기장" />
    <meta property="og:description" content="나만의 작은 감정 일기장" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

1. page마다 title 변경 - useEffect 사용

```jsx
// title 가져온 후 상세페이지의 id 표시 (id번 일기)
  useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`; 
	//diary component mount되면서 title element 바꿔서 page마다 다른 title
  },[id]);

//edit.js
useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`;
  },[id]);
```

1. build

`npm run build` 로 압축 및 배포 가능한 파일로 생성

`serve -s build`

1. firebase로 배포

# Open Graph 설정하기

---

1. 썸네일 지정하기

```html
<meta property = 'og:image' content = '%PUBLIC_URL%/thumbnail.png' />
```

1. site_name : 공유되었을 때 보여지는 사이트 이름

```html
<meta property = "og:site_name' content = '감정일기장'/>
```

1. description : 정보 공유시 보여지는 사이트 정보 요약

```html
<meta property = "og:description" content = "나만의 작은 감정 일기장" />
```

# 페이지 구현 - 일기 쓰기 (/new)

---

```jsx
import { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

const New = () => {
  useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - 새 일기`;
  },[]);

  return (
    <div>
      <DiaryEditor />
    </div>
  );
};

export default New;
```

# 페이지 구현 - 일기 수정 (/edit)

---

```jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";

import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {

  const [originData, setOriginData] = useState();
  const navigate = useNavigate();
  const {id} = useParams(); // 전달받은 id
  const diaryList = useContext(DiaryStateContext);

  // title 가져온 후 상세페이지의 id 표시 (id번 일기)
  useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`;
  },[id]);

  // 데이터는 컴포넌트가 mount된 시점에서 가져옴

  useEffect(()=>{
    if(diaryList != null && diaryList.length >= 1){
      const targetDiary = diaryList.find((it)=>parseInt(it.id) === parseInt(id));
      // console.log(targetDiary); // 가져온 id의 일기데이터 출력

      // 조건 : id가 있을 때 setOriginData로 전달 
      if(targetDiary) {
        setOriginData(targetDiary);
      }
      else {
        alert("없는 일기 입니다.");
        navigate('/', {replace:true});
      }
    }
  },[id, diaryList, navigate]);

  // targetDiary를 통해서 originData의 state를 저장해놓고
  // originData가 있으면, DiaryEditor를 렌더링
  // prop으로 원본데이터를 전달해주자 (isEdit, originData)
  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div>
  );
}

export default Edit;
```

# 페이지 구현 - 일기 상세 (/diary)

---

```jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";

const Diary = () => {
  const { id } = useParams(); // pathVariable = id
  const diaryList = useContext(DiaryStateContext); // diaryList 가져오기
  const navigate = useNavigate(); // 이동
  const [data, setData] = useState();

  useEffect(()=>{
    if(diaryList.length >= 1) {
      const targetDiary = diaryList.find((it)=>parseInt(it.id) === parseInt(id));
      console.log(targetDiary); // 가져온 id의 일기데이터 출력

      // 현재 상세페이지에서 보여줘야 하는 데이터를 id를 기준으로 찾아온다면 
      if(targetDiary) { // 일기가 존재
        setData(targetDiary);
      }
      else { // 일기가 없을 때 홈으로 이동
        alert("없는 일기 입니다.");
        navigate('/', {replace:true});
      }
    }
  },[id, diaryList, navigate]);

  // 데이터가 없으면
  if(!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  }
  // 데이터가 존재하면
  else {
    // 오늘의 감정 불러오기
    const curEmotionData = emotionList.find((it)=>parseInt(it.emotion_id) === parseInt(data.emotion));
    console.log(curEmotionData);

    return (
      <div className="DiaryPage">
        <MyHeader
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftChild={<MyButton text={"< 뒤로가기"} onClick={()=>navigate(-1)} />}
          rightChild={<MyButton text={"수정하기"} onClick={()=>navigate(`/edit/${data.id}`)} />}
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            {/* 원본 데이터의 감정 가져오기 */}
            <div className={["diaryImgWrapper", `diaryImgWrapper${data.emotion}`].join(" ")}>
              <img src={curEmotionData.emotion_img} alt={`${curEmotionData.emotion_descript}`} />
              <span className="emotionDesc">{curEmotionData.emotion_descript}</span>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            {/* 원본 데이터의 일기 내용 가져오기 */}
            <div className="diaryContentWrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
}

export default Diary;
```