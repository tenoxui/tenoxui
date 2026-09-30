export const DEFAULT_GLOBAL_PATTERN = '[\\w.-]+'

type Param = string | (string | string[])[]

export function createMatcher(variant?: Param, utility?: Param, value?: Param) {
  const normalize = (input?: Param) => {
    const flat = Array.isArray(input) ? input.flat(Infinity) : [input]
    return flat.filter(Boolean).join('|') || DEFAULT_GLOBAL_PATTERN
  }

  return new RegExp(
    `^(?:(?<variant>${normalize(variant)}):)?(?<utility>${normalize(
      utility
    )})(?:-(?<value>${normalize(value)}?))?$`
  )
}
