import { getHighScores } from '../src/hooks/useTetris';

describe('HighScores', () => {
    it("All the names have the type string", () => {
        const players = Object.keys(getHighScores());
        const testValue = players.filter(player => typeof player === "string");

        expect(testValue).toEqual(players);
    })

    it("All the scores have the type number", () => {
        const scores = Object.values(getHighScores());
        const testValue = scores.filter(score => typeof score === "number");

        expect(testValue).toEqual(scores);
    })

    it("Scores are sorted in descending order", () => {
        const testValue = Object.values(getHighScores());
        const sortedScores = testValue.sort((a,b) => b.score - a.score);

        expect(testValue).toEqual(sortedScores);
    })
})

