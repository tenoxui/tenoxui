export const functionVariants = {
  is: ({ value = '' }) => `value:&:is(${value})`,
  where: ({ value = '' }) => `value:&:where(${value})`,
}
