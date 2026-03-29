

# TODO ResumeAI

## UI/UX (Experiência do Usuário)

2. [x] Corrigir os layouts mobile
3. [x] Checar o menu hambúrguer
4. [x] Alinhar navbar e seus elementos (corrigir desproporção e assimetria)
5. [x] Checar se a barra de loading acompanha o processo de análise ou se ela reseta ao sair/voltar do componente de análise
6. [x] Exibir o saldo de tokens na navbar do mobile
7. [x] **Async** agora funciona corretamente: token só é gasto se a análise realmente for processada, mesmo que o usuário mude de página.
8. [x] Verificação para gastar token apenas se a análise for concluída perfeitamente (atualmente gasta no momento do click no botão e nao na conclusao)
9. [x] Análise poder rodar em segundo plano caso usuário mude de componente, não gastar token à toa
10. [x] Adicionado ao navbar o botão que leva ao `/upload` (Análise/Analysis)
11. [x] Bolar um token mais bonito, talvez um favicon de moeda
12. [x] Atualizar o que realmente tem no Free e Pro para o componente de Pricing
13. [ ] Ajustar preços e lógica de serviços do plano Pro conforme regras atuais
14. [ ] Conferir e revisar traduções pt-br e inglês no I18N para refletir os novos componentes e textos
15. [ ] Pensar na lógica do Teams (UI)
16. [ ] Adicionar tela/fluxo para edição de currículo PDF usando AI
17. [ ] Tela para aprovações dos textos sugeridos pela AI
18. [ ] Tela/opção de download do novo currículo em PDF


## Lógica/Função
19. [ ] Implementar lógica para edição de PDF via AI (backend/service)
20. [ ] Implementar lógica para sugerir textos personalizados pesquisando função do usuário
21. [ ] Implementar lógica de aprovação dos textos pelo usuário
22. [ ] Gerar novo PDF editado para download
23. [ ] Adaptar regras de negócio dos planos para contemplar edição de currículo


## Banco de Dados
24. [ ] Criar/ajustar modelos para armazenar versões editadas de currículos
25. [ ] Salvar aprovações e histórico de edições do usuário



## Manutenção & Segurança
26. [ ] Checar a funcionalidade de 30 dias do token se funciona mesmo
27. [ ] Automatizar o teste de todos os componentes e endpoints
28. [ ] Simular pentest e garantir toda a segurança