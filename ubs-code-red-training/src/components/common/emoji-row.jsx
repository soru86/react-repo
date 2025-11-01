import styled from 'styled-components';

export const EmojiRow = ({ emoji }) => {
  return (
    <EmojiRowContainer>
      <EmojiAndName>
        <EmojiCharacter>{emoji.character}</EmojiCharacter>
        {emoji.name}
      </EmojiAndName>
      <div>{emoji.code}</div>
    </EmojiRowContainer>
  );
};

const EmojiRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  border-bottom: 1px solid lightgrey;
  padding: 10px;
`;

const EmojiAndName = styled.div`
  display: flex;
`;

const EmojiCharacter = styled.div`
  padding: 0 5px;
  font-size: 20px;
`;
