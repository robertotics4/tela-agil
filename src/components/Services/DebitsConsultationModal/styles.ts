import styled, { css } from 'styled-components';

import Button from '../../Button';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 0px 96px;

  h2 {
    text-align: center;
    color: #3c1491;
  }

  > div {
    width: 100%;
    max-height: 360px;
    overflow: auto;

    margin-top: 24px;

    ::-webkit-scrollbar {
      width: 8px;
      scroll-margin-left: 16px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    table {
      width: 100%;

      tbody {
        tr {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 2px solid transparent;
          outline: none;

          height: 60px;
          border-radius: 8px;

          background: #e5e5e5;
          cursor: pointer;

          &:focus {
            border: 2px solid #3c1490;
            outline: none;
          }

          td {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;

            span {
              font-size: 14px;
              color: #ff5353;
            }

            strong {
              font-size: 16px;
              color: #ff5353;
            }

            h2 {
              font-size: 24px;
              color: #000;
              color: #ff5353;
            }
          }

          &:nth-child(even) {
            background: transparent;
          }

          &:first-child() {
            border-radius: 8px 8px 0 0;
          }

          &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 8px;
    margin-top: 16px;

    span {
      margin-bottom: 16px;
      color: #444444;
    }
  }
`;

export const SendButton = styled(Button)`
  background: transparent;
  color: #3c1491;
  border: 1px solid #3c1491;

  height: 40px;
  width: 100%;

  ${props =>
    props.disabled
      ? css`
          opacity: 25%;
          cursor: not-allowed;

          &:hover {
            background: transparent;
            color: #3c1491;
          }
        `
      : css`
          &:hover {
            background: #3c1491;
            color: #fff;
          }
        `}
`;

export const DebitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  margin-bottom: 16px;

  span {
    font-size: 14px;
    color: #444444;
  }

  strong {
    font-size: 16px;
    color: #444444;
  }
`;
