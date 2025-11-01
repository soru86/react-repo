import { Input } from 'semantic-ui-react';
import allEmojis from '../../resources/emojis.json';
import { useState } from 'react';
import styled from 'styled-components';
import { EmojiRow } from '../common/emoji-row';

export const FindEmojiDemo = () => {
  const [filterEmojis, setFilterEmojis] = useState(allEmojis);

  const handleFilterEmojis = (e) => {
    const emojis = allEmojis.filter((emoji) => {
      return emoji.name.includes(e.target.value);
    });
    setFilterEmojis(emojis);
  };

  return (
    <AppContainer>
      <Input
        fluid
        icon="search"
        placeholder="Search"
        onChange={handleFilterEmojis}
      />
      <EmojisListContainer>
        {filterEmojis.map((emoji) => {
          return <EmojiRow emoji={emoji} key={emoji.name} />;
        })}
      </EmojisListContainer>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  margin: 100px 25%;
`;

const EmojisListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding: 10px;
  height: 150px;
  overflow-y: scroll;

  div:last-child {
    border-bottom: 0;
  }
`;
