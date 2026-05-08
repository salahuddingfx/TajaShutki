import { describe, it, expect } from 'vitest';

describe('API Base Configuration', () => {
  it('has VITE_API_BASE_URL defined or defaults', () => {
    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/tajashutki';
    expect(url).toBeTruthy();
    expect(url).toContain('http');
  });
});
