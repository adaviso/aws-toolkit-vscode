/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

export async function cleanUpEmptyFolderHierarchy(workSpacePath: string, parentFolderList: string[]) {
    for (let i = parentFolderList.length - 1; i >= 0; i--) {
        const folderUri = vscode.Uri.file(path.join(workSpacePath, parentFolderList[i]))

        if ((await vscode.workspace.fs.readDirectory(folderUri)).length !== 0) {
            return
        }

        await vscode.workspace.fs.delete(folderUri, { recursive: false, useTrash: true })
    }
}
