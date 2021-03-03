module.exports = {
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},

	setupFilesAfterEnv: [
		// "@testing-library/react/cleanup-after-each",
		"@testing-library/jest-dom/extend-expect"
	],

	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

	// Module file extensions for importing
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleDirectories: [
		"node_modules",
		"src"
	],
	moduleNameMapper: {
		"\\.(ttf|woff|png|jpg|jpeg|svg|gif)$": "<rootDir>/src/tests/mocks/fileMock.js",
		"\\.(css|scss)$": "identity-obj-proxy"
	}
};
