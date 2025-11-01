import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ApiEmojiRow = ({ emoji }) => {
  return (
    <Link to={`/emoji/${emoji.slug}`}>
      <EmojiRowContainer>
        <EmojiAndName>
          <EmojiCharacter>{emoji.character}</EmojiCharacter>
          {emoji.unicodeName}
        </EmojiAndName>
        <div>{emoji.codePoint}</div>
      </EmojiRowContainer>
    </Link>
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
