/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// import vscode from 'vscode'
import sinon from 'sinon'
import assert from 'assert'
import { cleanUpEmptyFolderHierarchy } from '../../../../applicationcomposer/messageHandlers/fileUtils/cleanUpEmptyFolderHierarchy'
import { createFolder, createTestWorkspaceFolder, doesFolderExist, toFile } from '../../../testUtil'
import path from 'path'

describe('file utils', () => {
    describe('cleanUpEmptyFolderHierarchy', function () {
        const sandbox = sinon.createSandbox()

        afterEach(function () {
            sandbox.restore()
        })

        it("doesn't clean up if the parent folder is the workspace folder", async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            await cleanUpEmptyFolderHierarchy(workSpaceFolder.uri.fsPath, [])
            assert.strictEqual(true, doesFolderExist(workSpaceFolder.uri.fsPath))
        })

        it('cleans up an empty parent folder', async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            await createFolder(workSpaceFolder.uri.fsPath, 'empty-folder')

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-folder')))

            await cleanUpEmptyFolderHierarchy(workSpaceFolder.uri.fsPath, ['empty-folder'])

            assert.strictEqual(false, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-folder')))
        })

        it('cleans up a hierarchy of empty parent folders', async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            await createFolder(workSpaceFolder.uri.fsPath, 'empty-src/empty-parent')

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-src')))
            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-src/empty-parent')))

            await cleanUpEmptyFolderHierarchy(workSpaceFolder.uri.fsPath, ['empty-src', 'empty-src/empty-parent'])

            assert.strictEqual(false, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-src')))
            assert.strictEqual(false, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'empty-src/empty-parent')))
        })

        it("doesn't clean up a parent folder that has contents", async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            const filePath = path.join(workSpaceFolder.uri.fsPath, 'src', 'function')

            const fileContents = 'file-contents'
            await toFile(fileContents, filePath)

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src')))

            await cleanUpEmptyFolderHierarchy(workSpaceFolder.uri.fsPath, ['src'])

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src')))
        })

        it('cleans up empty parent folders, but not folders with contents above that', async function () {
            const workSpaceFolder = await createTestWorkspaceFolder('my-workspace')
            const filePath = path.join(workSpaceFolder.uri.fsPath, 'src', 'function')

            const fileContents = 'file-contents'
            await toFile(fileContents, filePath)

            await createFolder(workSpaceFolder.uri.fsPath, 'src', 'empty-parent')

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src')))
            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src', 'empty-parent')))

            await cleanUpEmptyFolderHierarchy(workSpaceFolder.uri.fsPath, ['src', 'src/empty-parent'])

            assert.strictEqual(true, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src')))
            assert.strictEqual(false, doesFolderExist(path.join(workSpaceFolder.uri.fsPath, 'src', 'empty-parent')))
        })
    })
})
