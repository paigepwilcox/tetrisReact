
interface Props {
    playerName: string;
    handleSubmit: (e: React.FormEvent) => void; 
    handleChange: (name: string) => void;
}

const PlayerForm = ({ playerName, handleChange, handleSubmit }: Props) => {

    return (
        <div className="player-form">
            <form onSubmit={handleSubmit} >
                <label htmlFor="name">Enter your name:</label>
                <input 
                    type="text"
                    id="name"
                    value={playerName}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Enter your name"
                />
                <button type="submit" className="player-form-submit-button">Submit & Leave Your Mark!</button>
            </form>
        </div>
    );
};

export default PlayerForm;