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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const utils_1 = __importDefault(require("./utils"));
/**
 * This action will
 * 1. Read the PR body
 * 2. Get all the tasks
 * 3. Checks if all tasks are completed(checked)
 * 4. Return
 *      success if
 *          there is no pr body
 *          no tasks in pr body
 *          all tasks are completed(checked)
 *      failure if
 *          there are any pending tasks to be complated
 */
async function run() {
    var _a;
    try {
        // read the pr body for tasks
        const prBody = (_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.body;
        if (!prBody) {
            core.info("PR don't have tasks to check");
            return;
        }
        // get the status of pending tasks
        core.debug("Getting a list of uncompleted tasks: ");
        let pendingTasks = utils_1.default.getPendingTasks(prBody);
        core.debug(pendingTasks);
        let isTaskListCompleted = false;
        if (!pendingTasks) {
            isTaskListCompleted = true;
        }
        core.debug(`All tasks completed: ${isTaskListCompleted}`);
        if (isTaskListCompleted) {
            core.info(`SUCCESS: All tasks completed`);
            return;
        }
        else {
            core.setFailed(`FAILED: Some tasks are still pending! \n${pendingTasks}\nLength: ${pendingTasks.length}`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
