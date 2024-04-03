/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import sinon from 'sinon'
import assert from 'assert'
import { cleanUpEmptyFolderHierarchy } from '../../../../applicationcomposer/messageHandlers/fileUtils/cleanUpEmptyFolderHierarchy'
import { createTestWorkspace } from '../../../testUtil'

describe.only('file utils', () => {
    describe('cleanUpEmptyFolderHierarchy', function () {
        const sandbox = sinon.createSandbox()

        afterEach(function () {
            sandbox.restore()
        })

        it("doesn't clean up if the parent folder is the workspace folder", async function () {
            // TODO: workspace folder should be empty
            const workspaceFolder = {
                fileAmount: 1,
                fileNamePrefix: 'function',
                workspaceName: 'src',
            } satisfies Parameters<typeof createTestWorkspace>[1] & { fileAmount: number }

            const workspace: vscode.WorkspaceFolder = await createTestWorkspace(
                workspaceFolder.fileAmount,
                workspaceFolder
            )

            sandbox.stub(vscode.workspace, 'workspaceFolders').value(workspace)
            const parentFolderList = [workspaceFolder.fileNamePrefix]

            vscode.workspace.createFileSystemWatcher(workspace.uri.fsPath).onDidDelete(() => {
                assert.strictEqual(true, false)
            })

            await cleanUpEmptyFolderHierarchy(workspace.uri.fsPath, parentFolderList)
        })

        it('cleans up an empty parent folder', async function () {})

        it('cleans up a hierarchy of empty parent folders', async function () {})

        it("doesn't clean up a parent folder that has contents", async function () {})

        it('cleans up empty parent folders, but not folders with contents above that', async function () {})
    })
})
