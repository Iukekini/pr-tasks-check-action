export default class Util {
  /**
   * This method reads the input string and matches unchecked tasks ([ ]),
   * identifying optional tasks through comments.
   *
   * @param body PR body that has tasks
   * @returns empty string if there are no pending required tasks,
   *          otherwise returns pending required tasks as a string
   */
  static getPendingTasks(body: string): string {
    let responseString = "";
    try {
      // Split the body into sections to handle group optional comments
      const sections = body.split(/^##\s+/m);
      const pendingTasks: string[] = [];

      let isInOptionalSection = false;

      sections.forEach((section) => {
        // Check for optional comment markers
        const lines = section.split("\n");

        lines.forEach((line, index) => {
          // Check for optional section comments
          if (line.trim() === "<!--begin  optional tasks-->") {
            isInOptionalSection = true;
          }
          if (line.trim() === "<!--end optional tasks-->") {
            isInOptionalSection = false;
          }

          // Check for uncompleted task
          if (line.match(/^- \[[ ]\].+/)) {
            // Skip if task is in optional section or marked individually as optional
            const isTaskOptional =
              isInOptionalSection || line.toLowerCase().includes("(optional)");

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
    } catch (e) {
      responseString = "";
    }

    return responseString;
  }
}
