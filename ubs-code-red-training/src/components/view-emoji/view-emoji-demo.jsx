import { Input, Loader } from 'semantic-ui-react';
import { useState } from 'react';
import styled from 'styled-components';
import { ApiEmojiRow } from '../common/api-emoji-row';
import { fetchEmojis } from '../../api/emoji';
import debounce from 'lodash.debounce';

export const ViewEmojiDemo = () => {
  const [filterEmojis, setFilterEmojis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedGetEmojis = debounce((searchText) => {
    setIsLoading(true);
    getEmojis(searchText);
  }, 500);

  const getEmojis = async (searchText) => {
    const emojis = await fetchEmojis(searchText);
    setIsLoading(false);
    setFilterEmojis(emojis);
  };

  return (
    <AppContainer>
      <Input
        fluid
        icon="search"
        placeholder="Search"
        onChange={(e) => debouncedGetEmojis(e.target.value)}
      />

      <EmojisListContainer>
        {isLoading ? (
          <Loader active inline="centered" />
        ) : filterEmojis.length ? (
          filterEmojis.map((emoji) => {
            return <ApiEmojiRow emoji={emoji} key={emoji.name} />;
          })
        ) : (
          'No items to show'
        )}
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
  max-height: 150px;
  overflow-y: scroll;

  div:last-child {
    border-bottom: 0;
  }
`;
