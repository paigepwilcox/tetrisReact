import { useEffect, useState } from "react";
import PlayerForm from "./PlayerForm"
import { checkScore } from "../hooks/useTetris"
import { PlayerScore } from "../types";

interface Props {
    score: number;
    onSaveScore: (playerScore: PlayerScore) => void;
}

function GameOverScreen({ score, onSaveScore }: Props) {
    const [ showPlayerForm, setShowPlayerForm ] = useState(false);
    const [ playerName, setPlayerName ] = useState('');
    
    useEffect(() => {
        setShowPlayerForm(checkScore(score));
    }, [score])

    const handleChange = (name: string) => {
        setPlayerName(name);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!playerName.trim()) return;

        const playerData = {
            name: playerName.trim(),
            score,
        };

        onSaveScore(playerData);
        setShowPlayerForm(false);
    }

    return (
        <div className="game-over-screen">
            <h1>Game Over</h1>
            <p>Your Score: {score}</p>
            {showPlayerForm && <PlayerForm
                playerName={playerName}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                ></PlayerForm> }
        </div>
    );
}

export default GameOverScreen;