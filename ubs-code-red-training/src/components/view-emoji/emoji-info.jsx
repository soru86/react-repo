import { useEffect, useState } from 'react';
import {
  Button,
  List,
  ListHeader,
  ListItem,
  Placeholder,
  PlaceholderLine,
  Segment,
} from 'semantic-ui-react';
import styled from 'styled-components';
import { fetchEmojiBySlug } from '../../api/emoji';
import { useNavigate, useParams } from 'react-router-dom';

const emojiKeyLabels = {
  slug: 'Slug',
  character: 'Character',
  unicodeName: 'Unicode Name',
  codePoint: 'Code Point',
  group: 'Group Name',
  subGroup: 'Sub-group Name',
};

export const EmojiInfo = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [emoji, setEmoji] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmojiBySlug(slug)
      .then((response) => {
        setEmoji(response[0]);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, [slug]);

  return (
    <AppContainer>
      {loading ? (
        <Placeholder>
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
      ) : (
        <>
          <Segment>
            <List divided relaxed>
              {Object.keys(emoji).map((key) => {
                return (
                  <ListItem key={key}>
                    <ListHeader>{emojiKeyLabels[key]}</ListHeader>
                    {emoji[key]}
                  </ListItem>
                );
              })}
            </List>
          </Segment>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </>
      )}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  margin: 100px 25%;
`;
