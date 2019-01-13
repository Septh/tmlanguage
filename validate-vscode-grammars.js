/*
 * A simple Node.js script to validate all VSCode's default grammars against our schema.
 */
const jetpack = require('fs-jetpack')
const path    = require('path')
const json    = require('jsonfile')
const glob    = require('glob')
const chalk   = require('chalk')

// Change as appropriate
const VSCODE_INSTALL_PATH = 'E:\\Microsoft VS Code'
const VSCODE_EXTENSIONS_PATH = path.join(VSCODE_INSTALL_PATH, 'resources', 'app', 'extensions')
// /Change as appropriate

const DEFAULT_GLOB = '**/*.tmLanguage.json'

json.readFile('tmLanguage.json').then( schema => {

    let scan_dir  = VSCODE_EXTENSIONS_PATH,
        scan_glob = DEFAULT_GLOB

    const arg = process.argv[2]
    if (typeof arg === 'string') {
        const status = jetpack.exists(arg)
        if (status === 'dir') {
            scan_dir = arg
            if (typeof process.argv[3] === 'string') {
                scan_glob = process.argv[3]
            }
        }
        else if (status === 'file') {
            const parsed = path.parse(arg)
            scan_dir = parsed.dir
            scan_glob = parsed.base
        }
    }

    console.info(chalk.yellow("Fetching grammar(s)..."))
    const grammars = glob.sync(scan_glob, {
        cwd: scan_dir,
        nocase: true
    })

    if (grammars.length === 0) {
        console.info(chalk.yellow('None found'))
    }
    else {
        console.info(chalk.yellow("Found %d grammars"), grammars.length)

        let num_errors = 0,
            num_wrong_files = 0,
            num_right_files = 0

        const validate = require('jsonschema').validate
        grammars.forEach(grammar => {
            try {
                const results = validate(json.readFileSync(path.join(scan_dir, grammar)), schema, { nestedErrors: true })
                if (results.valid) {
                    console.info(chalk.green("Validated '%s'"), grammar)
                    num_right_files++
                }
                else {
                    console.error(chalk.red('Error(s) in %s:'), grammar)
                    results.errors.forEach(err => console.error(chalk.yellow('\t%s'), err.stack))
                    num_wrong_files++
                    num_errors += results.errors.length

                    // process.exit(0)
                }
            }
            catch(err) { console.error(chalk.red(err)) }
        })

        console.info(chalk.yellow('\nDone.\n%d files are valid tmLanguage grammars, %d files generated %d errors.'), num_right_files, num_wrong_files, num_errors)
    }
}).catch(err => console.error(chalk.red(err)))
