import styled, { css } from 'styled-components';
import { lighten } from 'polished';

interface MenuItemProps {
  disabled?: boolean;
}

export const Container = styled.div`
  width: 1100px;

  h3 {
    font-size: 16px;
    color: #444444;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 16px 32px;
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e7e5e5;
`;

export const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 75px;

  ${props =>
    props.disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}

  &:hover {
    button {
      background: ${lighten(0.2, '#3c1491')};
    }

    svg {
      color: #fff;
    }

    span {
      color: #3c1491;
      font-weight: bold;
    }
  }
`;

export const MenuItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 0;

  background: #3c1491;
  transition: background-color 0.2s;

  svg {
    color: #fff;
  }
`;

export const MenuItemText = styled.span`
  height: 32px;

  font-size: 14px;
  color: #3c1491;
  text-align: center;

  margin-top: 8px;
`;
