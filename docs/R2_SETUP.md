# Cloudflare R2 Setup Guide

## Configuração do Bucket

### 1. Criar Bucket

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá em **R2 Object Storage**
3. Clique em **"Create bucket"**
4. Configure:
   - **Name**: `map-pins`
   - **Location**: `Automatic` (distribuição global automática)
   - **Storage Class**: `Standard` (acesso frequente)

### 2. Configurar Acesso Público

1. No bucket `map-pins`, vá em **Settings**
2. Em **Public access**, habilite:
   - ✅ **Allow public access**
3. Configure o domínio público (R2.dev ou custom domain)

### 3. Gerar Credenciais de API

1. No dashboard do R2, vá em **Manage R2 API Tokens**
2. Clique em **Create API Token**
3. Configure:
   - **Token name**: `localist-api`
   - **Permissions**: `Object Read & Write`
   - **Bucket**: Selecione `map-pins`
4. Clique em **Create API Token**
5. **Copie e salve**:
   - Access Key ID
   - Secret Access Key
   - Account ID

### 4. Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```bash
# Cloudflare R2
R2_ACCOUNT_ID="seu_account_id"
R2_ACCESS_KEY_ID="sua_access_key_id"
R2_SECRET_ACCESS_KEY="sua_secret_access_key"
R2_BUCKET_NAME="map-pins"
PUBLIC_R2_PUBLIC_URL="https://pub-xxxxxxxxxx.r2.dev"
```

### 5. Testar Upload

Após configurar as variáveis:

1. Reinicie o servidor de desenvolvimento
2. Faça login na aplicação
3. Tente criar um pin com foto
4. Verifique se a foto aparece corretamente

## Troubleshooting

### Erro 403 Forbidden

- Verifique se o bucket está público
- Confirme as credenciais da API
- Verifique as permissões do token

### Erro 404 Not Found

- Confirme o nome do bucket (`map-pins`)
- Verifique o `R2_ACCOUNT_ID`
- Confirme o endpoint público

### Imagem não carrega

- Verifique o `PUBLIC_R2_PUBLIC_URL`
- Confirme CORS se necessário
- Verifique o navegador para erros de rede

## Custos

- **Gratuito**: 10 GB de armazenamento
- **Zero egress**: Sem custo de saída de dados
- **Operations**: 1 milhão de operações gratuitas/mês

## Otimizações Implementadas

- ✅ Compressão WebP/JPEG (80% qualidade)
- ✅ Redimensionamento: 1200x1200px (~100-200 KB)
- ✅ Thumbnails: 300x300px (~15-25 KB)
- ✅ Cache: `max-age=31536000, immutable`
