import React from 'react';
import { useBreakpoint } from '@/hooks/use-responsive';
import { MobileDataTable } from './MobileDataTable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  mobileLabel?: string;
}

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveDataTable<T extends { id: string }>({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  renderMobileCard,
  emptyMessage = "Aucune donnée disponible",
  className = ""
}: ResponsiveDataTableProps<T>) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

  // Default mobile card renderer if none provided
  const defaultMobileCard = (item: T, index: number) => (
    <div className="space-y-2">
      {columns.slice(0, 3).map((column) => {
        const value = column.render 
          ? column.render(item, index)
          : String(item[column.key as keyof T] || '');
        
        return (
          <div key={String(column.key)} className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {column.mobileLabel || column.header}:
            </span>
            <span className="text-right">{value}</span>
          </div>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <MobileDataTable
        data={data}
        loading={loading}
        renderMobileCard={renderMobileCard || defaultMobileCard}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage={emptyMessage}
        className={className}
      />
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)} 
                    className={column.className}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    {columns.map((column) => {
                      const value = column.render 
                        ? column.render(item, index)
                        : String(item[column.key as keyof T] || '');
                      
                      return (
                        <TableCell 
                          key={String(column.key)} 
                          className={column.className}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResponsiveDataTable;