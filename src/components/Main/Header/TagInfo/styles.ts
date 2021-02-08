import styled, { css } from 'styled-components';

interface TagInfoProps {
  type: 'success' | 'error';
}

const tagInfoTypeVariations = {
  success: css`
    svg {
      color: #27ae60;
    }
  `,
  error: css`
    svg {
      color: #eb5757;
    }
  `,
};

export const Container = styled.div<TagInfoProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  & + div {
    border-left: 1px solid #bdbdbd;
  }

  ${props => tagInfoTypeVariations[props.type]}

  svg {
    margin: 0 8px;
  }

  span {
    margin-right: 8px;
  }
`;
