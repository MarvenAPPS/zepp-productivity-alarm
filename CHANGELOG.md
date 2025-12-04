# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-04

### Added
- Initial release
- Multiple alarms per day with customizable questions
- Up to 30 yes/no questions with configurable point values
- Points balance system with TND currency conversion
- History tracking with reset and redeem functionality
- Redeem system (minimum 1000 points, multiples of 1000 only)
- 5-minute continuous vibration until questions answered
- Server synchronization support
- Complete Node.js backend with SQLite

### Fixed
- Updated `app.json` to configVersion v3 (latest format)
- Added required `defaultLanguage` field
- Added required `platforms` array with Amazfit Balance specifications
- Updated API version to target 4.2 (compatible with 3.7+)
- Added internationalization support (English, French, Arabic)

### Technical Details
- **API_LEVEL**: Target 4.2, compatible with 3.7+
- **Zepp OS**: Compatible with Zepp OS 4.0+ (Amazfit Balance)
- **Device Support**: Amazfit Balance (466x466 round display)
- **Config Version**: v3 (latest)
