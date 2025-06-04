import { useCallback, useEffect, useState } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, PlayerScore, SHAPES, ScoreBoardData } from '../types';
import { useInterval } from "./useInterval";
import { 
    useTetrisBoard, 
    hasCollisions,
    getRandomBlock,
    BOARD_HEIGHT,
    getEmptyBoard,
    } from "./useTetrisBoard";

const STORAGE_KEY = 'tetris_highscores';
const MAX_HIGH_SCORES = 3;

export const getHighScores = (): ScoreBoardData => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
        const initialData: ScoreBoardData = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

        return initialData;
    }

    return JSON.parse(storedData) as ScoreBoardData;
}

export function checkScore(score: number): boolean {
    const existingScores = getHighScores();
    if (existingScores.length < MAX_HIGH_SCORES) {
        return true;
    }

    const isTheScoreAHighScore = existingScores.some((player) => player.score < score);

    return isTheScoreAHighScore;
}

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
    const [ score, setScore ] = useState(0);
    const [ gameOver, setGameOver ] = useState(false);
    const [ highScores, setHighScores ] = useState<ScoreBoardData>([]);

    const [
        { board, droppingRow, droppingColumn, droppingBlock, droppingShape } , dispatchBoardState,
    ] = useTetrisBoard();

    const startGame = useCallback(() => {
        const startingBlocks= [
            getRandomBlock(),
            getRandomBlock(),
            getRandomBlock(),
        ];
        setGameOver(false);
        setScore(0);
        setUpcomingBlocks(startingBlocks);
        setIsCommitting(false);
        setIsPlaying(true);
        setTickSpeed(TickSpeed.Normal);
        dispatchBoardState({ type: 'start' });
    }, [dispatchBoardState]);

    const saveHighScore = useCallback((playerScore: PlayerScore) => {
        const existingScores = getHighScores();
        
        existingScores.push(playerScore);
        const sortedScores = existingScores.sort((a,b) => b.score - a.score);
        const newScores = sortedScores.slice(0, MAX_HIGH_SCORES);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));

        setHighScores(newScores);
            
    }, []);

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

        let numCleared = 0;
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
                numCleared++;
                newBoard.splice(row, 1);
            }
        };

        const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
        const newBlock = newUpcomingBlocks.pop() as Block;
        newUpcomingBlocks.unshift(getRandomBlock());
        

        if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
            setGameOver(true);
            setIsPlaying(false);
            setTickSpeed(null);
        } else {
            setTickSpeed(TickSpeed.Normal);
        }
        setUpcomingBlocks(newUpcomingBlocks);
        setScore((prevScore) => prevScore + getPoints(numCleared));
        dispatchBoardState({ 
            type: 'commit', 
            newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
            newBlock,
        });
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
        setHighScores(getHighScores());
    }, []);

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

            if (event.key === 'ArrowLeft') {
                isPressingLeft = false;
                updateMovementInterval();
            }

            if (event.key === 'ArrowRight') {
                isPressingRight = false;
                updateMovementInterval();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            clearInterval(moveIntervalID);
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
        score,
        upcomingBlocks,
        gameOver,
        highScores,
        saveHighScore
    };
}

function getPoints(numCleared: number): number {
    switch (numCleared) {
        case 0: 
            return 0;
        case 1:
            return 100;
        case 2: 
            return 300;
        case 3: 
            return 500;
        case 4:
            return 800;
        default:
            throw new Error('Unexpected number of rows cleared');
    }
};

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
            
        });
};
