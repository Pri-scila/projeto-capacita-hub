package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inscricoes")
@CrossOrigin(origins = "*")
public class InscricaoController {

    @Autowired
    private InscricaoRepository repository;

    // 1. EFETUAR MATRÍCULA (Create)
    @PostMapping
    public Inscricao criar(@RequestBody Inscricao inscricao) {
        return repository.save(inscricao);
    }

    // 2. LISTAR TODAS AS MATRÍCULAS (Read)
    @GetMapping
    public List<Inscricao> listarTodas() {
        return repository.findAll();
    }

    // 3. BUSCAR MATRÍCULA POR ID (Read por ID)
    @GetMapping("/{id}")
    public ResponseEntity<Inscricao> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(inscricao -> ResponseEntity.ok().body(inscricao))
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. ATUALIZAR STATUS DA MATRÍCULA (Update - Ex: Concluir ou Cancelar)
    @PutMapping("/{id}")
    public ResponseEntity<Inscricao> atualizar(@PathVariable Long id, @RequestBody Inscricao inscricaoAtualizada) {
        return repository.findById(id)
                .map(inscricao -> {
                    inscricao.setStatus(inscricaoAtualizada.getStatus());
                    Inscricao salvo = repository.save(inscricao);
                    return ResponseEntity.ok().body(salvo);
                }).orElse(ResponseEntity.notFound().build());
    }

    // 5. CANCELAR/DELETAR MATRÍCULA (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(inscricao -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}

