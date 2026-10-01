import React, { useState } from 'react';
import api from '../api';

const FormularioCadastro = ({ onCadastroSucesso }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validação de Idade no Frontend (Coerente com o Edital)
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 18) {
      setErro('⚠️ Cadastro rejeitado: Projetos voltados para menores de 18 anos não são permitidos nesta plataforma.');
      return;
    }

    const novoUsuario = { nome, email, dataNascimento: dataNasc, telefone };

    api.post('/usuarios', novoUsuario)
      .then(response => {
        setSucesso(`🎉 Aluno ${response.data.nome} cadastrado com sucesso!`);
        setNome(''); setEmail(''); setDataNasc(''); setTelefone('');
        if (onCadastroSucesso) onCadastroSucesso(response.data);
      })
      .catch(error => {
        console.error(error);
        setErro('❌ Erro ao realizar cadastro. Verifique se o e-mail já existe.');
      });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', textAlign: 'center' }}>📝 Inscrição do Aluno (ODS 4)</h3>
      
      {erro && <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>{sucesso}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Nome Completo:</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>E-mail:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Data de Nascimento:</label>
          <input type="date" value={dataNasc} onChange={e => setDataNasc(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Telefone:</label>
          <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          Salvar Cadastro
        </button>
      </form>
    </div>
  );
};

export default FormularioCadastro;
