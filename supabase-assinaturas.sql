-- Produtividade da Frota (app de campo)
-- Rodar UMA VEZ no Supabase: menu SQL Editor > New query > colar > Run.

-- Guarda as assinaturas do operador e do apontador, com a trilha
-- (data/hora, GPS, aparelho, código de conferência) e o histórico de
-- assinaturas anuladas por correção. Lançamentos feitos pelo sistema
-- do escritório continuam com essa coluna vazia.
alter table public.frota_rdo
  add column if not exists assinaturas jsonb;

comment on column public.frota_rdo.assinaturas is
  'Assinaturas colhidas no app de campo (operador, apontador, trilha e histórico). Nulo para lançamentos do escritório.';
