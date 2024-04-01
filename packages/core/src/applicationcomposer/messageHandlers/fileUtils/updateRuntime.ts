/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'

import { FileInfo, WebviewContext } from '../../types'
import { processFileInfoList } from './processFileInfoList'
import { saveFile } from './saveFile'

export async function updateRuntime(
    workSpacePath: string,
    oldRuntime: string,
    newRuntime: string,
    oldFileInfoList: FileInfo[],
    newFileInfoList: FileInfo[],
    context: WebviewContext
) {
    if (oldRuntime === newRuntime) {
        return
    }

    await processFileInfoList(
        oldFileInfoList,
        { keepChangedFiles: true, removeEmptyFolders: true, addRuntimeSuffix: false, runtime: oldRuntime },
        workSpacePath
    )

    for (const file of newFileInfoList) {
        const hasFileUnsavedChanges = vscode.workspace.textDocuments.find(it => it.uri.path === file.uri!.path)?.isDirty
        await saveFile(hasFileUnsavedChanges!, file, context)
    }
}
