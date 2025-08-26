import { useUserContext } from '../../context/UserContext';
import { useContext, useState } from 'react';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';   
import { AuthContext } from '../../context/AuthContext';

export default function UsersView() {
  const { users, deleteUser, loading, error, updateUserRole } = useUserContext();
  const { user } = useContext(AuthContext);
  const [roleEdits, setRoleEdits] = useState({});
  const [saving, setSaving] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const handleExport = () => {
    exportToPDF(users, 'Usuarios', ['nombre', 'contrasenia', 'email', 'edad']);
  };

  const handleRoleChange = (id, newRol) => {
    setRoleEdits({ ...roleEdits, [id]: newRol });
  };

  const handleSaveRole = async (id) => {
    setSaving(id);
    setErrMsg(null);
    setSuccess(null);
    try {
      await updateUserRole(id, roleEdits[id]);
      setSuccess('Rol actualizado');
      setTimeout(() => setSuccess(null), 2000);
    } catch (e) {
      setErrMsg('Error al actualizar rol');
    }
    setSaving(null);
  };

  return (
    <div>
      <h2>👤 Lista de Usuarios 👤</h2>
      {user?.rol === 'admin' && (
        <Link to="/usuarios/crear">
          <Button label="Crear nuevo usuario" icon="pi pi-plus" className="p-button-rounded p-button-success" />
        </Link>
      )}
      <Link to="/">
        <Button label="Volver al inicio" icon="pi pi-home" className="p-button-rounded p-button-secondary" />
      </Link>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-warning" onClick={handleExport} />

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{marginBottom:12}}>
        <InputText value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} placeholder="Buscar usuario..." />
      </div>
      <DataTable value={Array.isArray(users) ? users : []}
        paginator={false}
        className="p-datatable-sm p-shadow-2 mt-4"
        globalFilter={globalFilter}
        filterDisplay="row"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="email" header="Email" />
        <Column field="contrasenia" header="Contraseña" body={(rowData) => (<span> {'•'.repeat(rowData?.contrasenia?.length)} </span>)}/>
        <Column field="edad" header="Edad" />
        <Column field="rol" header="Rol" body={(rowData) => (
          user?.rol === 'admin' ? (
            <>
              <select
                value={roleEdits[rowData.id] ?? rowData.rol}
                onChange={e => handleRoleChange(rowData.id, e.target.value)}
                disabled={saving === rowData.id}
              >
                <option value="admin">admin</option>
                <option value="moderador">moderador</option>
                <option value="cliente">cliente</option>
              </select>
              <Button
                label="Guardar"
                icon="pi pi-save"
                className="p-button-rounded p-button-info ml-2"
                onClick={() => handleSaveRole(rowData.id)}
                disabled={saving === rowData.id || (roleEdits[rowData.id] ?? rowData.rol) === rowData.rol}
              />
            </>
          ) : (
            <span>{rowData.rol}</span>
          )
        )} />
        <Column 
          header="Acciones" 
          body={(rowData) => (
            user?.rol === 'admin' ? (
              <>
                <Link to={`/usuarios/editar/${rowData.id}`}>
                  <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-info mr-2" />
                </Link>
                <Button 
                  label="Eliminar" 
                  icon="pi pi-trash" 
                  className="p-button-rounded p-button-danger" 
                  onClick={() => deleteUser(rowData.id)} 
                />
              </>
            ) : null
          )}
        />
      </DataTable>
      <h5>(sin darme cuenta hice el campo contraseña de más)</h5>
    </div>
  );
}
