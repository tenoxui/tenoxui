export const DEFAULT_GLOBAL_PATTERN = '[\\w.-]+'

export function createMatcher(variant?: string, property?: string, value?: string) {
  return new RegExp(
    `^(?:(?<variant>${variant || DEFAULT_GLOBAL_PATTERN}):)?(?<property>${
      property || DEFAULT_GLOBAL_PATTERN
    })(?:-(?<value>${value || DEFAULT_GLOBAL_PATTERN}?))?$`
  )
}
