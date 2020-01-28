/*******************************************************************************
 * Copyright (c) 2018, 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/

import Resources from "../../constants/Resources";
// import Log from "../../Logger";

export class ProjectType {

    public readonly type: ProjectType.Types;
    // public readonly userFriendlyType: string;
    public readonly debugType: ProjectType.DebugTypes | undefined;

    public readonly icon: Resources.Icons;

    constructor(
        public readonly internalType: ProjectType.InternalTypes,
        public readonly language: string,
        extensionName?: string,
    ) {
        this.type = ProjectType.getType(internalType, extensionName);
        // this.userFriendlyType = ProjectType.getUserFriendlyType(this.type);
        this.debugType = ProjectType.getDebugType(this.type, language);
        this.icon = ProjectType.getProjectIcon(this.type, language);
    }

    public toString(): string {
        // if (this.extensionName) {
        //     let ufExtension = this.extensionName.toLowerCase();
        //     if (ufExtension.endsWith("extension")) {
        //         ufExtension = ufExtension.substring(0, ufExtension.length - "extension".length);
        //     }
        //     return MCUtil.uppercaseFirstChar(ufExtension);
        // }
        return this.type.toString();
    }

    private static getType(internalType: string, extensionName: string | undefined): ProjectType.Types {
        if (internalType === this.InternalTypes.MICROPROFILE) {
            return ProjectType.Types.MICROPROFILE;
        }
        else if (internalType === this.InternalTypes.SPRING) {
            return ProjectType.Types.SPRING;
        }
        else if (internalType === this.InternalTypes.NODE) {
            return ProjectType.Types.NODE;
        }
        else if (internalType === this.InternalTypes.SWIFT) {
            return ProjectType.Types.SWIFT;
        }
        else if (internalType === this.InternalTypes.DOCKER) {
            return ProjectType.Types.GENERIC_DOCKER;
        }
        else if (extensionName === this.InternalTypes.EXTENSION_APPSODY) {
            return ProjectType.Types.EXTENSION_APPSODY;
        }
        else if (extensionName === this.InternalTypes.EXTENSION_ODO) {
            return ProjectType.Types.EXTENSION_ODO;
        }
        else {
            // Log.e(`Unrecognized project type ${interalType}`);
            return ProjectType.Types.UNKNOWN;
        }
    }

    /**
     * Get the corresponding VSCode debug configuration "type" value.
     * Returns undefined if we don't have any project types that use the language and support debug.
     */
    private static getDebugType(type: ProjectType.Types, language: string): ProjectType.DebugTypes | undefined {
        switch (type) {
            case ProjectType.Types.MICROPROFILE:
            case ProjectType.Types.SPRING:
                return this.DebugTypes.JAVA;
            case ProjectType.Types.NODE:
                return this.DebugTypes.NODE;
            case ProjectType.Types.EXTENSION_APPSODY:
                // For extension types, we use the language to determine debug type
                const lang = language.toLowerCase();
                if (lang === this.Languages.JAVA) {
                    return this.DebugTypes.JAVA;
                }
                else if (lang === this.Languages.NODE || lang === this.Languages.JAVASCRIPT) {
                    return this.DebugTypes.NODE;
                }
            default:
                return undefined;
        }
    }

    private static getProjectIcon(type: ProjectType.Types, language: string): Resources.Icons {
        switch (language.toLowerCase()) {
            case this.Languages.JAVA:
                if (type === ProjectType.Types.MICROPROFILE) {
                    return Resources.Icons.Microprofile;
                }
                else if (type === ProjectType.Types.SPRING) {
                    return Resources.Icons.Spring;
                }
                else {
                    return Resources.Icons.Java;
                }
            case this.Languages.NODE:
            case this.Languages.JAVASCRIPT:
                return Resources.Icons.NodeJS;
            case this.Languages.SWIFT:
                return Resources.Icons.Swift;
            case this.Languages.PYTHON:
                return Resources.Icons.Python;
            case this.Languages.GO:
                return Resources.Icons.Go;
            default:
                return Resources.Icons.Generic;
        }
    }

    public get canInjectMetrics(): boolean {
        // This should be the job of the capabilities API
        return [
            ProjectType.InternalTypes.MICROPROFILE,
            ProjectType.InternalTypes.NODE,
            ProjectType.InternalTypes.SPRING
        ].includes(this.internalType) ||
            ([ProjectType.InternalTypes.DOCKER].includes(this.internalType) &&
            [ProjectType.Languages.JAVA].map((lang) => lang.toString().toLowerCase())
            .includes(this.language.toLowerCase())
        );
    }

    public get alwaysHasAppMonitor(): boolean {
        // This should be the job of the capabilities API
        return [
            ProjectType.Languages.JAVA,
            ProjectType.Languages.NODE,
            ProjectType.Languages.JAVASCRIPT,
        ]
        .map((lang) => lang.toString().toLowerCase())
        .includes(this.language.toLowerCase());
    }

    public get isAppsody(): boolean {
        return this.type === ProjectType.Types.EXTENSION_APPSODY;
    }

    public get isExtensionType(): boolean {
        return [
            ProjectType.Types.EXTENSION_APPSODY,
            ProjectType.Types.EXTENSION_ODO,
        ].includes(this.type);
    }

    /**
     * Whether or not this project type requires a delay between receiving the 'restart succeeded' event and attaching the debugger
     */
    public get requiresDebugDelay(): boolean {
        return this.type === ProjectType.Types.MICROPROFILE;
    }
}

export namespace ProjectType {

    /*
     * These are the project types as exposed to the user. String value must be user-friendly.
     */
    export enum Types {
        MICROPROFILE = "Microprofile",
        SPRING = "Spring",
        NODE = "Node.js",
        SWIFT = "Swift",
        GENERIC_DOCKER = "Docker",
        EXTENSION_APPSODY = "Appsody",
        EXTENSION_ODO = "OpenShift Do",
        UNKNOWN = "Unknown"
    }

    // non-nls-section-start

    /**
     * Possible values of the "projectType" or "buildType" internal attribute
     */
    export enum InternalTypes {
        MICROPROFILE = "liberty",
        SPRING = "spring",
        NODE = "nodejs",
        SWIFT = "swift",
        DOCKER = "docker",
        EXTENSION_APPSODY = "appsodyExtension",
        EXTENSION_ODO = "odoExtension",
    }

    /**
     * Some possible values of the "language" internal attribute, for which we have special treatment such as nicer icons.
     * Language can be user-determined so this is not a complete list
     */
    export enum Languages {
        JAVA = "java",
        NODE = "nodejs",
        JAVASCRIPT = "javascript",
        SWIFT = "swift",
        PYTHON = "python",
        GO = "go"
    }

    /**
     * VSCode debug types, used as the "type" attribute in a debug launch.
     */
    export enum DebugTypes {
        JAVA = "java",
        NODE = "node"
    }

    // non-nls-section-end
}

export interface IProjectSubtype {
    id: string;
    version?: string;
    label: string;
    description?: string;
}

export interface IProjectSubtypesDescriptor {
    label?: string;
    items: IProjectSubtype[];
}

export interface IProjectTypeDescriptor {
    projectType: string;
    projectSubtypes: IProjectSubtypesDescriptor;
}

export default ProjectType;
