/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export async function getParentFolders(path: string) {
    const parentFolderNames = path.split('/')
    const parentFolders = []

    if (parentFolderNames.length > 0) {
        parentFolders[0] = parentFolderNames[0]
    }

    for (let i = 1; i < parentFolderNames.length; i++) {
        parentFolders[i] = parentFolders[i - 1] + '/' + parentFolderNames[i]
    }

    return parentFolders
}
