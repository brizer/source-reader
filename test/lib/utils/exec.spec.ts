import {
    isBinExists
  } from '../../../lib/utils/env';
  
  describe('lib/utils/exec', () => {
    describe('isBinExists', () => {
      it('if bin exists should return info',async () => {
        expect(
          await isBinExists('jest'),
        ).toMatch(/jest/);
      });
      it('if bin not exists should return false',async () => {
        expect(
          await isBinExists('jest2'),
        ).toBeFalsy();
      });
    });
  });
  