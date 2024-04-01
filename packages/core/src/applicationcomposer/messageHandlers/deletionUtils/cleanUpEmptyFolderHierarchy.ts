/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

export async function cleanUpEmptyFolderHierarchy(workSpacePath: string, folderPath: string) {
    const folderUri = vscode.Uri.file(path.join(workSpacePath, folderPath))

    if ((await vscode.workspace.fs.readDirectory(folderUri)).length !== 0) {
        return
    }

    await vscode.workspace.fs.delete(folderUri, { recursive: false })
}
