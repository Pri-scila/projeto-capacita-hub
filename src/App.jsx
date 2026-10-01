import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FormularioCadastro from './components/FormularioCadastro';
import ListaCursos from './components/ListaCursos';
import api from './api';

function App() {
  const [alunoLogado, setAlunoLogado] = useState(null);
  const [matriculas, setMatriculas] = useState([]);

  const secaoCursosRef = useRef(null);
  const secaoCadastroRef = useRef(null);
  const secaoMatriculasRef = useRef(null);

  const rolarParaSecao = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const carregarMatriculas = () => {
    api.get('/inscricoes')
      .then(response => {
        if (alunoLogado) {
          const filtradas = response.data.filter(m => m.usuario && m.usuario.id === alunoLogado.id);
          setMatriculas(filtradas);
        }
      })
      .catch(error => console.error("Erro ao carregar matrículas:", error));
  };

  useEffect(() => {
    carregarMatriculas();
  }, [alunoLogado]);

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh', margin: 0, color: '#1e293b' }}>
      
      <Navbar 
        onCliqueCursos={() => rolarParaSecao(secaoCursosRef)}
        onCliqueCadastro={() => rolarParaSecao(secaoCadastroRef)}
        onCliqueMatriculas={() => rolarParaSecao(secaoMatriculasRef)}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)', 
          color: '#ffffff', 
          padding: '3rem', 
          borderRadius: '16px', 
          marginBottom: '3rem', 
          boxShadow: '0 20px 25px -5px rgba(2, 132, 199, 0.3)' 
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#67e8f9', letterSpacing: '-0.025em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Plataforma Capacita+ HUB</h1>
          <p style={{ margin: '0.75rem 0 0 0', color: '#e0f2fe', fontSize: '1.2rem', fontWeight: '400' }}>
            Conectando qualificação profissional gratuita diretamente a oportunidades reais de contratação.
          </p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', color: '#f0fdfa', fontSize: '1.05rem', lineHeight: '1.6' }}>
            <strong>💡 Problema Resolvido:</strong> Combater o desemprego de adultos capacitando pessoas em habilidades de alta demanda no mercado e garantindo encaminhamento direto para entrevistas em empresas parceiras apoiadoras.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          <div ref={secaoCadastroRef}>
            {!alunoLogado ? (
              <FormularioCadastro onCadastroSucesso={(aluno) => setAlunoLogado(aluno)} />
            ) : (
              <div style={{ backgroundColor: '#ecfdf5', padding: '1.5rem 2rem', borderRadius: '16px', borderLeft: '8px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#065f46', fontSize: '1.2rem' }}>
                    👤 Aluno Identificado: <strong style={{ color: '#047857' }}>{alunoLogado.nome || "Estudante"}</strong>
                  </h4>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#047857', fontSize: '1.1rem' }}>Bem-vindo(a) à sua área de estudos!</p>
                </div>
                <button 
                  onClick={() => { setAlunoLogado(null); setMatriculas([]); }}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(239,64,64,0.2)' }}
                >
                  Sair / Mudar Aluno
                </button>
              </div>
            )}
          </div>

          <div ref={secaoCursosRef}>
            <ListaCursos alunoLogado={alunoLogado} onMatriculaSucesso={carregarMatriculas} />
          </div>

          {alunoLogado && (
            <div ref={secaoMatriculasRef} style={{ padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#1e3a8a', margin: '0 0 1.5rem 0', borderBottom: '3px solid #10b981', paddingBottom: '0.5rem', fontSize: '1.5rem' }}>
                📋 Seus Encaminhamentos e Matrículas Ativas
              </h3>
              {matriculas.length === 0 ? (
                <p style={{ color: '#64748b', fontStyle: 'italic' }}>Você ainda não realizou nenhuma matrícula. Escolha um curso acima clicando em "Quero me Matricular"!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {matriculas.map(m => (
                    <div key={m.id} style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '1.3rem', color: '#1e293b' }}>{m.curso?.nome}</strong>
                          <p style={{ margin: '0.35rem 0 0 0', color: '#475569', fontSize: '1rem' }}>🏢 Empresa Parceira: <strong>{m.curso?.empresaParceira}</strong></p>
                        </div>
                        <span style={{ 
                          padding: '0.5rem 1.2rem', 
                          backgroundColor: m.status === 'Concluído' ? '#dbeafe' : '#dcfce7', 
                          color: m.status === 'Concluído' ? '#1e40af' : '#15803d', 
                          borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold' 
                        }}>
                          {m.status === 'Ativo' ? '📖 Curso em Andamento' : '🎓 Curso Concluído'}
                        </span>
                      </div>

                      {m.status === 'Ativo' ? (
                        <div style={{ marginTop: '1.2rem', padding: '1rem', backgroundColor: '#fffbeb', borderLeft: '5px solid #f59e0b', borderRadius: '6px', color: '#b45309', fontSize: '0.95rem', fontWeight: '500' }}>
                          ⏳ Os dados para o processo seletivo na <strong>{m.curso?.empresaParceira}</strong> serão disponibilizados aos alunos que concluírem o curso, seguindo os critérios de avaliação e a disponibilidade de vagas da empresa parceira!
                        </div>
                      ) : (
                        <div style={{ marginTop: '1.2rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderLeft: '5px solid #3b82f6', borderRadius: '10px', boxShadow: '0 4px 6px rgba(59,130,246,0.05)' }}>
                          <h5 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '1.15rem', fontWeight: 'bold' }}>🎉 Parabéns! Seu perfil preencheu os requisitos e seu Encaminhamento foi Gerado:</h5>
                          <p style={{ margin: '0.4rem 0', color: '#1e3a8a', fontSize: '1rem' }}>📅 <strong>Data da Entrevista:</strong> 15/10/2026 às 14:00h</p>
                          <p style={{ margin: '0.4rem 0', color: '#1e3a8a', fontSize: '1rem' }}>📍 <strong>Local/Formato:</strong> Processo Seletivo Online (Link enviado no seu e-mail)</p>
                          <p style={{ margin: '0.4rem 0', color: '#1e3a8a', fontSize: '1rem' }}>📝 <strong>Status da Vaga:</strong> Entrevista Agendada</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '2.5rem', 
        color: '#475569', 
        fontSize: '0.95rem', 
        marginTop: '6rem', 
        backgroundColor: '#cbd5e1', 
        borderTop: '1px solid #94a3b8', 
        fontWeight: '500',
        lineHeight: '1.8'
      }}>
        <div style={{ color: '#334155' }}>Plataforma Capacita+ HUB © 2026 - Desenvolvido por <strong>Priscila Domingos</strong></div>
        <div style={{ color: '#475569', fontSize: '0.9rem' }}>Projeto de Impacto Social Integrado (MySQL + Spring Boot + ReactJS)</div>
        <div style={{ color: '#1e3a8a', fontWeight: '600', marginTop: '0.5rem' }}>
          Alinhado às metas da ONU: Educação de Qualidade (ODS 4) e Trabalho Decente e Crescimento Econômico (ODS 8).
        </div>
      </footer>
    </div>
  );
}

export default App;
