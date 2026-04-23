import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**', 'build/**', 'coverage/**', '**/migrations/**', '**/seed/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			'consistent-return': 'error',
			'quotes': ['error', 'single'],
			'eqeqeq': ['error', 'always'],
			'curly': ['error', 'all'],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off'
		},
	},

	{
		files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		}
	}
);
