import {
  SHOW_USER_ITEMS,
  FILTER_USER_ITEMS_BY_STATUS,
  ADD_ITEM,
} from '../actions/userItems';

export const initialState = {
  user_list: [],
  status: '',
  newItem: [],
  item: '',
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SHOW_USER_ITEMS:
      return {
        ...state,
        user_list: action.userItems,
      };

    case FILTER_USER_ITEMS_BY_STATUS:
      return {
        ...state,
        // eslint-disable-next-line max-len
        connectedUserListsByMode: state.connectedUserListsByMode.filter((item) => item.item_status === action.status),
      };

    case ADD_ITEM:
      return {
        ...state,
        newItem: [...state.newItem, action.user_list.item],
      };

    default:
      return state;
  }
};

export default reducer;
