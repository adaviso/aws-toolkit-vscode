/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteFilesRequestMessage, DeleteFilesResponseMessage, WebviewContext, Command, MessageType } from '../types'
import { processFileInfoList } from './deletionUtils/processFileInfoList'

export async function deleteFilesMessageHandler(request: DeleteFilesRequestMessage, context: WebviewContext) {
    let deleteFilesResponseMessage: DeleteFilesResponseMessage

    try {
        await processFileInfoList(request.fileInfoList, request.options, context.workSpacePath)

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
