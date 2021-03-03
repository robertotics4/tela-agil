import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 16px;
  max-height: 448px;
  overflow: auto;
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
  color: #5f6062;
  font-weight: 400;
  border-bottom: 1px solid #5f6062;
  padding: 12px;
`;

export const TableRow = styled.tr`
  & + tr {
    td {
      border-top: 1px solid #bdbdbd;
    }
  }
`;

export const TableBody = styled.tbody``;

export const TableDataCell = styled.td`
  font-size: 16px;
  color: #000;

  margin: 0;
  padding: 12px;

  :last-child {
    border-right: 0;
  }
`;
