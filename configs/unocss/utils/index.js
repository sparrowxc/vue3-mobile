export function camelCase(str) {
  return str.replace(/-([a-z])/g, (_, v) => v.toUpperCase())
}
