> An improved version of https://github.com/martinring/tmlanguage

# tmlanguage

This is a json schema for Textmate grammar definitions. Can be used to get Intellisense working when etiting grammar definitions within Visual Studio Code.

# Changes in this fork
- Allows for space-separated scopes in the `name` property
- Allows the `disabled` property to be either number (0|1) or boolean (true|false)
- Adds the `while` property (to be used with `begin` instead of `end`)
- Adds the `applyEndPatternLast` property (to be used with `begin`/`end` and `begin`/`while` loops)
- Fixed: the `patterns` property is not really required
