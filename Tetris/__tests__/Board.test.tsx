import { render } from "@testing-library/react";
import React from "react";
import Board from '../src/components/Board';
import { getEmptyBoard } from '../src/hooks/useTetrisBoard';

/*
1. Board rendered correct amount of spaces 
boardshape = num of 

2. Board 
*/

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
