module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"@vue/prettier",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: 2020,
		parser: {
			ts: "@typescript-eslint/parser",
			"<template>": "espree",
		},
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-unused-vars": ["error"],
		"vue/no-v-html": 0,
		"no-undef": "off",
		"no-unused-vars": "off",
		"prettier/prettier": [
			"error",
			{
				endOfLine: "auto",
			},
		],
	},
};
