package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // 1. CADASTRAR USUÁRIO COM VALIDAÇÃO DE IDADE (Create)
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        if (usuario.getDataNascimento() == null) {
            return ResponseEntity.badRequest().body("A data de nascimento é obrigatória.");
        }
        
        int idade = Period.between(usuario.getDataNascimento(), LocalDate.now()).getYears();
        
        if (idade < 18) {
            return ResponseEntity.badRequest().body("Cadastro não permitido: A plataforma é exclusiva para maiores de 18 anos.");
        }

        Usuario salvo = repository.save(usuario);
        return ResponseEntity.ok(salvo);
    }

    // 2. LISTAR TODOS OS USUÁRIOS (Read)
    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // 3. BUSCAR USUÁRIO POR ID (Read por ID)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(usuario -> ResponseEntity.ok().body(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. ATUALIZAR USUÁRIO (Update)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        return repository.findById(id)
                .map(usuario -> {
                    if (usuarioAtualizado.getDataNascimento() == null) {
                        return ResponseEntity.badRequest().body("A data de nascimento é obrigatória.");
                    }
                    
                    int idade = Period.between(usuarioAtualizado.getDataNascimento(), LocalDate.now()).getYears();
                    if (idade < 18) {
                        return ResponseEntity.badRequest().body("Alteração não permitida: O usuário deve ter 18 anos ou mais.");
                    }
                    
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setDataNascimento(usuarioAtualizado.getDataNascimento());
                    usuario.setTelefone(usuarioAtualizado.getTelefone());
                    Usuario salvo = repository.save(usuario);
                    return ResponseEntity.ok(salvo);
                }).orElse(ResponseEntity.notFound().build());
    }

    // 5. DELETAR USUÁRIO (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(usuario -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
