import { createBrowserHistory } from 'history';
import { History } from 'history';

export type ReadonlyBrowserHistory = Readonly<History>
export const browserHistory: ReadonlyBrowserHistory = createBrowserHistory();