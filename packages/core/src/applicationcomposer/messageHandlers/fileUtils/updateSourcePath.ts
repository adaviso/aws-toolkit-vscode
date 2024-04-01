/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

export async function updateSourcePath(workSpacePath: string, oldSourcePath: string, newSourcePath: string) {
    if (newSourcePath !== oldSourcePath) {
        const newURI = vscode.Uri.file(path.join(workSpacePath, newSourcePath))
        const oldURI = vscode.Uri.file(path.join(workSpacePath, oldSourcePath))
        await vscode.workspace.fs.rename(oldURI, newURI, { overwrite: false })
    }
}
