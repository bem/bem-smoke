# Changelog

# 0.3.2

* added `fs.lstatSync` mock.

# 0.3.1
* ignore `insight` module.

# 0.3.0

* works with bem 0.6.x.
* added `withMockedModules` method.
* added `withMockedModuleResolves` method.
* added `asserts` method.
* added `touchFile` method.
* `context.opts` now has `declaration` and `root` fields during build.
* `q-fs` module is mocked too.

# v0.2.0

* added `withTechMap` setup method that allows to specify base technologies path.
* added assertions `writesToFile` and `notWritesToFile`.
* tech under test now receives correct `Context` instance.

# v0.1.0

* Initial release.
