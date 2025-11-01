import { Tab, TabPane } from 'semantic-ui-react';
import { EmojiCounterDemo } from './components/emoji-counter/emoji-counter-demo';
import { FetchEmojiDemo } from './components/fetch-emoji/fetch-emoji-demo';
import { FindEmojiDemo } from './components/find-emoji/find-emoji-demo';
import { ViewEmojiContainer } from './components/view-emoji/view-emoji-container';

export const App = () => {
  const panes = [
    {
      menuItem: 'Counter Demo',
      render: () => (
        <TabPane>
          <EmojiCounterDemo />
        </TabPane>
      ),
    },
    {
      menuItem: 'Find Emoji Demo',
      render: () => (
        <TabPane>
          <FindEmojiDemo />
        </TabPane>
      ),
    },
    {
      menuItem: 'Fetch Emoji Demo',
      render: () => (
        <TabPane>
          <FetchEmojiDemo />
        </TabPane>
      ),
    },
    {
      menuItem: 'View Emoji Demo',
      render: () => (
        <TabPane>
          <ViewEmojiContainer />
        </TabPane>
      ),
    },
  ];

  return (
    <div className="app-container">
      <Tab panes={panes} />
    </div>
  );
};
