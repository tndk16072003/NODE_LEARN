import argv from 'minimist'
const option = argv(process.argv.slice(2))
export const isProductions = Boolean(option.production)
