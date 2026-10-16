import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const level of ['tutorial', 'winter', 'spring', 'autumn', 'secret']) {
  test(`${level} keeps the original drift effect crops for all diagonal directions`, async () => {
    const source = await readFile(new URL(`../levels/${level}-level.js`, import.meta.url), 'utf8');
    const expected = {
      upRight: { x: 800, y: 0, rotate: Math.PI },
      downLeft: { x: 800, y: 0, rotate: 0 },
      upLeft: { x: 64, y: 480, rotate: 0 },
      downRight: { x: 64, y: 480, rotate: Math.PI }
    };
    for (const [direction, crop] of Object.entries(expected)) {
      const matches = [...source.matchAll(new RegExp(`^\\s*${direction}:\\s*\\{([^\\n]+)\\}`, 'gm'))];
      assert.ok(matches.length >= 2, 'both colors have direction settings');
      for (const match of matches) {
        const row = Number(match[1].match(/row:\s*([\d.]+)/)[1]);
        const start = Number(match[1].match(/start:\s*([\d.]+)/)[1]);
        const rotate = /rotate: Math.PI/.test(match[1]) ? Math.PI : 0;
        assert.equal(start * 320, crop.x);
        assert.equal(row * 320, crop.y);
        assert.equal(rotate, crop.rotate);
        assert.ok(crop.x + 320 <= 1536 && crop.y + 320 <= 1024);
        assert.ok(!/columns:\s*[2-9]/.test(match[1]), 'do not animate into neighboring artwork');
      }
    }
  });
}
