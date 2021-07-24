// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      pragma: "h",
      version: "17.0.3",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    "import/extensions": ["error", { ts: "never", tsx: "never" }],
    "react/jsx-one-expression-per-line": ["error", { allow: "single-child" }],
    "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
    "react/prop-types": "off",
    // "arrow-parens": ["error", "as-needed"],
    "no-console": "warn",
    "no-param-reassign": "off",
    "import/prefer-default-export": "off",
    "prettier/prettier": "error",
  },
};
