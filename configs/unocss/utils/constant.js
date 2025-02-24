export const numberWithUnitRE = /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i
export const numberRE = /^(-?\d*(?:\.\d+)?)$/i
export const unitOnlyRE = /^(px|[sld]?v[wh])$/i
export const unitOnlyMap = {
  px: 1,
  vw: 100,
  vh: 100,
  svw: 100,
  svh: 100,
  dvw: 100,
  dvh: 100,
  lvh: 100,
  lvw: 100,
}
export const bracketTypeRe = /^\[(color|length|size|position|quoted|string):/i
export const splitComma = /,(?![^()]*\))/g

export const pxRE = /(-?[\.\d]+)px/g
export const remRE = /(-?[\.\d]+)rem/g

export const SAFE_MAP = {
  t: { 'padding-top': 'env(safe-area-inset-top)' },
  r: { 'padding-right': 'env(safe-area-inset-right)' },
  b: { 'padding-bottom': 'env(safe-area-inset-bottom)' },
  l: { 'padding-left': 'env(safe-area-inset-left)' },
  x: { 'padding-left': 'env(safe-area-inset-left)', 'padding-right': 'env(safe-area-inset-right)' },
  y: { 'padding-top': 'env(safe-area-inset-top)', 'padding-bottom': 'env(safe-area-inset-bottom)' },
}
