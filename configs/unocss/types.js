/** @typedef {import('unocss').Rule Rule} */
/** @typedef {import('unocss').CSSObject CSSObject} */
/** @typedef {import('unocss').Arrayable Arrayable} */

/**
 * @typedef ThemeAnimation
 * @property {Record<string, string>} [keyframes]
 * @property {Record<string, string>} [durations]
 * @property {Record<string, string>} [timingFns]
 * @property {Record<string, object>} [properties]
 * @property {Record<string, string | number>} [counts]
 */

/**
 * @typedef Container
 * @property {boolean} [center]
 * @property {string | Record<string, string>} [padding]
 * @property {Record<string, string>} [maxWidth]
 */

/**
 * @typedef {Object} Theme
 * @property {Record<string, string>} [width]
 * @property {Record<string, string>} [height]
 * @property {Record<string, string>} [maxWidth]
 * @property {Record<string, string>} [maxHeight]
 * @property {Record<string, string>} [minWidth]
 * @property {Record<string, string>} [minHeight]
 * @property {Record<string, string>} [inlineSize]
 * @property {Record<string, string>} [blockSize]
 * @property {Record<string, string>} [maxInlineSize]
 * @property {Record<string, string>} [maxBlockSize]
 * @property {Record<string, string>} [minInlineSize]
 * @property {Record<string, string>} [minBlockSize]
 * @property {Record<string, string>} [borderRadius]
 * @property {Record<string, string>} [breakpoints]
 * @property {Record<string, string>} [verticalBreakpoints]
 * @property {Colors} [colors]
 * @property {Colors} [borderColor]
 * @property {Colors} [backgroundColor]
 * @property {Colors} [textColor]
 * @property {Colors} [shadowColor]
 * @property {Colors} [accentColor]
 * @property {Record<string, string>} [fontFamily]
 * @property {Record<string, string | [string, string | CSSObject] | [string, string, string]>} [fontSize]
 * @property {Record<string, string>} [fontWeight]
 * @property {Record<string, string>} [lineHeight]
 * @property {Record<string, string>} [letterSpacing]
 * @property {Record<string, string>} [wordSpacing]
 * @property {Record<string, string | string[]>} [boxShadow]
 * @property {Record<string, string>} [textIndent]
 * @property {Record<string, string | string[]>} [textShadow]
 * @property {Record<string, string>} [textStrokeWidth]
 * @property {Record<string, string>} [ringWidth]
 * @property {Record<string, string>} [lineWidth]
 * @property {Record<string, string>} [spacing]
 * @property {Record<string, string>} [duration]
 * @property {Record<string, string>} [aria]
 * @property {Record<string, string>} [data]
 * @property {Record<string, string>} [zIndex]
 * @property {Record<string, string>} [blur]
 * @property {Record<string, string | string[]>} [dropShadow]
 * @property {Record<string, string>} [easing]
 * @property {Record<string, string>} [media]
 * @property {Record<string, string>} [supports]
 * @property {Record<string, string>} [containers]
 * @property {ThemeAnimation} [animation]
 * @property {Record<string, string>} [gridAutoColumn]
 * @property {Record<string, string>} [gridAuthRow]
 * @property {Record<string, string>} [gridColumn]
 * @property {Record<string, string>} [gridRow]
 * @property {Record<string, string>} [gridTemplateColumn]
 * @property {Record<string, string>} [gridTemplateRow]
 * @property {Container} [container]
 * @property {Arrayable<string>} [preflightRoot]
 * @property {Record<string, string | number>} [preflightBase]
 */
