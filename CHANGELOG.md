# Changelog

## [Unreleased]

### Changed
- Replace headless browser for testing from nightmare to puppeteer.

## [0.0.1] - 2020-08-12

### Added

- This CHANGELOG file
- Github Workflows for coverage reporting
- `test/bin/fixLcovInfo.js` to convert windows style path separator to UNIX style 

### Changed
- Greatly improve README.md
- Improved package.json for accessibility

### Fixed
- lcov.info path format.  
  * Changed windows style path separator to UNIX style as coveralls cannot parse windows style path separator.
  
[Unreleased]: https://github.com/Hinaser/xspy/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Hinaser/xspy/releases/tag/v0.0.1
