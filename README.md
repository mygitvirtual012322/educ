# Cartão Futuro Escolar - EducaBank

Sistema completo de solicitação do Cartão Futuro Escolar do Governo Federal.

## 🚀 Deploy no Railway

### Passo a Passo:

1. **Acesse o Railway**: https://railway.app/
2. **Faça login** com sua conta GitHub
3. **Crie um novo projeto**:
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `mygitvirtual012322/educ`
4. **Configuração automática**:
   - O Railway detectará automaticamente que é um projeto Next.js
   - As variáveis de ambiente serão configuradas automaticamente
5. **Deploy**:
   - O Railway fará o build e deploy automaticamente
   - Aguarde alguns minutos até o deploy ser concluído
6. **Acesse sua aplicação**:
   - O Railway fornecerá uma URL pública (ex: `educ-production.up.railway.app`)

### Comandos de Build (Automáticos no Railway):

```bash
npm install
npm run build
npm run start
```

## 📦 Estrutura do Projeto

- `/app` - Páginas e rotas do Next.js
- `/components` - Componentes React reutilizáveis
- `/public` - Arquivos estáticos (imagens, logos)

## 🎨 Funcionalidades

- ✅ Landing page institucional
- ✅ Formulário de solicitação com validação de CPF
- ✅ Quiz de segurança
- ✅ Upload de documentos
- ✅ Tela de análise com animação
- ✅ Página de aprovação com cartão virtual
- ✅ Sistema de entrega com CEP automático
- ✅ Integração com Correios
- ✅ Pagamento via Pix
- ✅ Carrossel de parceiros (Kalunga, Saraiva, Americanas, etc.)

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Lucide React** - Ícones
- **Framer Motion** - Animações

## 📝 Variáveis de Ambiente

Não são necessárias variáveis de ambiente para o funcionamento básico. O projeto está pronto para deploy!

## 🔗 Links Importantes

- **Repositório**: https://github.com/mygitvirtual012322/educ
- **Railway**: https://railway.app/

---

Desenvolvido para o Governo Federal - Programa Cartão Futuro Escolar
