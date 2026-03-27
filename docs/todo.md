
## Experiência do Usuário

1. [ ] Permitir upload de imagem de avatar pelo usuário
2. [ ] Corrigir os layouts mobile
3. [ ] Checar o menu hambúrguer
4. [ ] Alinhar navbar e seus elementos (corrigir desproporção e assimetria)
5. [ ] Checar se a barra de loading acompanha o processo de análise ou se ela reseta ao sair/voltar do componente de análise


# TODO ResumeAI


## Funcionalidades

6. [x] **Async** agora funciona corretamente: token só é gasto se a análise realmente for processada, mesmo que o usuário mude de página.
7. [x] Verificação para gastar token apenas se a análise for concluída perfeitamente (atualmente gasta no momento do click no botão e nao na conclusao)
8. [x] Análise poder rodar em segundo plano caso usuário mude de componente, não gastar token à toa
9. [x] Adicionado ao navbar o botão que leva ao `/upload` (Análise/Analysis)
10. [x] Bolar um token mais bonito, talvez um favicon de moeda
11. [ ] Atualizar o que realmente tem no Free e Pro para o componente de Pricing
12. [ ] Pensar na lógica do Teams


## Manutenção & Segurança

13. [ ] Checar a funcionalidade de 30 dias do token se funciona mesmo
14. [ ] Automatizar o teste de todos os componentes e endpoints
15. [ ] Simular pentest e garantir toda a segurança