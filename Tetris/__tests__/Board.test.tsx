import { render } from "@testing-library/react";
import React from "react";
import Board from '../src/components/Board';


/*
1. Board rendered correct amount of spaces 
boardshape = num of 

2. Board 

*/

describe('Board', () => {
    it("Board rendered the correct amount of cells or spaces", () => {
        const {getByTestId} = render(<Board currentBoard = {Array(20)
        .fill(null)
        .map(() => Array(10).fill(null))} />)
        const emptyBoard = Array(20)
        .fill(null)
        .map(() => Array(10).fill(null));
        const testValue = getByTestId("board");

        // const renderedBoard = render(<Board currentBoard = {Array(20)
        //     .fill(null)
        //     .map(() => Array(10).fill(null))} />)
        // const emptyBoard = Array(20)
        //     .fill(null)
        //     .map(() => Array(10).fill(null));

        expect(testValue).toHaveLength(emptyBoard.length);
    });
});
