/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import assert from 'assert'
import path from 'path'
import { FileInfo } from '../../../../applicationcomposer/types'
import { addRuntimeSuffix } from '../../../../applicationcomposer/messageHandlers/fileUtils/addRuntimeSuffix'
import { createTestWorkspaceFolder, fromFile, toFile, createFolder } from '../../../testUtil'

describe('file utils', () => {
    describe('addRuntimeSuffix', function () {
        it('appends a suffix to the file path', async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            await createFolder(workSpaceFolder.uri.fsPath, 'src')
            const filePath = path.join(workSpaceFolder.uri.fsPath, 'src', 'function')

            await toFile('file-contents', filePath)
            const fileUri = vscode.Uri.file(filePath)

            const file: FileInfo = {
                path: 'src/function',
                uri: fileUri,
            }

            assert.strictEqual('file-contents', await fromFile(filePath))
            await addRuntimeSuffix(workSpaceFolder.uri.fsPath, file, 'runtime')
            assert.strictEqual('file-contents', await fromFile(filePath + '-runtime'))
        })
    })
})
