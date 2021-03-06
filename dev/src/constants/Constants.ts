/*******************************************************************************
 * Copyright (c) 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/

import * as path from "path";

/**
 * Miscellaneous constants
 */
namespace Constants {
    export const PROJ_SETTINGS_FILE_NAME = ".cw-settings";
    export const CW_CONFIG_DIR = ".config";
    export const CW_CONFIG_FILE = path.join(CW_CONFIG_DIR, "settings.json");

    export const CHE_WORKSPACEID_ENVVAR = "CHE_WORKSPACE_ID";
    export const CHE_API_EXTERNAL_ENVVAR = "CHE_API_EXTERNAL";

    export const CW_ENV_VAR = "CW_ENV";
    export const CW_ENV_DEV = "dev";
    export const CW_ENV_TEST = "test";
    export const CW_ENV_TAG_VAR = "CW_TAG";

    export const CW_SITE_BASEURL = "https://www.eclipse.org/codewind/";
}

export default Constants;
