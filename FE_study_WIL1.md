# week1

# Why React?

---

대부분의 웹페이지들 → 공통되는 요소 많음 header,footer ..

중복 코드 작성시 산탄총 수술(shotgun surgery) 문제 발생

1. **공통코드를 컴포넌트화해서 필요할때 불러오는 것 : 컴포넌트화 방식**

<aside>
💡 React는 Component 기반의 UI 라이브러리

</aside>

1. **선언형 프로그래밍: 목적을 바로 말함**

웹서비스의 프론트엔드적인 측면에 집중한다면, 선언형 프로그래밍이 더 적합

1. **Virtual DOM**
- DOM: Document Object Model (문서 객체 모델)
    
    : html을 tree형태로 보여주는것
    

# Create React App

---

webpack : 모듈 번들러

이미 세팅 완료된  패키지 Boiler Plate를 사용.

npm start → react 앱 실행

컴퓨터는 웹서버가 되고, 크롬에서는 내 컴퓨터 주소로 웹사이트에 접근

jsx : html이랑 js 혼용해서 사용할 수 있는 문법

es module system : export default app; → import 이름 from경로로 다른 곳에서 사용 가능

# JSX

---

- 닫힘 규칙 : **self closing tag** 사용해서 오류 방지
- 최상위 태그 규칙 : jsx 표현식은 반드시 하나의 부모를 가져야 함.
    - React.Fragment 태그로 해결
    - 빈 태그로 해결
- react 기능 이용하지 않는 컴포넌트는 굳이 react import 하지 않아도 됨

### styling방식

- import 경로 → CSS 불러서 사용
- inline styling

```bash
import React from "react";

// import "./App.css";

import MyHeader from "./MyHeader";
import MyFooter from "./MyFooter";

function App() {
  let name = "이정환";

  const style = { //객체로 만듬
    App: {
      background: "black",
    },
    h2: {
      color: "red",
    },
    bold_text: {
      color: "green",
    },
  };

  return (
    <div style={style.App}>
      <MyHeader />
      <h2 style={style.h2}>안녕 리액트</h2>
      <b style={style.bold_text}>React.js</b>
    </div>
  );
}

export default App;
```

### jsx에 js의 값을 사용하기

```jsx
const func = () => {
    return "func";
  };

  return (
    <div style={style.App}>
      <MyHeader />
      <h2 style={style.h2}>안녕 리액트{func()}</h2> //숫자나 문자만 포함 가능
      <b style={style.bold_text}>React.js</b>
    </div>
  );
}
```

### 조건부 렌더링

```jsx
const number = 5;

  return (
    <div style={style.App}>
      <MyHeader />
      <h2 style={style.h2}>안녕 리액트</h2>
      <b style={style.bold_text} id="bold_text">
        {number}는 {number % 2 === 0 ? "짝수" : "홀수"}
//삼항 연산자 활용하여 조건에 따라 다른 요소 렌더링 가능 : 조건부 렌더링
      </b>
    </div>
  );
}
```

# State(상태)

---

상태 : 계속해서 변화하는 특정 상태. 상태에 따라 다른 행동을 수행함

컴포넌트가 갖는 동적인 데이터이고, 상태를 바꾸는 관리는 컴포넌트가 수행한다

컴포넌트는 자신이 가진 state 가 변화하면 re-render를 한다

```jsx
import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  //배열을 반환, 배열의 비구조화 할당을 통해서
  //0번째 인덱스 count(값/상태), 1번째 인덱스 setCount(상태 변화 함수)

  const onIncrease = () => {
    setCount(count + 1);
  };

  const onDecrease = () => {
    setCount(count - 1);
  };

  const [count2, setCount2] = useState(0); //하나의 컴포넌트에서 상태를 여러개 가질 수음

  const onIncrease2 = () => {
    setCount2(count2 + 1);
  };

  const onDecrease2 = () => {
    setCount2(count2 - 1);
  };

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={onIncrease}>+</button>
      <button onClick={onDecrease}>-</button>

      <h2>{count2}</h2>
      <button onClick={onIncrease2}>+</button>
      <button onClick={onDecrease2}>-</button>
    </div>
  );
};

export default Counter;
```

# Props

---

부모컴포넌트에서 자식 컴포넌트에 초기값을 전달하는 방식

부모 컴포넌트 - initialValue로 전

자식 컴포넌트 - 매개변수에 props로 전달받음 (객체)

defaultProps 설정을 통해 전달받지 못한 props의 기본값 설정해서 오류 방지 가능

부모가 전달하는 props가 변경되면 re-render

리액트의 컴포넌트는

1. 본인이 관리하고 본인이 가진 state가 바뀔때마다
2. 나에게 내려오는 props가 바뀔때마다
3. 내 부모가 리렌더 되면 나도 리렌더가 됨

컴포넌트를 다른 컴포넌트의 prop으로 전달할 수 있다

```jsx
//App.js
return (
    <Container>
      <div>
        <MyHeader />
        <Counter {...counterProps} />
      </div>
    </Container>
  );
}

// Container.js
const Container = ({ children }) => { //app.js에서 container의 자식들을 props로
  return (
    <div style={{ margin: 20, padding: 20, border: "1px solid gray" }}>
      {children}
    </div>
  );
};

export default Container;
```

# 사용자 입력 처리하기

---

```jsx
import { useState } from "react";

const DiaryEditor = () => {
  const [state, setState] = useState({
    author: "",
    content: "",
  });
// 동작방식이 같은 state는 합칠 수 있음

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          name="author"
          value={state.author}
          onChange={(e) => {
            setState({
              ...state,
              author: e.target.value, 
							//spread연산자 먼저 써야함 ! 업데이트 방향이 상->하
            });
          }}
        />
      </div>
```

```jsx
import { useState } from "react";

const DiaryEditor = () => {
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });
  // 동작방식이 같은 state는 합칠 수 있음

  const handleChangeState = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);

    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(state);
    alert("저장 성공");
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          name="content"
          value={state.content}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <span> 오늘의 감정 점수: </span>
        <select
          name="emotion"
          state={state.emotion}
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
  );
};
export default DiaryEditor;
```

# DOM 조작하기 - useRef

---

### focus

```jsx
import { useRef, useState } from "react";

const DiaryEditor = () => {
  const authorInput = useRef();
  const contentInput = useRef();

...

  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    console.log(state);
    alert("저장 성공!");
  };
```

# 리스트 렌더링(조회)

---

### 배열을 이용하여 react에서 list 렌더링해보고 개별적인 컴포넌트로 만들어보기

```jsx
import DiaryItem from "./DiaryItem";

const DiaryList = ({ diaryList }) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div> // idx를 키로 사용할 경우 데이터 조작시 문제 발생 가능성이 있기 때문에 고유의 id로 사용하는 것이 좋음
        {diaryList.map((it) => (
          <DiaryItem key={`diaryitem_${it.id}`} {...it} /> 
        ))}
      </div>
    </div>
  );
};

DiaryList.defaultProps = { //undefined props 에러 방지를 위한 default props
  diaryList: []
};

export default DiaryList;
```

```jsx

const DiaryItem = ({ id, author, content, emotion, created_date }) => {
  return (
    <div className="DiaryItem">
      <div className="info">
        <span className="author_info">
          | 작성자 : {author} | 감정점수 : {emotion} |
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">{content}</div>
    </div>
  );
};

export default DiaryItem;
```

# 데이터 추가하기

---

- 컴포넌트& 데이터 구조 생각해보기 - 트리형태

트리형태에서 같은레벨끼리는 데이터 주고받는것이 불가능

- React - 단방향 데이터 흐름
- event는 아래서 위로, data는 위에서 아래로 흐른다고 볼 수 있음

### state 끌어올리기

: 여러개의 컴포넌트를 공통 부모 컴포넌트의 state로 설정하여 해결하는 것

```jsx
const App = () => {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current
    };
    dataId.current += 1;
    setData([newItem, ...data]); // 새로운 일기를 맨 위에 보이게 newItem을 먼저
  };

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} />
    </div>
  );
};
export default App;
```

```jsx
import { useRef, useState } from "react";

const DiaryEditor = ({ onCreate }) => { //onCreate를 props로
  const authorInput = useRef();
  const contentInput = useRef();

...
    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공");
    setState({
      author: "",
      content: "",
      emotion: 1 //저장후 일기 작성 폼 초기화
    });
  };
```

# 데이터 삭제하기

---

```jsx
const DiaryItem = ({
  onDelete, //props를 받아서
  id,
  author,
  content,
  emotion,
  created_date
}) => {
  return (
			...
      <div className="content">{content}</div>
      <button
        onClick={() => {
          if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
            onDelete(id); //id를 넘겨줌
          }
        }}
      >
        삭제하기
      </button>
    </div>
  );
};

//app.js
//app->diarylist->diaryitem 
const onDelete = (targetId) => { //id를 전달받음 - diary item이 ondelete함수 호출해야함
    const newDiaryList = data.filter(
      (it) => it.id !== targetId 
    );
    setData(newDiaryList); //newDiaryList를 setData에 전달해야 삭제 완료
  };

//diary list
<div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} onDelete={onDelete} />
        ))}
      </div>
//삭제 -> 새로운 배열 -> 상태 변화 -> diarylist 렌더 -> 삭제 완료
```

# 데이터 수정하기

---

```jsx
//app.js - onEdit 함수 추가
const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it)
    );
  };
// setData를 통해 값 전달 -> 원본데이터배열의 map 메서드를 사용해서 수정된 data배열이 반영되도록
//수정 대상이라면 교체, 아니라면 원본 값
```

```jsx
//diaryitem.js
const DiaryItem = ({
  onRemove,
  onEdit,
  id,
  author,
  content,
  emotion,
  created_date
}) => {
  const localContentInput = useRef();
  const [localContent, setLocalContent] = useState(content); // 수정 시 원본데이터가 들어오게 state를 content로
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);
  const handleQuitEdit = () => {
    setIsEdit(false); // 수정 완료하지 않고 나왔을 때 다시 원본데이터로 돌아가게 
    setLocalContent(content);
  };

  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus(); //5자 이상 수정되지 않으면 focus되도록
      return;
    }

    if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  return (
 ...
      <div className="content">
        {isEdit ? (
          <textarea
            ref={localContentInput} //
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />
        ) : (
          content
        )}
      </div>
      {isEdit ? ( //수정 중일때 보이는 버튼
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : ( //수정 중이 아닐때
        <>
          <button onClick={handleClickRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};
```

```jsx
//diarylist.js
const DiaryList = ({ **onEdit**, onRemove, diaryList }) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} **onEdit={onEdit}** onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};
```

# React Lifecycle 제어하기 - useEffect

---

### react의 lifecycle

- 탄생 : 화면에 나타나는 것 - **mount - ComponentDidMount**
- 변화 : 업데이트(리렌더) - **update - ComponentDidUpdate**
- 죽음 : 화면에서 사라짐 - **unmount - ComponentWillUnmount**

근본적으로 클래스형 컴포넌트에서만 method 사용 가능

함수형 컴포넌트는 이런 method사용 불가하지만, 앞에 use 키워드를 붙여서 hooking : **React Hooks**

ex) useState, useEffect, useRef

class형 컴포넌트는 코드길이가 길어지고, 중복코드, 가독성 문제가 있음

### useEffect 사용하기

```jsx
import React, {useEffect} from "react";
useEffect(() =>{
		//todo... -> 콜백함수
},[]); //배열 : dependency array - 의존성 배열 : 이 배열 내에 값이 변화하면 콜백함수수행
```

# API 호출하기

---

useEffect 를 이용하여 컴포넌트 mount 시점에 api를 호출하고 해당 api 결과값을 데이터 초기값으로 이용하기

```jsx
const App = () => {
  const [data, setData] = useState([]);
  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime() + 1,
        id: dataId.current++
      };
    });

    setData(initData);
  };

  useEffect(() => { //mount 시점에 실행

    setTimeout(() => {
      getData();
    }, 1500);
  }, []);

  const onCreate = (author, content, emotion) => {
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
  };

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
};
export default App;
```