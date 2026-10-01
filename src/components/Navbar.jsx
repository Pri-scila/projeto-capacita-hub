import React from 'react';

const Navbar = ({ onCliqueCursos, onCliqueCadastro, onCliqueMatriculas }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 2.5rem',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '1.6rem', fontWeight: 'bold', cursor: 'pointer' }}>
        Capacita+ HUB
      </h2>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '2rem',
        margin: 0,
        padding: 0
      }}>
        <li onClick={onCliqueCursos} style={{ cursor: 'pointer', fontWeight: '600', color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
          Cursos e Vagas
        </li>
        <li onClick={onCliqueCadastro} style={{ cursor: 'pointer', fontWeight: '600', color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
          Cadastrar Aluno
        </li>
        <li onClick={onCliqueMatriculas} style={{ cursor: 'pointer', fontWeight: '600', color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
          Minhas Matrículas
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
