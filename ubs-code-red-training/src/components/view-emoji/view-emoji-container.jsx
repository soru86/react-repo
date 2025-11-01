import { Navigate, Route, Routes } from 'react-router-dom';
import { ViewEmojiDemo } from './view-emoji-demo';
import { EmojiInfo } from './emoji-info';

export const ViewEmojiContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewEmojiDemo />} />
      <Route path="/emoji/:slug" element={<EmojiInfo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
