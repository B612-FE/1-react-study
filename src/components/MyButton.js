const MyButton = ({text, type, onClick})=>{
    
    const btnType =['positive','negative'].includes(type)? type: 'default';
    //버튼의 타입이 p or n 외의 것으로 입력되는 경우 default로 강제 변환하는 코드
    return(
        <button className = {["MyButton",`MyButton_${type}`].join(" ")} onClick = {onClick}>
            {text}
        </button>
    );
};

MyButton.defaultProps = {
    type: 'default',
}

export default MyButton;