import React from 'react';
import { useTable, Column, useResizeColumns } from 'react-table';

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

interface Note {
  protocol: string;
  service: string;
  openingDate: string;
  conclusionDate: string | undefined;
  status: string;
}

interface ServiceNotesTableProps {
  columns: Column<Note>[];
  data: Note[];
}

const ServiceNotesTable: React.FC<ServiceNotesTableProps> = ({
  columns,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useResizeColumns);

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

export default ServiceNotesTable;
