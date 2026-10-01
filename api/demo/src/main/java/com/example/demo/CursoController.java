package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoRepository repository;

    // 1. CADASTRAR CURSO (Create)
    @PostMapping
    public Curso criar(@RequestBody Curso curso) {
        return repository.save(curso);
    }

    // 2. LISTAR TODOS OS CURSOS (Read)
    @GetMapping
    public List<Curso> listarTodos() {
        return repository.findAll();
    }

    // 3. BUSCAR UM CURSO PELO ID (Read por ID)
    @GetMapping("/{id}")
    public ResponseEntity<Curso> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(curso -> ResponseEntity.ok().body(curso))
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. ATUALIZAR UM CURSO (Update)
    @PutMapping("/{id}")
    public ResponseEntity<Curso> atualizar(@PathVariable Long id, @RequestBody Curso cursoAtualizado) {
        return repository.findById(id)
                .map(curso -> {
                    curso.setNome(cursoAtualizado.getNome());
                    curso.setDescricao(cursoAtualizado.getDescricao());
                    curso.setDuracaoHoras(cursoAtualizado.getDuracaoHoras());
                    curso.setVagasDisponiveis(cursoAtualizado.getVagasDisponiveis());
                    curso.setEmpresaParceira(cursoAtualizado.getEmpresaParceira());
                    curso.setContrapartidaEmprego(cursoAtualizado.getContrapartidaEmprego());
                    Curso salvo = repository.save(curso);
                    return ResponseEntity.ok().body(salvo);
                }).orElse(ResponseEntity.notFound().build());
    }

    // 5. DELETAR UM CURSO (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(curso -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
