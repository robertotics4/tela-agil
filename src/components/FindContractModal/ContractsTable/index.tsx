import React, { useCallback, useState } from 'react';
import { useTable, Column } from 'react-table';

import {
  Container,
  TableContainer,
  TableHeadContainer,
  TableColumnsTitleContainer,
  TableColumnTitle,
  TableRow,
  TableBody,
  TableDataCell,
} from './styles';

interface Contract {
  contractAccount: string;
  address: string;
}

interface ContractTableProps {
  columns: Column<Contract>[];
  data: Contract[];
}

const ContractsTable: React.FC<ContractTableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const [selectedContract, setSelectedContract] = useState(null);

  return (
    <Container>
      <TableContainer {...getTableProps()}>
        <TableHeadContainer>
          {headerGroups.map(headerGroup => (
            <TableColumnsTitleContainer {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableColumnTitle {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableColumnTitle>
              ))}
            </TableColumnsTitleContainer>
          ))}
        </TableHeadContainer>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableDataCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableDataCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>
    </Container>
  );
};

export default ContractsTable;
