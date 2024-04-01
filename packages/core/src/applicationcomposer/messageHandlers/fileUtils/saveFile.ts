/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

import { FileInfo, WebviewContext } from '../../types'
import { fsCommon } from '../../../srcShared/fs'

export async function saveFile(hasFileUnsavedChanges: boolean, file: FileInfo, context: WebviewContext) {
    if (hasFileUnsavedChanges) {
        // TODO: If the template file is dirty, do we pop out a warning window?
        throw new Error(`Cannot save latest contents in ${path.basename(file.path)}`)
    }

    const bufferContents = Buffer.from(file.contents!, 'utf8')

    context.fileWatches[file.path] = { fileContents: file.contents! }

    const uri = vscode.Uri.file(file.path)
    if (!(await fsCommon.existsFile(uri)) || bufferContents !== (await vscode.workspace.fs.readFile(uri))) {
        await vscode.workspace.fs.writeFile(uri, bufferContents)
    }
}
