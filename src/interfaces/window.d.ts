export { };

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'set' | 'event' | 'consent',
            targetId: string,
            config?: {
                page_path?: string;
                page_title?: string;
                page_location?: string;
                send_to?: string;
                event_category?: string;
                event_label?: string;
                value?: number;
                [key: string]: any;
            }
        ) => void;
        dataLayer: any[];
    }
}
