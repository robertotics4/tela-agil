import styled from 'styled-components';

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

export const TableContainer = styled.table`
  border-spacing: 0;
  width: 100%;
`;

export const TableHeadContainer = styled.thead``;

export const TableColumnsTitleContainer = styled.tr`
  border: 1px solid #5f6062;
`;

export const TableColumnTitle = styled.th`
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  color: #5f6062;
  border-bottom: 1px solid #5f6062;
  padding: 12px;
`;

export const TableRow = styled.tr`
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
`;

export const TableBody = styled.tbody`
  margin-right: 24px;
`;

export const TableDataCell = styled.td`
  font-size: 16px;
  color: #000;

  margin: 0;
  padding: 12px;

  :last-child {
    border-right: 0;
  }
`;
