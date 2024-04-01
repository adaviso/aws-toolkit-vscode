/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

import { FileInfo } from '../../types'

export async function addRuntimeSuffix(workSpacePath: string, file: FileInfo, runtime: string) {
    const newURI = vscode.Uri.file(path.join(workSpacePath, file.path + '-' + runtime))
    await vscode.workspace.fs.rename(file.uri!, newURI, { overwrite: false })
}
