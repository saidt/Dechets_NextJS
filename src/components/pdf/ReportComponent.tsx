import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Column } from '@/lib/types';
import { formatValue } from "@/lib/number-utils";

export const print_styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 10,
    fontFamily: 'Helvetica',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    paddingBottom: 5,
    position: 'relative',
  },
  headerText: {
    fontSize: 8,
    color: '#666',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    flex: 1,
    color: '#003366', // ✅ dark blue
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 25,
    borderTop: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
  footerText: {
    fontSize: 8,
    color: '#666',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    borderTop: 1,
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
    minHeight: 24,
  },
  tableHeaderCell: {
    padding: 5,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 0.5,
    borderColor: '#eee',
    minHeight: 20,
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  section: {
    paddingTop: 5,
    marginBottom: 10,
    borderTop: 1,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  }
});

interface ReportLayoutProps {
  title: string;
  userId?: string;
  children: React.ReactNode;
}

export const ReportLayout: React.FC<ReportLayoutProps> = ({ title, userId, children }) => (
  <Document>
    <Page size="A4" style={print_styles.page}>
      <View style={print_styles.header} fixed>
        <Text style={[print_styles.headerText, { width: 150 }]}>{new Date().toLocaleString()}</Text>
        <Text style={print_styles.headerTitle}>{title}</Text>
        <Text style={[print_styles.headerText, { width: 150, textAlign: 'right' }]}>{userId}</Text>
      </View>
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <View style={print_styles.footer} fixed>
        <Text 
          style={print_styles.footerText} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} 
        />
      </View>
    </Page>
  </Document>
);

interface ReportListProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
}

export const ReportList = <T extends Record<string, any>>({
  columns,
  data,
}: ReportListProps<T>) => (
  <View style={print_styles.table}>
    <View style={print_styles.tableHeader} fixed>
      {columns.map((column, index) => (
        <Text
          key={index}
          style={[
            print_styles.tableHeaderCell,
            {
              flexBasis: column.width,
              flexGrow: 0,
              textAlign: column.meta?.align,
            },
          ]}
        >
          {column.header}
        </Text>
      ))}
    </View>
    {data.map((row: T, rowIndex: number) => {
      return (
        <View key={rowIndex} style={print_styles.tableRow} wrap={false}>
          {columns.map((column, index) => {
            const { formatted, align } = formatValue(row[column.accessor], column.meta?.decimals);
            const columnFormatted = column?.accessorFn ? column.accessorFn(row) : formatted
            const columnAlign = column.meta?.align ? column.meta?.align : align

            return (
              <Text
                key={index}
                style={[
                  print_styles.tableCell,
                  {
                    flexBasis: column.width,
                    flexGrow: 0,
                    textAlign: columnAlign,
                    fontWeight: column.meta?.isPrimaryKey ? 'bold' : 'normal'
                  },
                ]}
              >
                {String(columnFormatted)}
              </Text>
            );
          })}
        </View>
      )
    }
  )}
  </View>
);

const ReportSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={print_styles.section} >
    <View style={{ marginLeft: 5 }}>
      {children}
    </View>
  </View>
);

interface ReportDetailProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T;
}

export const ReportDetail = <T extends Record<string, any>>({
  columns,
  data,
}: ReportDetailProps<T>) => (
  <ReportSection>
      {columns.map((column) => {
        const { formatted } = formatValue(data[column.accessor], column.meta?.decimals);
        const columnFormatted = column?.accessorFn ? column.accessorFn(data) : formatted

        return (
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            <Text style={[print_styles.bold, { width: 100 }]}>{column.header}:</Text>
            <Text style={{ width: column.width, fontWeight: column.meta?.isPrimaryKey ? 'bold' : 'normal' }}>{String(columnFormatted) }</Text>
          </View>
          
        );
      })}
  </ReportSection>
)