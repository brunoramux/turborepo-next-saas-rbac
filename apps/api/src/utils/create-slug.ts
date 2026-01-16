/**
 * Create a URL-friendly slug from a given string.
 */
export type SlugOptions = {
  separator?: string
  lower?: boolean
  trim?: boolean
  maxLength?: number
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function createSlug(input: string, options: SlugOptions = {}): string {
  const sep = options.separator ?? '-'
  const lower = options.lower ?? true
  const trim = options.trim ?? true

  // NORMALIZAR
  let s = String(input ?? '').normalize('NFKD')

  // REMOVER ACENTOS
  s = s.replace(/[\u0300-\u036f]/g, '')

  // SUBSTITUIR SÍMBOLOS COMUNS
  s = s.replace(/&/g, ' and ').replace(/@/g, ' at ').replace(/\+/g, ' plus ')

  // REMOVER ASPAS
  s = s.replace(/['"`]/g, '')

  // MINÚSCULAS
  if (lower) s = s.toLowerCase()

  // SUBSTITUIR NÃO ALFANUMÉRICOS PELO SEPARADOR
  s = s.replace(/[^a-z0-9]+/g, sep)

  // COLAPSAR MÚLTIPLOS SEPARADORES
  const escSep = escapeRegExp(sep)
  s = s.replace(new RegExp(`${escSep}+`, 'g'), sep)

  // REMOVER SEPARADORES INICIAIS E FINAIS
  if (trim) s = s.replace(new RegExp(`^${escSep}+|${escSep}+$`, 'g'), '')

  // APLICAR LIMITE MÁXIMO DE CARACTERES
  if (options.maxLength && options.maxLength > 0) {
    s = s.slice(0, options.maxLength)
    s = s.replace(new RegExp(`${escSep}+$`), '') // evitar separador final após o corte
  }

  return s
}

export default createSlug
