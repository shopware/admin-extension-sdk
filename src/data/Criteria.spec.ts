import Criteria, { setDefaultValues } from "./Criteria";

describe('Test Criteria class', () => {
  it('should default to page===1 & limit===0', () => {
    const criteria = new Criteria();

    expect(criteria.getLimit()).toBe(0);
    expect(criteria.getPage()).toBe(1);
  });

  it('should respect altered default values', () => {
    setDefaultValues({limit: 42});
    const criteria = new Criteria();

    expect(criteria.getLimit()).toBe(42);
    expect(criteria.getPage()).toBe(1);
  });
});