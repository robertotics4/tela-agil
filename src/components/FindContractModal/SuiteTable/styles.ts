import styled from 'styled-components';
import Table from 'rc-table';

export const Container = styled.div`
  margin-top: 16px;
  max-height: 448px;
  overflow: auto;

  width: 100%;
  padding: 0 24px;

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
`;

export const RCTable = styled(Table)`
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      th {
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        color: #000;
        border-bottom: 1px solid #5f6062;
        padding: 12px;
      }
    }
  }

  tbody {
    margin-right: 24px;

    tr {
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      & + tr {
        td {
          border-top: 1px solid #bdbdbd;
        }
      }

      td {
        font-size: 16px;
        color: #000;

        margin: 0;
        padding: 12px;

        :last-child {
          border-right: 0;
        }
      }
    }
  }
`;
