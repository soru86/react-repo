import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

const INITIAL_STATE = 0;

export const EmojiCounterDemo = () => {
  const [counter, setCounter] = useState(INITIAL_STATE);

  const incrementCounter = useCallback(() => {
    setCounter((counter) => counter + 1);
  }, [setCounter]);

  const decrementCounter = useCallback(() => {
    setCounter((counter) => counter - 1);
  }, [setCounter]);

  const resetCounter = useCallback(() => {
    if (counter) {
      setCounter(INITIAL_STATE);
    }
  }, [counter]);

  return (
    <PageContainer>
      <Display>{counter}</Display>
      <ButtonContainer>
        <EmojiButtonLeft onClick={decrementCounter}>😭</EmojiButtonLeft>
        <EmojiButtonRight onClick={incrementCounter}>😄</EmojiButtonRight>
      </ButtonContainer>
      <EmojiButton onClick={resetCounter}>🔃</EmojiButton>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
`;

const ButtonContainer = styled.div`
  margin: 30px 0px;
`;

const Display = styled.div`
  font-size: 72px;
  font-weight: 700;
  padding: 10px;
`;

const baseEmojiButton = css`
  font-size: 55px;
  padding: 30px;
  border: 1px solid black;
  background: white;
  cursor: pointer;

  :hover {
    background: burlywood;
  }

  :active {
    opacity: 0.7;
  }
`;

const EmojiButton = styled.button`
  ${baseEmojiButton};
  border-radius: 15px;
`;

const EmojiButtonLeft = styled.button`
  ${baseEmojiButton};
  border-right: none;
  border-radius: 15px 0 0 15px;
`;

const EmojiButtonRight = styled.button`
  ${baseEmojiButton};
  border-radius: 0 15px 15px 0;
`;
