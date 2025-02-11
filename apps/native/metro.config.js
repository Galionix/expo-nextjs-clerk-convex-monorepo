const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Добавляем дополнительные папки, за которыми Metro должен следить.
config.watchFolders = [
  // Корневая папка общего монорепозитория — путь к packages/ui
  path.resolve(__dirname, "../../packages/ui"),
  path.resolve(__dirname, "../../packages/backend/convex/_generated")
];

// Указываем дополнительные пути для поиска node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules")
];

module.exports = config;
