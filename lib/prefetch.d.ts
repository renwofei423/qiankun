/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { ImportEntryOpts } from 'import-html-entry';
import { AppMetadata, PrefetchStrategy } from './interfaces';
declare type RequestIdleCallbackHandle = number;

declare global {
    interface Window {
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
}
export declare function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void;
export declare function doPrefetchStrategy(apps: AppMetadata[], prefetchStrategy: PrefetchStrategy, importEntryOpts?: ImportEntryOpts): void;
export {};
