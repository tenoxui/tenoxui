# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Use `rollup` for bundling code
- Update core to `tenoxui/core@1.1.0`
- Better global config
- `tenoxui`'s `customProps` => `property`.

### Added

- `applyStyles` function, apply tenoxui styles from exact selector. (same as `makeStyles`)
- More parameters in `tenoxui` function
- Adding two different styling method in `tenoxui` function, `useDom` and `useClass`

### Removed

- `makeStyle` and `makeStyles` functions
