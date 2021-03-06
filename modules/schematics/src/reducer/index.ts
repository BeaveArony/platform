import { normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import * as stringUtils from '../strings';
import { findModuleFromOptions } from '../utility/find-module';
import { Schema as ReducerOptions } from './schema';
import {
  addReducerToStateInferface,
  addReducerToActionReducerMap,
  addReducerToState,
  addReducerImportToNgModule,
} from '../utility/ngrx-utils';
import { getProjectPath } from '../utility/project';

export default function(options: ReducerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
      template({
        ...stringUtils,
        'if-flat': (s: string) =>
          stringUtils.group(
            options.flat ? '' : s,
            options.group ? 'reducers' : ''
          ),
        ...(options as object),
        dot: () => '.',
      } as any),
    ]);

    return chain([
      branchAndMerge(
        chain([
          filter(path => !path.includes('node_modules')),
          addReducerToState(options),
        ])
      ),
      branchAndMerge(
        chain([
          filter(
            path =>
              path.endsWith('.module.ts') &&
              !path.endsWith('-routing.module.ts')
          ),
          addReducerImportToNgModule(options),
          mergeWith(templateSource),
        ])
      ),
    ])(host, context);
  };
}
