export function isProcessedValue(value: any): value is { key: string; value: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.value === 'string'
  )
}

export function isUtilityFunction(utility: any): utility is Function {
  return typeof utility === 'function'
}

export function isUtilityConfig(utility: any): utility is { property?: any; value?: any } {
  return (
    typeof utility === 'object' && utility !== null && ('property' in utility || 'value' in utility)
  )
}

export function extractMatchGroups(match: RegExpMatchArray): {
  variant?: string
  property: string
  value?: string
} {
  const groups = match.groups || {}
  return {
    variant: groups.variant,
    property: groups.property || '',
    value: groups.value
  }
}
