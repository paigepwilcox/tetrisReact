import { getEmptyBoard } from '../src/hooks/useTetrisBoard';

describe('Board', () => {
    it("Board rendered the correct amount of cells or spaces", () => {
        const testValue = getEmptyBoard();
        const emptyBoard = Array(20)
            .fill(null)
            .map(() => Array(10).fill("Empty"));
        
        expect(testValue).toHaveLength(emptyBoard.length);
    });

    it("Board rendered the correct board object", () => {
        const testValue = getEmptyBoard();
        const emptyBoard = Array(20)
            .fill(null)
            .map(() => Array(10).fill("Empty"));
        
        expect(testValue).toMatchObject(emptyBoard);
    })
});
