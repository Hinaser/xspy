# Changelog

<!-- ## [Unreleased] -->

## [0.0.2] - 2020-08-15

### Changed
- Event listener for XMLHttpRequest like `onreadystatechante`, `onload`, ...etc can now receive  
  more precise Event/ProgressEvent.
  
  - `event.target` and `event.currentTarget` now has the originator xhr instance.
  - `onload` and `onloadend` events now holds accurate bytes in `loaded`/`total` property.
  - Calling `event.stopImmediatePropagation` in event listener/function can now stop  
    another listeners to be invoked as well as original XMLHttpRequest.
    
- Replaced the headless browser for testing from nightmare to puppeteer.

### Removed
- Removed map files from `/dist` folder
- Removed non-minified build file from `/dist` folder.

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
  \* Changed windows style path separator to UNIX style as coveralls cannot parse windows style path separator.
  
[Unreleased]: https://github.com/Hinaser/xspy/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/Hinaser/xspy/releases/tag/v0.0.2
[0.0.1]: https://github.com/Hinaser/xspy/releases/tag/v0.0.1
