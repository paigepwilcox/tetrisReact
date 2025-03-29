import { useCallback, useEffect, useState } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types';
import { useInterval } from "./useInterval";
import { 
    useTetrisBoard, 
    hasCollisions,
    getRandomBlock,
    } from "./useTetrisBoard";


enum TickSpeed {
    Normal = 800,
    Sliding = 100,
    Fast = 50,
}

export function useTetris() {
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ tickSpeed, setTickSpeed ] = useState<TickSpeed | null>(null);
    const [ isCommitting, setIsCommitting ] = useState(false);
    const [ upcomingBlocks, setUpcomingBlocks ] = useState<Block[]>([]);

    const [
        { board, droppingRow, droppingColumn, droppingBlock, droppingShape } , dispatchBoardState,
    ] = useTetrisBoard();

    const startGame = useCallback(() => {
        setIsPlaying(true);
        setTickSpeed(TickSpeed.Normal);
        dispatchBoardState({ type: 'start' });
    }, [dispatchBoardState]);

    const commitPosition = useCallback(() => {
        if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
            setIsCommitting(false);
            setTickSpeed(TickSpeed.Normal);
            return;
        }

        const newBoard = structuredClone(board) as BoardShape;
        addShapeToBoard(
            newBoard,
            droppingBlock,
            droppingShape,
            droppingRow,
            droppingColumn
        );

        const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
        const newBlock = newUpcomingBlocks.pop() as Block;
        newUpcomingBlocks.unshift(getRandomBlock());

        setTickSpeed(TickSpeed.Normal);
        dispatchBoardState({ type: 'commit', newBoard });
        setIsCommitting(false);
    }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape, upcomingBlocks]);

    const gameTick = useCallback(() => {
        if (isCommitting) {
            commitPosition();
        } else if (
            hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
        ) {
            setTickSpeed(TickSpeed.Sliding);
            setIsCommitting(true);
        } else {
            dispatchBoardState({ type: 'drop' });
        }
    }, [board, commitPosition, dispatchBoardState, droppingColumn, droppingRow, droppingShape, isCommitting])

    useInterval(() => {
        if (!isPlaying) {
            return;
        }
        gameTick();
    }, tickSpeed);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        let isPressingLeft = false;
        let isPressingRight = false;
        let moveIntervalID: ReturnType<typeof setInterval> | undefined;

        const updateMovementInterval = () => {
            clearInterval(moveIntervalID);
            dispatchBoardState({
                type: 'move',
                isPressingLeft,
                isPressingRight,
            });
            moveIntervalID = setInterval(() => {
                dispatchBoardState({
                    type: 'move',
                    isPressingLeft,
                    isPressingRight,
                });
            }, 300);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) {
                return;
            }

            if (event.key === 'ArrowDown') {
                setTickSpeed(TickSpeed.Fast);
            }

            if (event.key === 'ArrowUp') {
                dispatchBoardState({
                    type: 'move',
                    isRotating: true,
                });
            }

            if (event.key === 'ArrowLeft') {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isPressingLeft = true,
                updateMovementInterval();
            }

            if (event.key === 'ArrowRight') {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isPressingRight = true,
                updateMovementInterval();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown') {
                setTickSpeed(TickSpeed.Normal);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            setTickSpeed(TickSpeed.Normal);
        };
    }, [dispatchBoardState, isPlaying]);


    const renderedBoard = structuredClone(board) as BoardShape; 
    if (isPlaying) {
        addShapeToBoard(
            renderedBoard,
            droppingBlock,
            droppingShape,
            droppingRow,
            droppingColumn
        );
    }
    return {
        board: renderedBoard,
        startGame,
        isPlaying,
    }

    function addShapeToBoard(
        board: BoardShape,
        droppingBlock: Block,
        droppingShape: BlockShape,
        droppingRow: number,
        droppingColumn: number
    ) {
        droppingShape
            .filter((row) => row.some((isSet) => isSet))
            .forEach((row: boolean[], rowIndex: number) => {
                row.forEach((isSet: boolean, colIndex: number) => {
                    if (isSet) {
                        board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
                    }
                });
                
            })
    }

    // return {
    //     board: renderedBoard,
    //     startGame,
    //     isPlaying,
    // };

    

}