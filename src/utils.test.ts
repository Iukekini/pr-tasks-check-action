import Util from "./utils";

describe("Util.getPendingTasks", () => {
  test("returns empty string when no tasks present", () => {
    const body = "No tasks in this PR";
    expect(Util.getPendingTasks(body)).toBe("");
  });

  test("returns pending required tasks", () => {
    const body = "- [ ] Required task 1\n- [ ] Required task 2";
    const expected =
      "Uncompleted Required Tasks\n- [ ] Required task 1\n- [ ] Required task 2\n";
    expect(Util.getPendingTasks(body)).toBe(expected);
  });

  test("ignores completed tasks", () => {
    const body = "- [x] Completed task\n- [ ] Required task";
    const expected = "Uncompleted Required Tasks\n- [ ] Required task\n";
    expect(Util.getPendingTasks(body)).toBe(expected);
  });

  test("ignores tasks marked as optional", () => {
    const body = "- [ ] Required task\n- [ ] Optional task (optional)";
    const expected = "Uncompleted Required Tasks\n- [ ] Required task\n";
    expect(Util.getPendingTasks(body)).toBe(expected);
  });

  test("ignores tasks in optional section", () => {
    const body =
      "- [ ] Required task\n<!--begin optional tasks-->\n- [ ] Optional task\n<!--end optional tasks-->";
    const expected = "Uncompleted Required Tasks\n- [ ] Required task\n";
    const results = Util.getPendingTasks(body);
    expect(Util.getPendingTasks(body)).toBe(expected);
  });
  test("ignores tasks in optional section multiline", () => {
    const body = `## Title
Add Action to check if tasks in comments are completed. 
Add QA Task

## Type of Change

<!--begin optional tasks-->
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Hotfix
- [ ] Security patch
- [ ] UI/UX improvement
<!--end optional tasks-->

## Checklist
- [x] My code adheres to the coding and style guidelines of the project.
- [x] I have performed a self-review of my own code.
- [x] I have commented my code, particularly in hard-to-understand areas.
- [x] I have made corresponding changes to the documentation.
- [x] My changes generate no new warnings
`;
    const expected = "";
    const results = Util.getPendingTasks(body);
    console.log(results);
    expect(Util.getPendingTasks(body)).toBe(expected);
  });
});
