import styled from 'styled-components';

export const Divider = () => {
  return <DividerLine />;
};

const DividerLine = styled.div`
  content: none;
  border: 1px solid grey;
  margin: 50px;
`;
