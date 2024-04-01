/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'

import {
    SaveFileRequestMessage,
    SaveFileResponseMessage,
    WebviewContext,
    Command,
    MessageType,
    FileInfo,
} from '../types'
import { saveFile } from './fileUtils/saveFile'

export async function saveFileMessageHandler(request: SaveFileRequestMessage, context: WebviewContext) {
    // If filePath is empty, save contents in default template file
    const filePath =
        request.filePath === '' ? context.defaultTemplatePath : path.join(context.workSpacePath, request.filePath)

    let saveFileResponseMessage: SaveFileResponseMessage

    try {
        const file: FileInfo = {
            path: filePath,
            contents: request.fileContents,
        }

        await saveFile(context.textDocument.isDirty, file, context)

        saveFileResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.SAVE_FILE,
            eventId: request.eventId,
            filePath: filePath,
            isSuccess: true,
        }
    } catch (e) {
        saveFileResponseMessage = {
            messageType: MessageType.RESPONSE,
            command: Command.SAVE_FILE,
            eventId: request.eventId,
            filePath: filePath,
            isSuccess: false,
            failureReason: (e as Error).message,
        }
    }

    await context.panel.webview.postMessage(saveFileResponseMessage)
}
