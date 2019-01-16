> A somewhat improved version of https://github.com/martinring/tmlanguage

# tmlanguage

This is a JSON schema for Textmate grammar definitions. Can be used to get Intellisense working when etiting grammar definitions within Textmate and other compatible editors such as Visual Studio Code, Eclipse, Atom, Sublime and more.

# Changes in this fork
- New: allows all on/off properties (e.g. `disabled`, `applyEndPatternLast`...) to be either a number (0|1) or a boolean (true|false) value
- New: adds the `while` property (to be used together with `begin` instead of `end`) and its accompagnying `whileCaptures` property
- New: adds the `applyEndPatternLast` property (to be used with `begin`/`end` and `begin`/`while` loops) to the set of rules properties
- New: adds `injectionSelector` and `injections` to grammar properties
- New: signals missing required properties in rules, e.g. `begin` without `end` or `while`, `patterns` without `begin`, etc.
- New: signals mutually exclusive properties where appropriate, e.g. `match` and `begin`
- Fixed: allows for space-separated scopes in the `name` property
- Fixed: the `patterns` property is not required in rules, only in the top grammar properties
