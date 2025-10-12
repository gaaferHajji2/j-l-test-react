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
};