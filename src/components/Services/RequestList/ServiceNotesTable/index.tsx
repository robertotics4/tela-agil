import React from 'react';
import { useTable, TableInstance, Column } from 'react-table';

import {
  TableContainer,
  TableHead,
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
  } = useTable({ columns, data });

  return (
    <TableContainer {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </TableRow>
        ))}
      </TableHead>
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
  );
};

export default ServiceNotesTable;
