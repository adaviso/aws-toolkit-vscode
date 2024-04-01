/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UpdateFilesRequestMessage, UpdateFilesResponseMessage, WebviewContext, Command, MessageType } from '../types'
import { updateRuntime } from './fileUtils/updateRuntime'
import { updateSourcePath } from './fileUtils/updateSourcePath'

export async function updateFilesMessageHandler(request: UpdateFilesRequestMessage, context: WebviewContext) {
    let updateFilesResponseMessage: UpdateFilesResponseMessage

    try {
        await updateRuntime(
            context.workSpacePath,
            request.oldFileSettings.runtime,
            request.newFileSettings.runtime,
            request.oldFileInfoList,
            request.newFileInfoList,
            context
        )

        await updateSourcePath(
            context.workSpacePath,
            request.oldFileSettings.sourcePath,
            request.newFileSettings.sourcePath
        )

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
