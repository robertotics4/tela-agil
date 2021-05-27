import styled, { css } from 'styled-components';

interface ContainerProps {
  type: 'open' | 'concluded' | 'canceled';
}

const statusTypeVariations = {
  open: css`
    background: #fff2cc;
    color: #b37036;
  `,
  concluded: css`
    background: #d6ffcc;
    color: #43992e;
  `,
  canceled: css`
    background: #ffcccc;
    color: #992e2e;
  `,
};

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 8px;
  border-radius: 8px;

  ${props => statusTypeVariations[props.type]}
`;

export const StatusTitle = styled.span`
  font-size: 14px;
`;
