/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import { FileInfo } from '../../types'

export async function isSafeToDeleteFile(file: FileInfo, keepChangedFiles: boolean) {
    if (!keepChangedFiles) {
        return true
    }

    const fileSavedAfterCreation =
        (await vscode.workspace.fs.stat(file.uri!)).ctime + 100 < (await vscode.workspace.fs.stat(file.uri!)).mtime

    const hasFileCorrectSize = String((await vscode.workspace.fs.stat(file.uri!)).size) === file.size

    const hasFileUnsavedChanges = vscode.workspace.textDocuments.find(it => it.uri.path === file.uri!.path)?.isDirty

    return !fileSavedAfterCreation && hasFileCorrectSize && !hasFileUnsavedChanges
}
