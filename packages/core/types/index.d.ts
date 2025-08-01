import type { Root } from 'hast';
import type { BundledHighlighterOptions, CodeToHastOptions, CodeToTokensBaseOptions, CodeToTokensOptions, CodeToTokensWithThemesOptions, GrammarState, HighlighterGeneric, RequireKeys, ThemedToken, ThemedTokenWithVariants, TokensResult } from 'shiki';

// #region src/hooks/useShiki.d.ts
interface GlobalShiki {
  codeToHtml: (code: string, options: CodeToHastOptions<string, string>) => Promise<string>;
  codeToHast: (code: string, options: CodeToHastOptions<string, string>) => Promise<Root>;
  codeToTokensBase: (code: string, options: RequireKeys<CodeToTokensBaseOptions<string, string>, 'theme' | 'lang'>) => Promise<ThemedToken[][]>;
  codeToTokens: (code: string, options: CodeToTokensOptions<string, string>) => Promise<TokensResult>;
  codeToTokensWithThemes: (code: string, options: RequireKeys<CodeToTokensWithThemesOptions<string, string>, 'lang' | 'themes'>) => Promise<ThemedTokenWithVariants[][]>;
  getSingletonHighlighter: (options?: Partial<BundledHighlighterOptions<string, string>>) => Promise<HighlighterGeneric<string, string>>;
  getLastGrammarState: ((element: ThemedToken[][] | Root) => GrammarState) | ((code: string, options: CodeToTokensBaseOptions<string, string>) => Promise<GrammarState>);
}
interface UseShikiOptions {
  provideKey: symbol;
}
declare function useShiki(options?: UseShikiOptions): GlobalShiki;
// #endregion
export { useShiki as default, GlobalShiki, useShiki, UseShikiOptions };
