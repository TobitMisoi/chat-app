/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
type AppState = {
    inChannel: boolean;
    displayedGroups: [];
    messages: [];
    members: [];
    groups: [];
    currGroup: null;
    modal: null | 'bug' | 'edit' | 'create';
};

type AppAction = {
    type: string;
    payload: {
        currGroup: [];
        displayedGroups: [];
        groups: [];
        messages: [];
        members: [];
        modal: null | 'bug' | 'edit' | 'create';
    };
};

const initialState: AppState = {
    inChannel: false,
    messages: [],
    members: [],
    displayedGroups: [],
    groups: [],
    currGroup: null,
    modal: null
};


const reducer = (state = initialState, action: AppAction) => {
    switch (action.type) {
        case 'CHANGE GROUP':
            return { ...state, currentGroup: action.payload.currGroup, inChannel: true };

        case 'SEARCH':
            return { ...state, displayedGroups: action.payload.displayedGroups };

        case 'FETCH GROUPS':
            return { ...state, displayedGroups: action.payload.displayedGroups, groups: action.payload.groups };

        case 'FETCH MESSAGES':
            return { ...state, messages: action.payload.messages, members: action.payload.members };

        case 'MODAL':
            return { ...state, modal: action.payload.modal };

        case 'EXIT':
            return {
                ...state,
                inChannel: false,
                currGroup: null,
                displayedGroups: state.groups,
                members: [],
                messages: []
            };

        default:
            return state;
    }
};

export default reducer;