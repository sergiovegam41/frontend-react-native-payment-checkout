describe('Basic test setup', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    expect('hello world').toContain('world');
  });
});