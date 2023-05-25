# Changelog

All notable changes to this project will be documented in this file.

## [3.0.6] - 24.05.2023

### Bugfix

- Fixed the serialization of Entities and EntityCollections with reactive Vue objects which previously could lead to errors like e.g. "*.has is not a function"

## [3.0.4] - 03.02.2023

### Changed

- Added language switch and smart bar buttons into main module.
- Added `tabs` prop to component section to provide the ability to use tabs inside a card.

## [3.0.3] - 25.01.2023
- Added the method `location.get` for getting the actual location ID inside the app

## [3.0.2] - 05.01.2023

### Bugfix

- Added two placeholder entities to the global `EntitySchema.Entities` types.
  This avoids the automatic conversion of an empty interface to the type `never`

## [3.0.1] - 29.12.2022

### Changed

- Improved general performance of the channel communication by improving the early return method for stopping the execution

## [3.0.0] - 23.12.2022

### Added

- Added type safety to all repository methods and the general data handling.

### Breaking Changes

- Removed the `any` type as a return value from the `repository` methods

### Upgrade Guide

You can get back the original behavior by adding the `any` type to the global `Entities` interface. You can
see the guide in Getting started → Installation → Adding types for Entities (TS only) → Using "any" fallback.

An additional package with auto-generated types will be released soon.

## [2.3.0] - 27.06.2022

### Added

- Added `ui.paymentOverviewCard`

## [2.1.0] - 20.05.2022

### Added

- Added `context.getModuleInformation`
- Added `window.routerPush`

## [2.0.0] - 16.05.2022

### Changed

- Changed `data.get` to `data.subscribe`

### Added

- Added `data.get`
- Added `data.handleGet`

## [1.0.0] - 12.05.2022

### Changed

- Changed default constructor values of Criteria.

### Added

- Added `setDefaultValues` function to Criteria.
