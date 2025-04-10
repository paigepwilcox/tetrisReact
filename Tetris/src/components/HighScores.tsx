import { ScoreBoardData } from '../types';

interface Props {
    scores: ScoreBoardData;
}


function HighScores({scores}: Props) {
    // const [ highScores, setHighScores ] = useState<ScoreBoardData>([]);

    // /* The below causes an infinite rerendering loop since it is in the body of the component body, outside of hooks or event handlers.

    // setHighScores(getHighScores());
    //  */

    // /* The Fix */
    // useEffect(() => {
    //     setHighScores(getHighScores());
    // }, []); // dont forget dependency array means this runs once on render

    if (scores.length === 0) {
        return (
            <div>
                <h2>High Scores</h2>
                <p>No players yet, leave your mark!</p>
            </div>
        );
    } else {
        return (
            <div className="high-scores">
                <h2>High Scores</h2>
                <ol>
                    {scores.map((player, index) => (
                        <li key={index + 1} className="high-score">
                            {player.name}: {player.score}
                        </li>
                    ))}
                </ol>
    
            </div>
        )
    }

}

export default HighScores;