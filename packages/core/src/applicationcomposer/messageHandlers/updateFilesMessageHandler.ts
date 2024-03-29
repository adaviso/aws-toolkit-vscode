/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import vscode from 'vscode'
import { UpdateFilesRequestMessage, UpdateFilesResponseMessage, WebviewContext, Command, MessageType } from '../types'
import path from 'path'

export async function updateFilesMessageHandler(request: UpdateFilesRequestMessage, context: WebviewContext) {
    let updateFilesResponseMessage: UpdateFilesResponseMessage

    try {
        if (request.oldFileSettings.runtime !== request.newFileSettings.runtime) {
            for (const file of request.oldFileDetails) {
                const uri = vscode.Uri.file(path.join(context.workSpacePath, file.path))

                if (
                    (await vscode.workspace.fs.stat(uri)).mtime <= (await vscode.workspace.fs.stat(uri)).ctime + 100 &&
                    String((await vscode.workspace.fs.stat(uri)).size) === file.size &&
                    !vscode.workspace.textDocuments.find(it => it.uri.path === uri.path)?.isDirty
                ) {
                    await vscode.workspace.fs.delete(uri, { recursive: true })
                } else {
                    const newURI = vscode.Uri.file(
                        path.join(context.workSpacePath, file.path + '-' + request.oldFileSettings.runtime)
                    )
                    await vscode.workspace.fs.rename(uri, newURI, { overwrite: false })
                }
            }

            for (const file of request.newFileDetails) {
                const fullPath = path.join(context.workSpacePath, file.path)
                context.fileWatches[fullPath] = { fileContents: file.contents }

                const uri = vscode.Uri.file(fullPath)
                const contents = Buffer.from(file.contents, 'utf8')
                await vscode.workspace.fs.writeFile(uri, contents)
            }
        }

        const newSourcePath = request.newFileSettings.sourcePath
        const oldSourcePath = request.oldFileSettings.sourcePath

        if (newSourcePath !== oldSourcePath) {
            const newURI = vscode.Uri.file(path.join(context.workSpacePath, newSourcePath))
            const oldURI = vscode.Uri.file(path.join(context.workSpacePath, oldSourcePath))
            await vscode.workspace.fs.rename(oldURI, newURI, { overwrite: false })
        }

        updateFilesResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.UPDATE_FILES,
            eventId: request.eventId,
            isSuccess: true,
            failureReason: '',
        }
    } catch (e) {
        updateFilesResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.UPDATE_FILES,
            eventId: request.eventId,
            isSuccess: false,
            failureReason: (e as Error).message,
        }
    }

    await context.panel.webview.postMessage(updateFilesResponseMessage)
}
