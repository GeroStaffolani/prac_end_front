import { useProductContext } from '../../context/ProductContext';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';   
import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { AuthContext } from '../../context/AuthContext';
import React from 'react';

export default function ProductsView() {
  const { products, deleteProduct, loading, error } = useProductContext();
  const { user } = React.useContext(AuthContext);
  const toast = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const handleExport = () => {
    exportToPDF(products, 'Productos', ['nombre', 'precio']);
  };

  const confirmDelete = (id) => {
    setPendingDelete(id);
    toast.current.show({
      severity: 'warn',
      summary: 'Confirmar',
      detail: '¿Seguro que deseas eliminar este producto?',
      sticky: true,
      closable: false,
      content: (
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <Button label="Sí, eliminar" icon="pi pi-check" className="p-button-danger" onClick={() => handleDelete(id)} autoFocus />
          <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => { setPendingDelete(null); toast.current.clear(); }} />
        </div>
      )
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado', life: 2000 });
    } catch {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 2000 });
    }
    setPendingDelete(null);
    toast.current.clear();
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>📦 Lista de Productos 📦</h2>
      {user?.rol === 'admin' && (
        <Link to="/productos/crear">
          <Button label="Crear nuevo producto" icon="pi pi-plus" className="p-button-rounded p-button-success" />
        </Link>
      )}
      <Link to="/">
        <Button label="Volver al inicio" icon="pi pi-home" className="p-button-rounded p-button-secondary" />
      </Link>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-warning" onClick={handleExport} />

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{marginBottom:12}}>
        <InputText value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} placeholder="Buscar producto..." />
      </div>
      <DataTable value={Array.isArray(products) ? products : []}
        paginator={false}
        className="p-datatable-sm p-shadow-2 mt-4"
        globalFilter={globalFilter}
        filterDisplay="row"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="precio" header="Precio" />
        {user?.rol === 'admin' ? (
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <>
                <Link to={`/productos/editar/${rowData.id}`}>
                  <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-info mr-2" />
                </Link>
                <Button 
                  label="Eliminar" 
                  icon="pi pi-trash" 
                  className="p-button-rounded p-button-danger" 
                  onClick={() => confirmDelete(rowData.id)} 
                  disabled={pendingDelete === rowData.id}
                />
              </>
            )}
          />
        ) : null}
      </DataTable>
    </div>
  );
}
