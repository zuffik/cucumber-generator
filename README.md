# cucumber-generator

[![Build Status](https://github.com/zuffik/cucumber-generator/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/zuffik/cucumber-generator/actions/workflows/npm-publish.yml)

Simple generator for [cucumber](https://cucumber.io) features.
There are 3 predefined template for generating spec files:

* [jest-cucumber](https://www.npmjs.com/package/jest-cucumber)
* [cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
* [cucumber](https://github.com/cucumber/cucumber-js)
 
but basicaly there can be any custom template given as parameter.
Of course you can use `jest-cucumber` templates but if you're using other library
or you have many feature files and you don't want to copy-paste the code from console
then this tool is made for you. :)

Generator will lookup for all features in given directory and generate `.spec.ts` 
files accordingly.

## Installing

Do I need to state the obvious? :smile:

```bash
yarn add -D cucumber-generator
```

or

```bash
npm install -D cucumber-generator
```

## CLI

### API

Usage: `npx cucumber-generator [parameters]`

```
Options:
  --version                 Show version number                        [boolean]
  -h, --help                Show help                                  [boolean]
  --includeDirectory        If present, the file is generated into the directory
                            with same name as feature name (within output
                            folder)                   [boolean] [default: false]
  --output                                 [required] [choices: "stdio", "file"]
  -f, --featuresDirectory                                    [string] [required]
  --templatesDirectory                                                  [string]
  --template                                 [string] [default: "jest-cucumber"]
  --relativePathToFeatures                              [string] [default: "./"]
  --maintainStructure                                  [boolean] [default: true]
  --verbose                                           [boolean] [default: false]
```

### Example

Consider this feature file

```gherkin
Feature: Car
  This feature describes how a car works
  Scenario: Unlock car
    Given keys
    Given locked car
    When person presses an unlock button
    And tries to open the door
    Then the door should open

  Scenario: Start engine
    Given unlocked car
    When person inserts key into ignition
    And turns the key
    Then car should start
```

after running `npx cucumber-generator` (with additional parameters described before) the
result will be

```typescript
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('../src/fixtures/Simple.feature');

defineFeature(feature, test => {
    test('Unlock car', ({ given, when, and, then }) => {
        given('keys', () => {
        });
        given('locked car', () => {
        });
        when('person presses an unlock button', () => {
        });
        and('tries to open the door', () => {
        });
        then('the door should open', () => {
        });
    });
    test('Start engine', ({ given, when, and, then }) => {
        given('unlocked car', () => {
        });
        when('person inserts key into ignition', () => {
        });
        and('turns the key', () => {
        });
        then('car should start', () => {
        });
    });
});
```

## As module

### API

There is `TemplateGenerator` class available with following constructor params:

* `template: string` - mandatory parameter, defines a template to generate (currently just `jest-cucumber`)
* `options`:
    * `featuresDirectory: string` - defines root for searching features
    * `outputDirectory: string` - defines where the files will be generated
    * `maintainStructure: string | undefined` - whether copy directory tree when generating spec files (default: `true`). If set to `false`, spec files will be generated all in single directory.
    * `variables: Record<string, any>` - variables passed to template file when generating
        * `relativePathToFeatures: string` - mandatory variable, defines where are feature files stored relatively to spec files (needed due to `loadFeature` function in `jest-cucumber`)
        
### Examples

```typescript
import {TemplateGenerator} from 'cucumber-generator';

const outputDirectory = './out';
const featuresDirectory = './src/test/features';
const relativePathToFeatures = '../src/test/features';

const generator = new TemplateGenerator('jest-cucumber', {
    outputDirectory,
    featuresDirectory,
    variables: {
      relativePathToFeatures,
    },
});
const result = await generator.generate();
```

## Contribution

Any help with the package is always welcome, just be sure to write and run the tests. 
