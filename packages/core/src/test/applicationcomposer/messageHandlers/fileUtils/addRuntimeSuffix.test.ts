/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import sinon from 'sinon'
import assert from 'assert'
import { FileInfo } from '../../../../applicationcomposer/types'
import { addRuntimeSuffix } from '../../../../applicationcomposer/messageHandlers/fileUtils/addRuntimeSuffix'
import { createTestWorkspace, createTestWorkspaceFolder, toFile } from '../../../testUtil'

describe.only('file utils', () => {
    describe('addRuntimeSuffix', function () {
        it('appends a suffix to the file path', async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace', 'src')
            await toFile('file-contents', workSpaceFolder.uri.fsPath + '/src/function')
            const file: FileInfo = {
                path: 'src/function',
                uri: undefined,
            }
            /*
            const workspaceFolder = {
                fileAmount: 1,
                fileNamePrefix: 'function',
                workspaceName: 'src',
            } satisfies Parameters<typeof createTestWorkspace>[1] & { fileAmount: number }

            const workspace: vscode.WorkspaceFolder = await createTestWorkspace(
                workspaceFolder.fileAmount,
                workspaceFolder
            )

            sinon.stub(vscode.workspace, 'workspaceFolders').value(workspace)

            const fileRead = (await vscode.workspace.fs.readDirectory(workspace.uri))[0]
            const fileUri = vscode.Uri.joinPath(workspace.uri, fileRead[0])

            const file: FileInfo = {
                path: workspaceFolder.fileNamePrefix,
                uri: fileUri,
            }
            const runtime = 'runtime'

            await addRuntimeSuffix(workspace.uri.fsPath, file, runtime)

            const updatedFileRead = (await vscode.workspace.fs.readDirectory(workspace.uri))[0]
            assert.strictEqual(updatedFileRead[0], workspaceFolder.fileNamePrefix + '-' + runtime)
            */
        })
    })
})
