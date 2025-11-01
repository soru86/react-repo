const API_KEY = '1e83ba4e099bae8aa592f4a389645e8a3b25331e';
const END_POINT = 'https://emoji-api.com/emojis';

export const fetchEmojis = async (searchText) => {
  let emojis = [];
  console.log('Search text input: ', searchText);
  const url = `${END_POINT}?access_key=${API_KEY}&search=${searchText}`;
  try {
    const response = await fetch(url);
    emojis = await response.json();
  } catch (e) {
    console.log('Error while calling EMOJI API');
  }
  return Array.isArray(emojis) ? emojis.slice(0, 20) : [];
};

export const fetchEmojiBySlug = async (slug) => {
  let emoji = {};
  console.log('Search text input: ', slug);
  const url = `${END_POINT}/${slug}?access_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    emoji = await response.json();
  } catch (e) {
    console.log('Error while calling EMOJI API');
  }
  return emoji;
};
