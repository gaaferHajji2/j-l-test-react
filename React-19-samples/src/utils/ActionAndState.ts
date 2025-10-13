export type State = {
    name: string | undefined;
    score: number;
    loading: boolean;
}

export type Action = {
    type: 'initialize';
    name: string;
}
| {
    type: 'increment';
}
| {
    type: 'decrement';
}
| {
    type: 'reset';
}
| {
    type: 'load'
};

export function reducer(state: State, action: Action) : State {
    switch(action.type) {
        case 'initialize':
            return {
                name: action.name,
                score: 0,
                loading: false
            };

        case 'increment':
            return {
                ...state, score: state.score + 1
            };

        case 'decrement':
            return {
                ...state, score: state.score - 1
            };

        case 'reset':
            return {
                ...state, score: 0
            };
        case 'load':
            return {
                name: '', score: 0, loading: true
            }

        default:
            return state;
    }
}