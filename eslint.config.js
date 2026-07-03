import js from '@eslint/js';
import ts from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';

export default ts.config(
	{ ignores: ['build/', '.svelte-kit/', 'research_semantic_search/', '.agents/', 'scripts/migration.sql'] },
	js.configs.recommended,
	...ts.configs.recommended,
	...sveltePlugin.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			'no-undef': 'off',
			// Bookmark URLs are external links to saved pages; resolve() is for internal routes.
			'svelte/no-navigation-without-resolve': 'off',
			// Snippets are server-generated via Postgres ts_headline over our own trusted corpus.
			'svelte/no-at-html-tags': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
		}
	}
);
