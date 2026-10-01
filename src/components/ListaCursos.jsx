import React, { useEffect, useState } from 'react';
import api from '../api';

const ListaCursos = ({ alunoLogado, onMatriculaSucesso }) => {
  const [cursos, setCursos] = useState([]);
  const [matriculasDoAluno, setMatriculasDoAluno] = useState([]);
  const [mensagem, setMensagem] = useState('');

  // Busca o catálogo de cursos e as matrículas atuais do aluno logado
  useEffect(() => {
    api.get('/cursos')
      .then(response => setCursos(response.data))
      .catch(error => console.error("Erro ao buscar cursos:", error));

    if (alunoLogado && alunoLogado.id) {
      api.get('/inscricoes')
        .then(response => {
          // Filtra apenas as inscrições pertencentes ao aluno que está logado na sessão
          const filtradas = response.data.filter(ins => ins.usuario && ins.usuario.id === alunoLogado.id);
          setMatriculasDoAluno(filtradas);
        })
        .catch(error => console.error("Erro ao buscar inscrições:", error));
    } else {
      setMatriculasDoAluno([]);
    }
  }, [alunoLogado, onMatriculaSucesso]);

  // Função para Realizar Matrícula (CREATE do CRUD)
  const handleMatricula = (cursoId) => {
    if (!alunoLogado) {
      setMensagem('⚠️ Você precisa realizar o cadastro de aluno acima primeiro para se matricular!');
      return;
    }

    const novaInscricao = {
      usuario: { id: alunoLogado.id },
      curso: { id: cursoId }
    };

    api.post('/inscricoes', novaInscricao)
      .then(() => {
setMensagem('✅ Matrícula realizada com sucesso! Conclua as aulas com excelente desempenho para liberar seu encaminhamento exclusivo à entrevista de emprego.');
        if (onMatriculaSucesso) onMatriculaSucesso();
      })
      .catch(error => {
        console.error(error);
        setMensagem('❌ Erro ao efetuar matrícula.');
      });
  };

  // Função para Cancelar Matrícula (DELETE do CRUD)
  const handleCancelarMatricula = (inscricaoId) => {
    if (window.confirm("Tem certeza que deseja cancelar sua inscrição neste curso?")) {
      api.delete(`/inscricoes/${inscricaoId}`)
        .then(() => {
          setMensagem('ℹ️ Matrícula cancelada com sucesso.');
          if (onMatriculaSucesso) onMatriculaSucesso();
        })
        .catch(error => {
          console.error(error);
          setMensagem('❌ Erro ao cancelar matrícula.');
        });
    }
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <h3 style={{ color: '#1e3a8a', borderBottom: '3px solid #0284c7', paddingBottom: '0.75rem', fontSize: '1.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🚀 Cursos de Capacitação com Vagas Vinculadas (ODS 8)
      </h3>
      
      {mensagem && (
        <div style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '6px solid #3b82f6', fontWeight: '600', color: '#1d4ed8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {mensagem}
        </div>
      )}

      {/* Grid inteligente que ajusta os cards em colunas bonitas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {cursos.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#64748b' }}>Carregando catálogo de cursos...</p>
        ) : (
          cursos.map(curso => {
            // Verifica se este curso específico possui alguma matrícula ativa para o aluno atual
            const matriculaExistente = matriculasDoAluno.find(ins => ins.curso && ins.curso.id === curso.id);

            return (
              <div 
                key={curso.id} 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  backgroundColor: '#ffffff', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, boxShadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '1.35rem', fontWeight: 'bold', lineHeight: '1.3' }}>{curso.nome}</h4>
                  
                  {/* AJUSTE TOP: Rolagem interna caso o texto seja muito grande */}
                  <div style={{ 
                    maxHeight: '90px', 
                    overflowY: 'auto', 
                    paddingRight: '4px',
                    marginBottom: '1.25rem'
                  }}>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                      {curso.descricao}
                    </p>
                  </div>
                  
                  <p style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    ⏱️ <strong>Duração:</strong> {curso.duracaoHoras} horas
                  </p>
                  
                  {/* Caixa do Parceiro com bordas suaves e cores vivas */}
                  <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '12px', borderLeft: '5px solid #10b981', margin: '1.5rem 0' }}>
                    <p style={{ margin: 0, color: '#14532d', fontWeight: '700', fontSize: '1rem' }}>🤝 Parceiro: {curso.empresaParceira}</p>
                    <p style={{ margin: '0.4rem 0 0 0', color: '#166534', fontSize: '0.9rem', lineHeight: '1.4' }}>🎯 <strong>Oportunidade:</strong> {curso.contrapartidaEmprego}</p>
                  </div>
                </div>

                {/* Alternância de botão dinâmico para garantir a operação DELETE do CRUD */}
                {matriculaExistente ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCancelarMatricula(matriculaExistente.id); }}
                    style={{ 
                      width: '100%', 
                      padding: '0.85rem', 
                      backgroundColor: '#dc2626', 
                      color: '#ffffff', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontSize: '1rem',
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
                      transition: 'background-color 0.2s' 
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                  >
                    ❌ Cancelar Matrícula
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleMatricula(curso.id); }}
                    style={{ 
                      width: '100%', 
                      padding: '0.85rem', 
                      backgroundColor: '#0284c7', 
                      color: '#ffffff', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontSize: '1rem',
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)',
                      transition: 'background-color 0.2s' 
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0369a1'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0284c7'}
                  >
                    Quero me Matricular
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListaCursos;
