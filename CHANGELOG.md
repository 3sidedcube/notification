# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-beta.5](https://github.com/chelsea-apps/notification/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2022-08-10)


### Bug Fixes

* **push:** Fix incorrect APNS and FCM logic ([1aa0109](https://github.com/chelsea-apps/notification/commit/1aa0109fd441a61c40a81170b4723bf61bbc62e3))

## [3.0.0-beta.4](https://github.com/chelsea-apps/notification/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2022-08-10)


### ⚠ BREAKING CHANGES

* **push:** Only allow flat payloads to maintain compatibility between APNS and FCM

### Features

* **push:** Add support for subtitles in FCM, with customisable options ([f347347](https://github.com/chelsea-apps/notification/commit/f347347f903c4a9538ac26fb8cd4e1ecafcef11f))
* **push:** Only allow flat payloads to maintain compatibility between APNS and FCM ([6ee7851](https://github.com/chelsea-apps/notification/commit/6ee785146c5d678641bf50ff10a592a4c883f779))


### Bug Fixes

* **push:** Format FCM private key before using ([1e64883](https://github.com/chelsea-apps/notification/commit/1e6488358f7ad2d28f41bda2f974420e57010f18))

## [3.0.0-beta.3](https://github.com/chelsea-apps/notification/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2022-08-10)


### Features

* **push:** Make FCM and APNS configurations optional ([eefae0d](https://github.com/chelsea-apps/notification/commit/eefae0d2825f37246c5478d93d143c2a3cc2bea9))

## [3.0.0-beta.2](https://github.com/chelsea-apps/notification/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2022-08-10)


### Bug Fixes

* **push:** Export device token interface ([c9cd758](https://github.com/chelsea-apps/notification/commit/c9cd758bb88b049afcb9cd2cbcea21b862d92a70))

## [3.0.0-beta.1](https://github.com/chelsea-apps/notification/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2022-08-10)


### Bug Fixes

* **push:** Replace list of device token strings with type objects ([e5ab804](https://github.com/chelsea-apps/notification/commit/e5ab8049e8bde65fa58d0a3c8d206e03c8529449))

## [3.0.0-beta.0](https://github.com/chelsea-apps/notification/compare/v2.3.0...v3.0.0-beta.0) (2022-08-10)


### ⚠ BREAKING CHANGES

* **push:** Add support for FCM and APNS push notifications

### Features

* **push:** Add support for FCM and APNS push notifications ([17bece3](https://github.com/chelsea-apps/notification/commit/17bece35ef81509425938f4eb9b4576d7d25a655))

## [2.3.0](https://github.com/chelsea-apps/notification/compare/v2.2.1...v2.3.0) (2022-07-27)

## [2.3.0-beta.0](https://github.com/chelsea-apps/notification/compare/v2.2.1...v2.3.0-beta.0) (2022-07-27)


### Features

* **email:** Add reply to field to emails ([ba9cd12](https://github.com/chelsea-apps/notification/commit/ba9cd12cbec5410b42360928edde2cc6c3307211))

### [2.2.1](https://github.com/chelsea-apps/notification/compare/v2.2.0...v2.2.1) (2022-04-04)


### Bug Fixes

* Fix error when custom config is not supplied ([76b27d5](https://github.com/chelsea-apps/notification/commit/76b27d5df062ae426092b5f994ceaa051e743975))

## [2.2.0](https://github.com/chelsea-apps/notification/compare/v2.1.0-1...v2.2.0) (2022-04-04)


### Features

* Add custom notification handlers for increased extensibility ([4919a19](https://github.com/chelsea-apps/notification/commit/4919a19f0e9cdfcca17c58e6042ab3826c62bdb5))

## [2.2.0-beta.3](https://github.com/chelsea-apps/notification/compare/v2.2.0-beta.2...v2.2.0-beta.3) (2022-03-31)


### Features

* Pass users to deliver custom notifications to ([41f60de](https://github.com/chelsea-apps/notification/commit/41f60de84d3a0061c49cabe30d28354368a1b4b4))

## [2.2.0-beta.2](https://github.com/chelsea-apps/notification/compare/v2.2.0-beta.1...v2.2.0-beta.2) (2022-03-31)


### Bug Fixes

* Fix handler selection logic ([97a08b1](https://github.com/chelsea-apps/notification/commit/97a08b1b73cda18b25ba542a86ff62ac8bb02a52))

## [2.2.0-beta.1](https://github.com/chelsea-apps/notification/compare/v2.2.0-beta.0...v2.2.0-beta.1) (2022-03-31)

## [2.2.0-beta.0](https://github.com/chelsea-apps/notification/compare/v2.1.0-1...v2.2.0-beta.0) (2022-03-31)


### Features

* Add preliminary support for custom handlers ([982ca19](https://github.com/chelsea-apps/notification/commit/982ca191f95293007df446fcade88a8156885bd6))
