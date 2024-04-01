/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import vscode from 'vscode'

import { FileInfo, FileOptions } from '../../types'
import { getParentFolders } from './getParentFolders'
import { processFileInfo } from './processFileInfo'

export async function processFileInfoList(fileInfoList: FileInfo[], options: FileOptions, workSpacePath: string) {
    for (const file of fileInfoList) {
        file.uri = vscode.Uri.file(path.join(workSpacePath, file.path))
        file.parentFolderList = await getParentFolders(file.path)

        await processFileInfo(file, options, workSpacePath)
    }
}
