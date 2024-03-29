/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import { DeleteFilesRequestMessage, DeleteFilesResponseMessage, WebviewContext, Command, MessageType } from '../types'
import path from 'path'

export async function deleteFilesMessageHandler(request: DeleteFilesRequestMessage, context: WebviewContext) {
    let deleteFilesResponseMessage: DeleteFilesResponseMessage

    try {
        for (const file of request.fileDetails) {
            const uri = vscode.Uri.file(path.join(context.workSpacePath, file.path))
            const parentFolderNames = file.path.split('/')
            const parentFolders = []
            if (parentFolderNames.length > 0) {
                parentFolders[0] = parentFolderNames[0]
            }
            for (let i = 1; i < parentFolderNames.length; i++) {
                parentFolders[i] = parentFolders[i - 1] + '/' + parentFolderNames[i]
            }

            if (
                !request.options.keepChangedFiles ||
                ((await vscode.workspace.fs.stat(uri)).mtime < (await vscode.workspace.fs.stat(uri)).ctime + 100 &&
                    String((await vscode.workspace.fs.stat(uri)).size) === file.size &&
                    !vscode.workspace.textDocuments.find(it => it.uri.path === uri.path)?.isDirty)
            ) {
                await vscode.workspace.fs.delete(uri, { recursive: true })
                for (let i = parentFolders.length - 2; i >= 0; i--) {
                    const folderUri = vscode.Uri.file(path.join(context.workSpacePath, parentFolders[i]))
                    if (
                        request.options.removeEmptyFolders &&
                        (await vscode.workspace.fs.readDirectory(folderUri)).length === 0
                    ) {
                        await vscode.workspace.fs.delete(folderUri, { recursive: false })
                    } else {
                        break
                    }
                }
            }
        }

        deleteFilesResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.DELETE_FILES,
            eventId: request.eventId,
            isSuccess: true,
            failureReason: '',
        }
    } catch (e) {
        deleteFilesResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.DELETE_FILES,
            eventId: request.eventId,
            isSuccess: false,
            failureReason: (e as Error).message,
        }
    }

    await context.panel.webview.postMessage(deleteFilesResponseMessage)
}
