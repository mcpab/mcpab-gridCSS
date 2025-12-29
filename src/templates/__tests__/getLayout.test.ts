import { getLayoutFromCatalog } from "../layoutsCatalog";

 
describe("getLayoutFromCatalog", () => {
  test("returns a deep copy (mutations do not affect catalog)", () => {
    // pick a real entry
    const a = getLayoutFromCatalog("primary20", "page_dashboard_kpis_then_content");
    const b = getLayoutFromCatalog("primary20", "page_dashboard_kpis_then_content");

    // not the same reference
    expect(a).not.toBe(b);

    // mutate the returned copy
    a.main.block_1.spanX = 999;

    // fetch again: should be unchanged
    const c = getLayoutFromCatalog("primary20", "page_dashboard_kpis_then_content");
    expect(c.main.block_1.spanX).not.toBe(999);

 
  });
});
