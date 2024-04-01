/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'

import { cleanUpEmptyFolderHierarchy } from './cleanUpEmptyFolderHierarchy'
import { FileInfo } from '../../types'
import { isSafeToDeleteFile } from './isSafeToDeleteFile'

export async function processFileInfo(
    file: FileInfo,
    options: { keepChangedFiles: boolean; removeEmptyFolders: boolean },
    workSpacePath: string
) {
    if (!(await isSafeToDeleteFile(file, options.keepChangedFiles))) {
        return
    }

    await vscode.workspace.fs.delete(file.uri!, { recursive: true })

    if (!options.removeEmptyFolders) {
        return
    }

    for (let i = file.parentFolderList!.length - 2; i >= 0; i--) {
        await cleanUpEmptyFolderHierarchy(file.parentFolderList![i], workSpacePath)
    }
}
