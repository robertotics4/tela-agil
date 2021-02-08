import React from 'react';
import { BsFillCircleFill } from 'react-icons/bs';

import { Container } from './styles';

interface TagInfoProps {
  type: 'success' | 'error';
  message: string;
}

const TagInfo: React.FC<TagInfoProps> = ({ type, message }) => {
  return (
    <Container type={type}>
      <BsFillCircleFill size={20} />
      <span>{message}</span>
    </Container>
  );
};

export default TagInfo;
