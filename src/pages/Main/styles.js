import styled, { keyframes, css } from 'styled-components';


export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid ${props => (props.error ? '#ff4b4b' : '#eee')};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;

    transition: border 0.50s ease-out;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;

export const ToggleButton = styled.button`
  background-color: transparent;
  border: 0;
  margin-right: 5px;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AlertMessage = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  width: 100%;
  height: 30px;
  background: #ff4b4b;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.5s;

  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
	  }
  }

  p {
    color: #FFF;
    font-size: 14px;
    margin-left: 10px;
  }
`;
