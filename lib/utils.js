"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
class Util {
    /**
     * This method reads the input string and matches unchecked tasks ([ ]),
     * identifying optional tasks through comments.
     *
     * @param body PR body that has tasks
     * @returns empty string if there are no pending required tasks,
     *          otherwise returns pending required tasks as a string
     */
    static getPendingTasks(body) {
        let responseString = "";
        try {
            core.debug(`PR Body: ${body}`);
            // Split the body into sections to handle group optional comments
            const sections = body.split(/^##\s+/m);
            const pendingTasks = [];
            let isInOptionalSection = false;
            sections.forEach((section) => {
                core.debug(`Processing section: ${section}`);
                // Check for optional comment markers
                const lines = section.split("\n");
                lines.forEach((line, index) => {
                    // Check for optional section comments
                    if (line.trim() === "<!--begin optional tasks-->") {
                        core.debug(`Entering optional section at line ${index + 1}`);
                        isInOptionalSection = true;
                    }
                    if (line.trim() === "<!--end optional tasks-->") {
                        core.debug(`Exiting optional section at line ${index + 1}`);
                        isInOptionalSection = false;
                    }
                    // Check for uncompleted task
                    if (line.match(/^- \[[ ]\].+/)) {
                        // Skip if task is in optional section or marked individually as optional
                        const isTaskOptional = isInOptionalSection || line.toLowerCase().includes("(optional)");
                        core.debug(`Task found: ${line.trim()} (Optional: ${isTaskOptional})`);
                        if (!isTaskOptional) {
                            pendingTasks.push(line);
                        }
                    }
                });
            });
            if (pendingTasks.length > 0) {
                responseString = "Uncompleted Required Tasks\n";
                pendingTasks.forEach((task) => {
                    responseString += `${task}\n`;
                });
            }
        }
        catch (e) {
            responseString = "";
        }
        return responseString;
    }
}
exports.default = Util;
