// // @index('./**/*.ts', f => `import * as ${f.name} from '${f.path}'`)
import * as storeConfig from './storeConfig'
import * as theme from './theme'
// // @endindex

// @index('./**/*.ts', f => `export * from '${f.path}'`)
export * from './storeConfig'
export * from './theme'
// @endindex