import { getHighScores } from '../src/hooks/useTetris';
/*
    2. make sure the names and scores match whats in the json

    3. all the names are a string

    4. all the scores are numbers

    4. scores are sorted by descending 
*/


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
})

