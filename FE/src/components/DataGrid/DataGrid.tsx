import { useCallback, useMemo, useRef, memo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent, 
  ICellRendererParams,
  PaginationChangedEvent,
  ModuleRegistry,
  ClientSideRowModelModule,
  FilterChangedEvent
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { IconButton, Tooltip, Box, styled } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { Car } from '../../types/car';
import { Loader } from '../Loader/Loader';

// Register the ClientSideRowModel module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface DataGridProps {
  rowData: Car[];
  totalRows: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onGridReady?: (params: GridReadyEvent) => void;
  onViewClick?: (data: Car) => void;
  onDeleteClick?: (data: Car) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onFilterChange?: (filters: any[]) => void;
}

const StyledGridBox = styled(Box)(({ theme }) => ({
  height: 600,
  width: '100%',
  position: 'relative',
  '& .ag-theme-material': {
    '--ag-font-family': theme.typography.fontFamily,
    '--ag-font-size': '14px',
    '--ag-grid-size': '6px',
    '--ag-row-height': '52px',
    '--ag-header-height': '56px',
    '--ag-header-foreground-color': theme.palette.text.secondary,
    '--ag-foreground-color': theme.palette.text.primary,
    '--ag-background-color': theme.palette.background.paper,
    '--ag-header-background-color': theme.palette.background.default,
    '--ag-odd-row-background-color': theme.palette.background.default,
    '--ag-row-border-color': 'transparent',
    '--ag-row-hover-color': `${theme.palette.primary.main}08`,
    '--ag-selected-row-background-color': `${theme.palette.primary.main}15`,
    '--ag-modal-overlay-background-color': 'rgba(0, 0, 0, 0.5)',
    '--ag-borders': 'none',
    '--ag-border-radius': '12px',
    '--ag-cell-horizontal-padding': theme.spacing(2),
    '--ag-input-focus-border-color': theme.palette.primary.main,
    '--ag-input-focus-box-shadow': `0 0 2px ${theme.palette.primary.main}`,
    '--ag-card-radius': '12px',
    '--ag-popup-shadow': theme.shadows[3],

    '& .ag-header': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },

    '& .ag-row': {
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:last-child': {
        borderBottom: 'none',
      },
      '&.ag-row-animation': {
        transform: 'translateY(0)',
        opacity: 1,
      },
      '&.ag-row-animation-entering': {
        transform: 'translateY(10px)',
        opacity: 0,
      }
    },

    // Pagination panel styling
    '& .ag-paging-panel': {
      height: '56px',
      borderTop: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
      '& .ag-paging-row-summary-panel': {
        margin: '0 16px',
      },
      '& .ag-paging-page-summary-panel': {
        margin: '0 16px',
      },
      '& .ag-paging-button': {
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover:not(.ag-disabled)': {
          backgroundColor: `${theme.palette.primary.main}15`,
        },
        '&.ag-disabled': {
          opacity: 0.5,
          cursor: 'default',
        },
      },
    },

    // Fade transition for content
    '& .ag-cell': {
      transition: 'opacity 0.2s ease',
    }
  },
}));

export const DataGrid = memo(({ 
  rowData, 
  totalRows,
  page,
  pageSize,
  isLoading,
  onGridReady,
  onViewClick,
  onDeleteClick,
  onPageChange,
  onFilterChange
}: DataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const actionRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as Car;
    return (
      <div>
        <Tooltip title="View">
          <IconButton onClick={() => onViewClick?.(data)}>
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDeleteClick?.(data)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }, [onViewClick, onDeleteClick]);

  const handleFilterChanged = useCallback((event: FilterChangedEvent) => {
    const filterModel = event.api.getFilterModel();
    const filters = Object.entries(filterModel).map(([field, model]) => ({
      field,
      operator: model.type,
      value: model.filter
    }));
    onFilterChange?.(filters);
  }, [onFilterChange]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
    },
    resizable: true,
    minWidth: 100,
    flex: 1,
  }), []);

  const columnDefs: ColDef[] = useMemo(() => {
    if (!rowData.length) return [];

    const sampleData = rowData[0];
    const cols = Object.keys(sampleData)
      .filter(key => key !== '_id' && key !== '__v') // Exclude MongoDB specific fields
      .map(key => ({
        field: key,
        headerName: key.replace(/([A-Z])/g, ' $1').trim(),
        flex: 1,
        filter: key.includes('Km') || key.includes('Sec') || key.includes('Euro') 
          ? 'agNumberColumnFilter' 
          : 'agTextColumnFilter',
      }));

    return [
      ...cols,
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: actionRenderer,
        filter: false,
        sortable: false,
        width: 120,
        flex: 0,
      },
    ];
  }, [rowData, actionRenderer]);

  const onPaginationChanged = useCallback((event: PaginationChangedEvent) => {
    const api = gridRef.current?.api;
    if (!api) return;

    const currentPage = api.paginationGetCurrentPage();
    const currentPageSize = api.paginationGetPageSize();
    
    // Only trigger if it's a user-initiated change
    if (event.newPage || event.newPageSize) {
      onPageChange?.(currentPage + 1, currentPageSize);
    }
  }, [onPageChange]);

  return (
    <StyledGridBox>
      <div 
        className="ag-theme-material" 
        style={{ 
          height: '100%', 
          width: '100%',
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            ...defaultColDef,
            cellStyle: {
              display: 'flex',
              alignItems: 'center',
            },
          }}
          headerHeight={48}
          rowHeight={48}
          rowStyle={{ alignItems: 'center' }}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          onPaginationChanged={onPaginationChanged}
          suppressPaginationPanel={false}
          animateRows={true}
          rowAnimation="sequential"
          loadingOverlayComponent={null}
          suppressLoadingOverlay={true}
          // Updated pagination properties
          rowModelType="clientSide"
          suppressRowVirtualisation={true}
          paginationAutoPageSize={false}
          // This will show the total number of items
          paginationShowTotalPages={true}
          paginationTotalPages={Math.max(1, Math.ceil(totalRows / pageSize))}
          // Format the page numbers
          paginationNumberFormatter={(params) => {
            return `[${params.value.toLocaleString()}]`;
          }}
          onFilterChanged={handleFilterChanged}
          // Reset to first page when data changes
          key={`${totalRows}-${pageSize}`}
        />
      </div>
      {isLoading && <Loader />}
    </StyledGridBox>
  );
});

DataGrid.displayName = 'DataGrid'; 