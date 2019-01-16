/*
 * A very simple Node.js script to validate arbitrary grammar files against our schema.
 * Tested on Windows only as I don't have access to other boxes.
 *
 * Usage:
 *  $ node validate-grammar [path] [glob]
 *      - path: the directory to scan for grammar files. Optional. Defaults to the current directory.
 *      - glob: a pattern of files to search for in `path`. Optional. Defaults to '** /*.tmLanguage.json' (without the space :)
 */
const path  = require('path')
const json  = require('jsonfile')
const glob  = require('glob')
const chalk = require('chalk')

const DEFAULT_PATH = process.cwd()
const DEFAULT_GLOB = '**/*.tmLanguage.json'

function fileType(name) {
    const fs = require('fs')
    try {
        const stat = fs.statSync(name)
        return stat.isDirectory() ? 'dir' :
               stat.isFile() ? 'file' :
               'other'
    }
    catch(err) {
        if (err.code !== "ENOENT") {
            throw err
        }
    }
    return false
}

json.readFile(path.join(__dirname, 'tmLanguage.json')).then(schema => {

    const scan = {
        dir: DEFAULT_PATH,
        glob: DEFAULT_GLOB
    }

    const arg = process.argv[2]
    if (typeof arg === 'string') {
        const ftype = fileType(arg)
        if (ftype === 'dir') {
            scan.dir = arg
            if (typeof process.argv[3] === 'string') {
                scan.glob = process.argv[3]
            }
        }
        else if (ftype === 'file') {
            const parsed = path.parse(arg)
            scan.dir = parsed.dir
            scan.glob = parsed.base
        }
    }

    console.info(chalk.yellow("Fetching grammar(s)..."))
    const grammars = glob.sync(scan.glob, {
        cwd: scan.dir,
        nocase: true
    })

    if (grammars.length === 0) {
        console.info(chalk.yellow('None found'))
    }
    else {
        console.info(chalk.yellow("Found %d grammars"), grammars.length)

        let stats = {
            num_errors: 0,
            good_files: 0,
            bad_files:  0
        }

        const validate = require('jsonschema').validate
        grammars.forEach(grammar => {
            try {
                const results = validate(json.readFileSync(path.join(scan.dir, grammar)), schema, { nestedErrors: false })
                if (results.valid) {
                    console.info(chalk.green("Validated '%s'"), grammar)
                    stats.good_files++
                }
                else {
                    console.info(chalk.red('Error(s) in %s:'), grammar)
                    results.errors.forEach(err => console.info(chalk.yellow('\t%s'), err.stack))
                    stats.bad_files++
                    stats.num_errors += results.errors.length
                }
            }
            catch(err) {
                console.error(chalk.red(err))
            }
        })

        console.info(chalk.yellow('\nDone.\n%d files are valid tmLanguage grammars, %d files generated %d errors.'), stats.good_files, stats.bad_files, stats.num_errors)
    }
}).catch(err => console.error(chalk.red(err)))
