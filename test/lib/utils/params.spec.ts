import {
  getRemainingFlags,
  formatMapForFlags,
} from '../../../lib/utils/params';

describe('lib/utils/params', () => {
  describe('getRemainingFlags', () => {
    const cmd = {
      rawArgs: [
        'usr/lib',
        'usr/lib/bin/source-reader',
        'tree',
        '-l',
        '2',
        '--ignore',
        'node_modules,test',
      ],
    };
    it('should splice content after cmd', () => {
      expect(getRemainingFlags(cmd as any, 'tree')).toEqual([
        '-l',
        '2',
        '--ignore',
        'node_modules,test',
      ]);
    });
  });
  describe('formatMapForFlags', () => {
    it('should splice content after cmd', () => {
      expect(
        formatMapForFlags(['-l', '2', '--ignore', 'node_modules,test']),
      ).toEqual({
        l: '2',
        ignore: 'node_modules,test',
      });
    });
  });
});
